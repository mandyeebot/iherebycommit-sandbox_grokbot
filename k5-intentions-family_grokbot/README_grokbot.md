# K5 + Intentions & Family (sandbox only, build k5if1)

Current production K5 page (pearlouisebot/iherebycommit.com@7e6eb41, PAGE_VERSION 2026-10-05k8) with the singles flow changed to:

Who You Are -> What You Want -> Intentions & Family -> What Matters Most (ranked) -> Public Self -> Text Me (6 steps)

- Intentions & Family is the unchanged production screen-5 markup (Looking for, Relationship/Marriage timing, Have kids, Want kids, Kids timing, Fertility preservation).
- BACK from What Matters Most goes to Intentions & Family; BACK from Public Self goes to What Matters Most.
- Every save / submit / event to Supabase is answered locally with a fake OK: nothing reaches the production database. noindex.
- Couples flow unchanged.

Sandbox only. Does not change iherebycommit.com.
