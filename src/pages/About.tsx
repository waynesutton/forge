import { useEffect } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  ChatCircleText,
  CheckSquare,
  ClipboardText,
  Code,
  Copy,
  Envelope,
  Export,
  FileText,
  Hash,
  Hammer,
  Lightning,
  ListChecks,
  LockKey,
  PaperPlaneTilt,
  SlidersHorizontal,
  Sparkle,
  Ticket,
  Timer,
  UsersThree,
} from "@phosphor-icons/react";

// Public marketing page for Forge. Lives at /about. No header, no footer.
// Paper.design inspired: huge display type, stacked feature blocks, and
// large editorial mockups in public/about/*.svg. Matches the Forge palette
// (ink, accent, beige) so anyone landing here sees the same aesthetic as
// the signed-in app.
export function About() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Forge — About";
    window.scrollTo({ top: 0, behavior: "auto" });
    return () => {
      document.title = previousTitle;
    };
  }, []);

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-ink)]">
      <HeroSection />
      <IntroSection />
      <BuilderSection />
      <DiscordSection />
      <FeatureIndex />
      <TicketSection />
      <ResultsSection />
      <StackSection />
      <CtaSection />
    </main>
  );
}

// Top of the page. Huge display headline, short subtitle, mark logo.
// Generous vertical space mimics paper.design's opening move.
function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32 lg:pt-36 lg:pb-40">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-window)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <Lightning size={20} weight="fill" color="var(--color-accent)" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Forge</span>
          <span className="text-xs text-[var(--color-muted)]">/ about</span>
        </div>

        <h1 className="max-w-[18ch] text-[11vw] leading-[0.95] font-semibold tracking-[-0.03em] sm:text-[88px] sm:leading-[0.92] lg:text-[132px] lg:leading-[0.9]">
          Build Discord forms that don{"\u2019"}t feel like forms.
        </h1>

        <div className="grid max-w-5xl gap-8 lg:grid-cols-[1.2fr_1fr]">
          <p className="text-xl leading-relaxed text-[var(--color-ink)] sm:text-2xl">
            Forge is a self hostable form builder and approval engine for Discord
            servers. Design forms in a browser. Publish them as slash commands.
            Route submissions through a mod queue. Publish approved answers into
            any text or forum channel. One Convex deployment, end to end.
          </p>
          <div className="flex flex-col justify-end gap-3">
            <Link
              to="/"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-ink)] bg-[var(--color-ink)] px-5 py-3 text-sm font-medium text-[var(--color-surface)] shadow-[var(--shadow-window)] transition-transform duration-150 active:translate-y-px">
              Sign in with GitHub
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link
              to="/docs"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">
              Read the setup guide
              <ArrowUpRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Short positioning paragraph. Two columns. Left side sets the scene, right
// side lists the three things Forge replaces.
function IntroSection() {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-[1400px] gap-14 px-6 py-24 sm:px-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:py-32">
        <div className="flex flex-col gap-4">
          <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-muted)] uppercase">
            What it is
          </span>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            One app, every step of the form.
          </h2>
        </div>
        <div className="flex flex-col gap-6 text-lg leading-relaxed text-[var(--color-ink)]">
          <p>
            Forge is for teams who already live inside Discord. Applications,
            bug bounties, support tickets, internal requests, anything you
            would otherwise wire up with three bots and a spreadsheet.
          </p>
          <p className="text-[var(--color-muted)]">
            Forge replaces the Google Form plus Zapier plus mod bot stack with
            one Convex deployment. No worker process. No webhook server. No
            polling. Submit, review, publish, resolve, all in the same place.
          </p>
        </div>
      </div>
    </section>
  );
}

