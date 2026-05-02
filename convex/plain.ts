import { v } from "convex/values";
import {
  action,
  internalAction,
  type ActionCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { requireAllowedViewer } from "./lib/auth";

const PLAIN_API_URL = "https://core-api.uk.plain.com/graphql/v1";
const DISCORD_API_BASE = "https://discord.com/api/v10";

const UPSERT_CUSTOMER_MUTATION = `
  mutation UpsertCustomer($input: UpsertCustomerInput!) {
    upsertCustomer(input: $input) {
      customer { id }
      error { message type code }
    }
  }
`;

const CREATE_THREAD_MUTATION = `
  mutation CreateThread($input: CreateThreadInput!) {
    createThread(input: $input) {
      thread { id }
      error { message type code }
    }
  }
`;

const TEST_CONNECTION_QUERY = `
  query PlainConnectionTest {
    myWorkspace { id name }
  }
`;

type PlainError = {
  message: string;
  type: string;
  code: string;
};

type PlainGraphQLResponse<TData> = {
  data?: TData;
  errors?: Array<{ message?: string }>;
};

type PlainKey = { plainApiKey: string } | null;

type PlainConnectionResult = {
  ok: boolean;
  workspaceName?: string;
  threadId?: string;
  customerId?: string;
  error?: string;
};

type PlainComponentInput =
  | { componentText: { text: string } }
  | { componentPlainText: { plainText: string } }
  | { componentDivider: Record<string, never> };

type PlainField = {
  id: string;
  label: string;
  type:
    | "short"
    | "paragraph"
    | "email"
    | "code"
    | "select"
    | "yes_no"
    | "checkbox"
    | "number";
  minValue?: number;
  maxValue?: number;
  currencyUnit?: string;
  options?: Array<{ id: string; label: string }>;
};

export const testConnection = action({
  args: {
    guildId: v.id("guilds"),
    createThread: v.optional(v.boolean()),
  },
  returns: v.object({
    ok: v.boolean(),
    workspaceName: v.optional(v.string()),
    threadId: v.optional(v.string()),
    customerId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<PlainConnectionResult> => {
    const viewer = await requireAllowedViewer(ctx);
    const key: PlainKey = await ctx.runQuery(internal.guilds.getPlainApiKey, {
      guildId: args.guildId,
    });
    if (!key) {
      return { ok: false, error: "plain_api_key_missing" };
    }

    try {
      const result: {
        myWorkspace: { id: string; name: string } | null;
      } = await plainGraphQL<{
        myWorkspace: { id: string; name: string } | null;
      }>(key.plainApiKey, TEST_CONNECTION_QUERY, {});
      const workspaceName: string | undefined = result.myWorkspace?.name;
      if (!workspaceName) {
        return { ok: false, error: "workspace_not_found" };
      }
      if (!args.createThread) {
        return { ok: true, workspaceName };
      }

      const testThread = await createPlainTestThread(
        key.plainApiKey,
        args.guildId,
        viewer,
      );
      return { ok: true, workspaceName, ...testThread };
    } catch (error) {
      return {
        ok: false,
        error: error instanceof Error ? error.message : "plain_connection_failed",
      };
    }
  },
});

export const createPlainThread = internalAction({
  args: { submissionId: v.id("submissions") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const context = await ctx.runQuery(internal.submissions.routeContext, {
      submissionId: args.submissionId,
    });
    if (!context) return null;

    if (context.submission.plainThreadId) {
      return null;
    }

    const key = await ctx.runQuery(internal.guilds.getPlainApiKey, {
      guildId: context.submission.guildId,
    });
    if (!key) {
      await logPlainFailure(
        ctx,
        args.submissionId,
        "plain_thread_failed",
        "plain_api_key_missing",
      );
      return null;
    }

    const email = findEmailValue(context.form.fields, context.submission.values);
    if (!email) {
      await logPlainFailure(
        ctx,
        args.submissionId,
        "plain_thread_failed",
        "plain_email_missing",
      );
      return null;
    }

    let customerId: string;
    let threadId: string;
    try {
      customerId = await upsertCustomer(key.plainApiKey, {
        externalId: context.submission.submitterId,
        fullName: context.submission.submitterName,
        email,
      });
      threadId = await createThread(key.plainApiKey, {
        customerId,
        title: buildThreadTitle(context.form.title, context.submission._id),
        externalId: context.submission._id,
        description: `${context.form.title} submitted by ${context.submission.submitterName}`,
        labelTypeIds: context.form.plainLabelIds,
        components: buildPlainComponents(context.form.fields, context.submission.values),
      });

      await ctx.runMutation(internal.submissions.markPlainCreated, {
        submissionId: args.submissionId,
        plainThreadId: threadId,
        plainCustomerId: customerId,
      });
    } catch (error) {
      await logPlainFailure(
        ctx,
        args.submissionId,
        "plain_thread_failed",
        error instanceof Error ? error.message : "plain_thread_failed",
      );
      return null;
    }

    try {
      await sendPlainSubmitterDm({
        botToken: context.guild.botToken,
        submitterId: context.submission.submitterId,
        formTitle: context.form.title,
        message: context.form.plainSubmitDmMessage,
      });
    } catch (error) {
      await logPlainFailure(
        ctx,
        args.submissionId,
        "plain_dm_failed",
        error instanceof Error ? error.message : "plain_dm_failed",
      );
    }

    return null;
  },
});

async function upsertCustomer(
  apiKey: string,
  input: { externalId: string; fullName: string; email: string },
): Promise<string> {
  const response = await plainGraphQL<{
    upsertCustomer: {
      customer: { id: string } | null;
      error: PlainError | null;
    };
  }>(apiKey, UPSERT_CUSTOMER_MUTATION, {
    input: {
      identifier: { emailAddress: input.email },
      onCreate: {
        externalId: input.externalId,
        fullName: input.fullName,
        email: { email: input.email, isVerified: false },
      },
      onUpdate: {
        externalId: { value: input.externalId },
        fullName: { value: input.fullName },
        email: { email: input.email, isVerified: false },
      },
    },
  });

  const result = response.upsertCustomer;
  if (result.error) throw new Error(formatPlainError(result.error));
  if (!result.customer?.id) throw new Error("plain_customer_missing");
  return result.customer.id;
}

async function createThread(
  apiKey: string,
  input: {
    customerId: string;
    title: string;
    externalId: string;
    description: string;
    labelTypeIds?: Array<string>;
    components: Array<PlainComponentInput>;
  },
): Promise<string> {
  const response = await plainGraphQL<{
    createThread: {
      thread: { id: string } | null;
      error: PlainError | null;
    };
  }>(apiKey, CREATE_THREAD_MUTATION, {
    input: {
      customerIdentifier: { customerId: input.customerId },
      title: input.title,
      externalId: input.externalId,
      description: input.description,
      labelTypeIds: input.labelTypeIds,
      components: input.components,
      channel: "API",
    },
  });

  const result = response.createThread;
  if (result.error) throw new Error(formatPlainError(result.error));
  if (!result.thread?.id) throw new Error("plain_thread_missing");
  return result.thread.id;
}

async function plainGraphQL<TData>(
  apiKey: string,
  query: string,
  variables: Record<string, unknown>,
): Promise<TData> {
  const response = await fetch(PLAIN_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = (await response.json().catch(() => null)) as
    | PlainGraphQLResponse<TData>
    | null;

  if (!response.ok) {
    throw new Error(`plain_http_${response.status}`);
  }
  if (!json) {
    throw new Error("plain_response_invalid");
  }
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map((error) => error.message ?? "error").join("; "));
  }
  if (!json.data) {
    throw new Error("plain_data_missing");
  }
  return json.data;
}

function buildPlainComponents(
  fields: Array<PlainField>,
  values: Record<string, string>,
): Array<PlainComponentInput> {
  const components: Array<PlainComponentInput> = [
    { componentText: { text: "**Forge submission**" } },
  ];

  for (const field of fields) {
    const value = values[field.id]?.trim();
    if (!value) continue;
    components.push({ componentDivider: {} });
    components.push({ componentText: { text: `**${escapePlainMarkdown(field.label)}**` } });
    components.push({
      componentPlainText: {
        plainText: formatFieldValue(field, value).slice(0, 10000),
      },
    });
  }

  return components;
}

async function createPlainTestThread(
  apiKey: string,
  guildId: Id<"guilds">,
  viewer: Awaited<ReturnType<typeof requireAllowedViewer>>,
): Promise<{ threadId: string; customerId: string }> {
  const email = typeof viewer.email === "string" ? viewer.email : undefined;
  if (!email) {
    throw new Error("viewer_email_missing");
  }
  const fullName =
    typeof viewer.name === "string" && viewer.name.trim().length > 0
      ? viewer.name.trim()
      : email;
  const customerId = await upsertCustomer(apiKey, {
    externalId: `forge-admin-${email}`,
    fullName,
    email,
  });
  const threadId = await createThread(apiKey, {
    customerId,
    title: "Forge Plain test",
    externalId: `forge-test-${guildId}-${Date.now()}`,
    description: "Plain test thread created from Forge Settings.",
    components: buildPlainTestComponents(fullName, email),
  });
  return { threadId, customerId };
}

function buildPlainTestComponents(
  fullName: string,
  email: string,
): Array<PlainComponentInput> {
  return [
    { componentText: { text: "**Forge Plain test**" } },
    {
      componentPlainText: {
        plainText: `Created from Forge Settings for ${fullName} (${email}).`,
      },
    },
  ];
}

function formatFieldValue(field: PlainField, value: string): string {
  if (
    field.type === "select" ||
    field.type === "yes_no" ||
    field.type === "checkbox"
  ) {
    return field.options?.find((option) => option.id === value)?.label ?? value;
  }
  if (field.type === "number") {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return value;
    const unit = field.currencyUnit ? ` ${field.currencyUnit}` : "";
    return new Intl.NumberFormat("en-US").format(parsed) + unit;
  }
  return value;
}

function findEmailValue(
  fields: Array<PlainField>,
  values: Record<string, string>,
): string | undefined {
  const emailField = fields.find((field) => field.type === "email");
  const value = emailField ? values[emailField.id]?.trim() : undefined;
  return value && value.length > 0 ? value : undefined;
}

function buildThreadTitle(formTitle: string, submissionId: string): string {
  return `${formTitle} (${submissionId.slice(-6)})`.slice(0, 120);
}

function formatPlainError(error: PlainError): string {
  return `plain_${error.code}:${error.message}`.slice(0, 500);
}

function escapePlainMarkdown(value: string): string {
  return value.replace(/[*_`[\]]/g, "\\$&");
}

async function sendPlainSubmitterDm(args: {
    botToken: string;
    submitterId: string;
    formTitle: string;
    message?: string;
}): Promise<void> {
  const dmChannelRes = await fetch(`${DISCORD_API_BASE}/users/@me/channels`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${args.botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipient_id: args.submitterId }),
  });
  if (!dmChannelRes.ok) {
    throw new Error(`plain_dm_open_failed_${dmChannelRes.status}`);
  }

  const dmChannel = (await dmChannelRes.json()) as { id?: string };
  if (!dmChannel.id) {
    throw new Error("plain_dm_channel_missing");
  }

  const content =
    args.message ??
    `Your submission to **${escapePlainMarkdown(args.formTitle)}** was received. A support thread has been created.`;
  const postRes = await fetch(`${DISCORD_API_BASE}/channels/${dmChannel.id}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${args.botToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: content.slice(0, 1900) }),
  });
  if (!postRes.ok) {
    throw new Error(`plain_dm_send_failed_${postRes.status}`);
  }
}

async function logPlainFailure(
  ctx: ActionCtx,
  submissionId: Id<"submissions">,
  reason: "plain_thread_failed" | "plain_dm_failed",
  detail: string,
): Promise<void> {
  await ctx.runMutation(internal.submissions.logRoutingSkip, {
    submissionId,
    reason,
    detail: detail.slice(0, 500),
  });
}
