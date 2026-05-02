Created: 2026-05-02 20:30 UTC
Last Updated: 2026-05-02 20:30 UTC
Status: Done

# Plain routing diagnostics

## Problem

Plain support routing has three gaps after the first integration pass:

- The Settings test only verifies the Plain API key and workspace. It does not create anything visible in Plain, so a successful test can feel like nothing happened.
- Plain routing failures are logged, but the form logs page does not mark Plain failures as errors.
- Plain only forms hide Discord destination controls correctly, but they also hide the approval queue channel selector. Requires approval still needs a Discord approval queue before the final destination runs.

## Root cause

The UI grouped approval queue selection together with Discord destination selection under `usesDiscordDestination`. Plain only sets that flag false, so the approval queue selector disappears even when `requiresApproval` is true. Backend routing still expects `form.modQueueChannelId` for every approval flow, so submissions are logged as `mod_queue_channel_missing` and never reach approval or Plain thread creation.

Plain errors are stored through `submissions.logRoutingSkip`, but `auditLog.ERROR_ACTIONS` and `FormLogs.ACTION_LABELS` do not include the Plain actions yet.

The Plain test action uses `myWorkspace`, which is the right lightweight connectivity check, but it does not prove create permissions or render a visible thread in Plain.

## Proposed solution

- Keep Plain key connection testing as a lightweight test.
- Add a separate Plain test thread action that creates a customer and thread using the signed in admin's email.
- Show approval queue channel selection whenever `requiresApproval` is on, even when final destination is Plain only.
- Keep Discord destination channel and forum controls hidden for Plain only.
- Mark Plain thread and Plain DM failures as errors in form logs.
- Split Plain thread creation from Plain submitter DM failure handling so a Discord DM failure does not masquerade as a Plain API failure.

## Files to change

- `convex/plain.ts`
- `convex/auditLog.ts`
- `src/pages/FormLogs.tsx`
- `src/pages/EditForm.tsx`
- `src/pages/Settings.tsx`
- `TASK.md`
- `changelog.md`
- `files.md`

## Edge cases

- A successful Plain connection test should still not create a Plain thread.
- A Plain test thread requires the signed in admin to have an email address.
- Plain only plus Requires approval must require an approval queue channel, but must not require a Discord destination channel.
- If Plain thread creation succeeds but Discord DM fails, Forge should keep the Plain thread ID and log only the DM failure.

## Verification steps

- Run `npx tsc --noEmit -p convex/tsconfig.json`.
- Run `npx tsc --noEmit -p tsconfig.app.json`.
- Run targeted ESLint on changed files.
- Save a Plain only form with Requires approval and an approval queue channel.
- Submit and approve the form, then confirm a Plain thread ID, log entry, and submitter DM behavior.

## Task completion log

- 2026-05-02 20:30 UTC: PRD created before implementation.
- 2026-05-02 20:30 UTC: Plain approval queue visibility, Plain log severity, visible Plain test thread creation, and verification completed.
