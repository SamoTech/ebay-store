## 2026-09-27 — Synchronize chatbot model documentation

Agent: ChatGPT / GitHub connector

Objective: Correct documentation drift discovered during the AI-agent operating-system audit without changing runtime behavior.

Investigation:
- Current implementation in `app/api/chat/route.ts` was inspected.
- The chatbot uses Groq as the inference provider with model `openai/gpt-oss-20b`.
- Existing source-of-truth, project-status, and README text still described the assistant generically as Groq-backed without identifying the current model.
- No application, affiliate, SEO, analytics, or deployment configuration changes were required.

Changed:
- Updated `docs/AI_AGENT_SOURCE_OF_TRUTH.md` to identify the current chatbot provider/model.
- Updated `docs/PROJECT_STATUS.md` to match the implementation.
- Updated `README.md` API and stack descriptions.
- No runtime code changed.

Validation:
- Repository branch: `docs/sync-ai-model-state`
- Targeted documentation consistency checks: PASS
- CI, lint, typecheck, tests, build: pending branch CI
- Production deployment: NOT VERIFIED for this change
- Production runtime: NOT VERIFIED for this change

Commit/PR:
- Documentation changes committed on the feature branch; PR/merge pending.

Known limitations:
- Direct Vercel deployment inspection is currently unavailable through the connected Vercel authorization.
- GitHub can report Vercel deployment status, but that does not replace direct production runtime verification.

Next agent:
- Verify branch CI.
- Review the final diff.
- Merge only if CI remains green.
- Verify the resulting Vercel deployment and production runtime when access permits.

# AI Development Changelog

This file is the durable chronological trace for AI-agent work. It records verified repository changes and verification limits. It is not a replacement for `CHANGELOG.md` and does not rewrite historical baselines.

## 2026-09-27 — AI operating system audit and state synchronization

Agent: ChatGPT / GitHub connector audit

Task: Establish the requested AI-agent operating protocol and verify the existing repository state before any application change.

Investigation:
- Repository verified: `SamoTech/ebay-store`
- Default branch verified: `main`
- Current HEAD verified: `04c0b5daa817b8c21ba2f83a1e360eea264c2bf1`
- Root `AGENTS.md`, `docs/AI_AGENT_SOURCE_OF_TRUTH.md`, `docs/PROJECT_STATUS.md`, and `docs/DEVELOPMENT_HISTORY.md` inspected.
- Existing role system under `docs/agents/` inspected.
- Current CI workflow inspected.
- Recent merged PR history inspected.
- No open issues were returned for the repository.
- Existing agent documentation was found to pre-date the current project state in places; this audit therefore treats current code/history/status documents as authoritative and avoids rewriting old role-history claims unless required.

Changed:
- Added `docs/PROJECT_STATE.md` as the single current-state handoff document.
- Added `docs/CHANGELOG_AI.md` as the durable AI-agent work log.
- No application/runtime code changed.
- No affiliate, analytics, SEO, AdSense, or production configuration changed.

Validation:
- Repository identity: PASS
- Default branch: PASS
- Current HEAD: PASS
- Existing agent protocol inspected: PASS
- Current source-of-truth/status/history documents inspected: PASS
- CI workflow inspected: PASS
- GitHub commit status for current HEAD: Vercel PASS
- GitHub Actions result for current HEAD: NOT VERIFIED through the available commit-status response
- Local lint: NOT VERIFIED
- Local TypeScript: NOT VERIFIED
- Local tests: NOT VERIFIED
- Local production build: NOT VERIFIED
- Production runtime check: NOT PERFORMED in this documentation-only connector session

Commit/PR:
- Pending the documentation commit created by this session.

Production deployment:
- No production code was changed.
- Current HEAD carries a successful Vercel commit status.

Known limitations:
- This session can modify repository files and inspect GitHub state, but it does not replace an actual local CI/test execution.
- The existing `docs/agents/` files contain some historical wording (for example older test/content counts and dates). They are role/system definitions, not the canonical current-state ledger; current-state claims are maintained in the root/status documents.

Follow-up:
- For the next code task, use the gated workflow in `AGENTS.md` and update `docs/PROJECT_STATE.md` plus this changelog after the work.
