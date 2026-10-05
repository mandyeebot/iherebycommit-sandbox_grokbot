# Pre-K5 production onboarding (sandbox archive)

Faithful copy of the last live production `index.html` **before** K5 shipped, with a **fake-save guard**.

- Source repo: `pearlouisebot/iherebycommit.com`
- Commit: `b4525d0b` — What You Want: tighter spacing (PAGE_VERSION **2026-09-27r**) — PR #56
- Immediately precedes K5 production push `edb4c970` / PR #62 (PAGE_VERSION 2026-10-05k5)
- Includes Intentions & Family (singles) / Family & Intentions (couples)
- Also ships `cities_grokbot.json`, `privacy/`, `terms/` from the same commit so relative links work
- **Safety:** early `fetch` / `sendBeacon` / `XHR` stub answers every `supabase.co` and Turnstile call with a local fake OK. No save-lead / submit-application / application-count traffic reaches production. Visible sandbox badge. `noindex`.

Sandbox only. Does not change iherebycommit.com.