// First product mockup. Full width beige band framing the builder screenshot.
// Caption sits to the side in large display type.
function BuilderSection() {
  return (
    <section className="bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-muted)] uppercase">
              Design
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[64px] lg:leading-[1.02]">
              A visual builder that speaks Discord.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-[var(--color-ink)]">
            Drag, drop, rename, reorder. Eight field types cover the real shape
            of a Discord modal: short text, paragraph, email, code block, single
            select, yes or no, checkbox, and number with min, max, and a
            currency unit label. A live preview mirrors exactly what your users
            will see when the slash command fires.
          </p>
        </div>

        <figure className="overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-window)]">
          <img
            src="/about/builder.svg"
            alt="Forge form builder with command settings on the left, modal fields in the middle, and a live Discord preview on the right"
            className="block h-auto w-full"
          />
        </figure>

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <BuilderPoint
            icon={<SlidersHorizontal size={18} weight="bold" />}
            title="Eight field types"
            body="Short, paragraph, email, code, select, yes or no, checkbox, number."
          />
          <BuilderPoint
            icon={<Lightning size={18} weight="fill" />}
            title="One click publish"
            body="Register each form as a guild slash command without leaving the editor."
          />
          <BuilderPoint
            icon={<Code size={18} weight="bold" />}
            title="Helpers per field"
            body="Placeholder, length bounds, required flag, option validation, helper text."
          />
          <BuilderPoint
            icon={<Sparkle size={18} weight="bold" />}
            title="Live Discord preview"
            body="See the modal exactly as your submitters will see it, in real time."
          />
        </ul>
      </div>
    </section>
  );
}

function BuilderPoint({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex flex-col gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-accent)]">
        {icon}
      </span>
      <span className="text-base font-semibold text-[var(--color-ink)]">{title}</span>
      <span className="text-sm text-[var(--color-muted)]">{body}</span>
    </li>
  );
}

// Dark Discord mockup band to break rhythm. Huge caption on top, embed below.
function DiscordSection() {
  return (
    <section className="bg-[#1f2024] text-[#f2f3f5]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-16 px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#9aa0aa] uppercase">
              Moderate
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[76px] lg:leading-[0.98]">
              Approve, deny, publish. From inside Discord.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-[#dbdee1]">
            Every submission lands in a mod queue channel with real buttons.
            Approve posts the answer to the destination channel or forum thread.
            Deny opens a reason modal and DMs the submitter. The embed rewrites
            itself so the next moderator knows who decided what.
          </p>
        </div>

        <figure className="overflow-hidden rounded-[20px] border border-[#2b2d31] shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          <img
            src="/about/queue.svg"
            alt="Discord mod queue embed showing a pending application with Approve, Deny, and Open ticket buttons"
            className="block h-auto w-full"
          />
        </figure>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <DarkPoint
            title="Mod queue with approve and deny"
            body="Real Discord buttons wired to the same decision pipeline as the dashboard. Whichever side a mod uses, the embed, audit log, and submitter DM all stay in sync."
          />
          <DarkPoint
            title="Deny reason modal"
            body="Trimmed reason up to 500 characters. Stored on the submission, shown in the embed footer, and DMed to the submitter."
          />
          <DarkPoint
            title="Publish to text or forum"
            body="Text channel posts, forum threads with title templates and applied tags, optional submitter handle pill, moderator name in footer toggle."
          />
        </div>
      </div>
    </section>
  );
}

function DarkPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-3 border-t border-[#3f4249] pt-5">
      <h3 className="text-xl font-semibold text-[#f2f3f5]">{title}</h3>
      <p className="text-sm leading-relaxed text-[#b5bac1]">{body}</p>
    </div>
  );
}

