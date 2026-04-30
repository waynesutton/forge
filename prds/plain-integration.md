Created: 2026-04-30 18:00 UTC
Last Updated: 2026-04-30 18:00 UTC
Status: Done

# Plain integration

## Problem

Forge can collect custom form data from Discord slash commands, route it through optional approval, and publish approved answers into Discord. Teams that use Plain for support need a way to send the same custom form data into Plain as a support thread without forcing a Discord destination post.

## Proposed solution

Add Plain as an optional per form destination. Admins can choose Discord, Plain, or both. The slash command, modal submit, role checks, caps, moderation, audit log, and results page stay in Forge. When a submission is ready to publish, Forge routes it based on the form destination:

- Discord creates the existing destination message or forum thread.
- Plain creates a Plain customer and thread from the saved form values.
- Both runs the two destination actions independently.

When Plain creates a thread, Forge sends the submitter a custom Discord DM confirming that the submission was received. Plain only mode does not create a Discord destination post.

## Files to change

- `convex/schema.ts`: add Plain config and tracking fields.
- `convex/plain.ts`: add Plain GraphQL calls, thread creation, and submitter DM.
- `convex/guilds.ts`: store Plain API keys safely and never expose them to clients.
- `convex/forms.ts`: validate per form destination and Plain options.
- `convex/submissions.ts`: expose Plain fields in routing context and store created Plain IDs.
- `convex/discord.ts`: branch final destination routing across Discord, Plain, or both.
- `src/pages/Settings.tsx`: add Plain API key configuration.
- `src/pages/EditForm.tsx`: add destination picker and Plain options.
- `src/pages/FormResults.tsx`: link completed rows to Plain threads.
- `.env.example`, `TASK.md`, `changelog.md`, `files.md`: update project tracking and setup notes.

## Edge cases

- Existing forms must keep working. Missing `destination` means Discord.
- Plain only forms should not require a Discord destination channel.
- Plain selected without a stored Plain API key should fail validation during form save.
- If the Plain key is removed after a form is saved, thread creation should fail gracefully and write an audit row.
- If both destinations are selected, Discord and Plain should fail independently.
- Plain customer upsert requires an email on create. Forge blocks Plain routing unless the form has at least one email field, then uses the first email answer for the Plain customer.
- Plain API errors must not delete or corrupt the Forge submission.

## Verification steps

- Run `npx tsc --noEmit -p convex/tsconfig.json`.
- Run `npx tsc --noEmit -p tsconfig.app.json`.
- Run `npx eslint convex/schema.ts convex/plain.ts convex/guilds.ts convex/forms.ts convex/submissions.ts convex/discord.ts src/pages/Settings.tsx src/pages/EditForm.tsx src/pages/FormResults.tsx`.
- Run `npx convex-doctor@latest`.
- Save a form with destination Discord and confirm existing behavior is unchanged.
- Save a form with destination Plain and confirm no Discord destination post is created.
- Submit a Plain form and confirm a Plain thread, Forge audit row, and Discord DM are created.
- Submit a Both form and confirm Discord publish and Plain thread creation run independently.

## Task completion log

- 2026-04-30 18:00 UTC: PRD created before implementation.
- 2026-04-30 18:00 UTC: Plain routing, API key storage, UI controls, results links, and docs updates completed.