// Exhaustive feature list as a typographic index. No cards, just a dense
// editorial table of everything Forge ships.
function FeatureIndex() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-12 px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-muted)] uppercase">
              Every feature
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[64px] lg:leading-[1]">
              The whole feature list.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-[var(--color-muted)]">
            Not a wishlist. Everything here ships in the current build and is
            wired into the dashboard at the moment a new admin signs in.
          </p>
        </div>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-x-24">
          <FeatureGroup
            icon={<Hammer size={18} weight="bold" />}
            label="Build"
            items={[
              "Visual form builder with live Discord modal preview",
              "Eight field types: short, paragraph, email, code, select, yes or no, checkbox, number",
              "Per field helper text, placeholder, required toggle, min and max length",
              "Option validation for select, yes or no, and checkbox fields",
              "Min, max, and currency unit label on number fields",
              "Code fields render as copyable code blocks in Discord embeds",
              "Email fields marked private by default",
            ]}
          />
          <FeatureGroup
            icon={<PaperPlaneTilt size={18} weight="bold" />}
            label="Publish"
            items={[
              "One click slash command registration per form",
              "Update the live command from the editor at any time",
              "Publish destination can be a text channel or a forum thread",
              "Forum thread titles templated with `{fieldId}` interpolation",
              "Optional applied forum tag per form",
              "Optional submitter handle pill on every published post",
              "Moderator name in embed footer toggle",
            ]}
          />
          <FeatureGroup
            icon={<CheckSquare size={18} weight="bold" />}
            label="Moderate"
            items={[
              "Mod queue channel with Approve and Deny buttons",
              "Deny reason modal, capped at 500 characters",
              "Approve and Deny also available on the results page in the dashboard",
              "Auto publish path when approval is off",
              "Per form required, blocked, and moderator role gates",
              "Role lists sourced live from cached guild roles",
              "Per user lifetime and per day submission caps",
              "Custom Discord success message per form",
            ]}
          />
          <FeatureGroup
            icon={<Ticket size={18} weight="bold" />}
            label="Ticket mode"
            items={[
              "Turn any form into a support or bounty request workflow",
              "Lifecycle buttons for Claim, Unclaim, Resolve, Reopen, and Close",
              "Optional claim role and resolve role gates per form",
              "Assignee name and status rendered inside the embed footer",
              "Auto close inactive tickets after a configurable number of days",
              "Forum threads archive and unarchive on close and reopen",
            ]}
          />
          <FeatureGroup
            icon={<ListChecks size={18} weight="bold" />}
            label="Review"
            items={[
              "Per form results page with submitter, values, status, and timestamps",
              "Hide and Unhide rows without touching Discord",
              "Delete rows with an optional Discord message cleanup checkbox",
              "Reply in Discord composer that posts as the bot with no pings",
              "CSV export with quoting, option labels, and formatted numbers",
              "PDF export paginated with field labels, timestamps, and deny reasons",
              "Field level copy buttons across every value",
            ]}
          />
          <FeatureGroup
            icon={<ClipboardText size={18} weight="bold" />}
            label="Observe"
            items={[
              "Per form audit log with every submission, decision, and ticket action",
              "Success and error rows with severity filtering",
              "Plain English translations for known Discord REST error codes",
              "Expandable metadata panel with a one click copy button",
              "Hourly cron sweep that closes stale tickets automatically",
              "Real time dashboard updates over Convex subscriptions",
            ]}
          />
        </div>

        <FeatureLegend />
      </div>
    </section>
  );
}

function FeatureGroup({
  icon,
  label,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  items: Array<string>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-accent)]">
          {icon}
        </span>
        <span className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
          {label}
        </span>
      </div>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li
            key={item}
            className="border-t border-[var(--color-border)] py-3.5 text-base leading-relaxed text-[var(--color-ink)] last:border-b">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Small legend of single icon + label rows under the feature groups. Echoes
// the dense typographic rhythm without repeating the group list copy.
function FeatureLegend() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-[var(--color-border)] pt-10 sm:grid-cols-3 lg:grid-cols-6">
      <LegendItem icon={<FileText size={14} weight="bold" />} label="Forms" />
      <LegendItem icon={<Hash size={14} weight="bold" />} label="Slash commands" />
      <LegendItem icon={<UsersThree size={14} weight="bold" />} label="Role gates" />
      <LegendItem icon={<Timer size={14} weight="bold" />} label="Caps and cooldowns" />
      <LegendItem icon={<ChatCircleText size={14} weight="bold" />} label="DMs on decide" />
      <LegendItem icon={<LockKey size={14} weight="bold" />} label="Private fields" />
      <LegendItem icon={<Envelope size={14} weight="bold" />} label="Success message" />
      <LegendItem icon={<Copy size={14} weight="bold" />} label="Copy anywhere" />
      <LegendItem icon={<Export size={14} weight="bold" />} label="CSV and PDF" />
      <LegendItem icon={<ClipboardText size={14} weight="bold" />} label="Audit log" />
      <LegendItem icon={<Timer size={14} weight="bold" />} label="Hourly cron" />
      <LegendItem icon={<Sparkle size={14} weight="bold" />} label="Real time sync" />
    </div>
  );
}

function LegendItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
      <span className="text-[var(--color-accent)]">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// Ticket lifecycle visual on a beige panel.
function TicketSection() {
  return (
    <section className="bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-muted)] uppercase">
              Ticket mode
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[72px] lg:leading-[0.98]">
              Tickets with a first and last mile.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-[var(--color-ink)]">
            Claim buttons assign a moderator. Resolve closes the loop. Close
            archives the forum thread. Reopen brings it back. Every lifecycle
            change refreshes the embed footer, writes an audit row, and keeps
            the dashboard in lock step.
          </p>
        </div>

        <figure className="overflow-hidden rounded-[20px] border border-[var(--color-border)] shadow-[var(--shadow-window)]">
          <img
            src="/about/ticket.svg"
            alt="Three forum threads side by side showing ticket lifecycle: open, in progress, and resolved"
            className="block h-auto w-full"
          />
        </figure>
      </div>
    </section>
  );
}

// Results dashboard mockup with the full toolbar visible.
function ResultsSection() {
  return (
    <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-14 px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-[var(--color-muted)] uppercase">
              Review
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[64px] lg:leading-[1.02]">
              A results page that respects your moderators.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-[var(--color-ink)]">
            Every submission in one table. Status pills, copy buttons on every
            value, per row Hide and Delete, Approve and Deny on pending rows
            when approval is on, a dashed soft hide row for spam, CSV and PDF
            export, and a bot authored Reply in Discord composer that posts
            back into the published thread.
          </p>
        </div>

        <figure className="overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-window)]">
          <img
            src="/about/results.svg"
            alt="Results dashboard with approved, pending, denied, in progress, and hidden rows plus a Reply in Discord composer"
            className="block h-auto w-full"
          />
        </figure>
      </div>
    </section>
  );
}

// Stack section sits dark and tight. Short list, strong typography.
function StackSection() {
  return (
    <section className="bg-[#151515] text-[#f2f3f5]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-16 px-6 py-24 sm:px-10 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-[#9aa0aa] uppercase">
              Stack
            </span>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[72px] lg:leading-[0.98]">
              Type safe from Convex to React.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-[#b5bac1]">
            Built for full stack developers who want one deployment and
            reactive subscriptions instead of polling. Submit a form in Discord
            and watch the row appear in the dashboard as it lands.
          </p>
        </div>

        <div className="grid gap-x-16 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          <StackItem label="Frontend" value="React 19, Vite 6, Tailwind v4, React Router 7" />
          <StackItem label="Backend" value="Convex queries, mutations, actions, crons" />
          <StackItem label="Auth" value="Convex Auth with GitHub OAuth" />
          <StackItem label="Hosting" value="@convex-dev/static-hosting" />
          <StackItem label="Discord" value="Interactions API, guild commands, modals" />
          <StackItem label="Icons" value="Phosphor Icons" />
          <StackItem label="Export" value="jsPDF for PDF, native strings for CSV" />
          <StackItem label="DX" value="Typed end to end, zero webhook plumbing" />
        </div>
      </div>
    </section>
  );
}

function StackItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-[#2a2a2a] pt-5">
      <span className="text-xs font-semibold tracking-[0.25em] text-[#9aa0aa] uppercase">
        {label}
      </span>
      <span className="text-base leading-relaxed text-[#f2f3f5]">{value}</span>
    </div>
  );
}

// Final CTA. Two links. Keep it quiet.
function CtaSection() {
  return (
    <section className="bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-6 py-24 sm:px-10 lg:py-32">
        <h2 className="max-w-[22ch] text-5xl font-semibold tracking-tight sm:text-6xl lg:text-[96px] lg:leading-[0.98]">
          One deployment. Every step of the form.
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-ink)] bg-[var(--color-ink)] px-6 py-4 text-base font-medium text-[var(--color-surface)] shadow-[var(--shadow-window)] transition-transform duration-150 active:translate-y-px">
            Sign in to Forge
            <ArrowRight size={18} weight="bold" />
          </Link>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-base font-medium text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]">
            Read the docs
            <ArrowUpRight size={18} weight="bold" />
          </Link>
        </div>

        <p className="border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-muted)]">
          For Convex by Convex.
        </p>
      </div>
    </section>
  );
}
