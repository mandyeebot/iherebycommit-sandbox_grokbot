# Your Pool EDIT sheets: Sandbox 2 partner-preference inputs (grokbot, v6)

## THE RULE (Amanda, Oct 9 2026)
**Every partner preference (what you're looking for) is multi-select; only your own answers are single-choice.**
**Exception (Amanda, Oct 9): every minimum-style "X or more" preference is single-select** — Income (minimum income, like the site's dropdown), Degree (minimum degree) and School tier (nested: Top 100 ⊃ Top 50 ⊃ Ivy+). A pick means "at least this"; Any or None Stated = no cut; each row shows the final pool for that pick. (Ticking Bachelor's+ and Master's+ together made the − / + row numbers look like the pool wasn't growing, because Bachelor's+ already contains Master's+.) Height and Age are ranges, so one answer each.

Each pick maps to non-overlapping survey groups, and several picks count each group once:
- Unordered lists (Looking for, Want kids, Have kids, Ethnicities, Religion, Politics, Seeking, Partner cities): the union of the picked groups.
- Have kids Yes + No = no cut. Seeking Men + Women = Both. Nothing picked = Any (no cut); for Partner cities, nothing = home (Austin).
- None Stated: adds no one on Ethnicity / Religion / Politics (no "not stated" group in the surveys); on Degree / Income it means no cut (as in v5).



Source (read only): `/workspace/k5-split_grokbot/sandbox-repo/k5-s3y63-sandbox2_grokbot/index.html`. Screen 3 is "WHAT YOU WANT", and the What Matters Most (WMM) sheet holds the long questions. I also checked the newer k5-s3y66-sandbox2. It only adds a prenup question and kids count/ages to *her own* answers, and the partner inputs are unchanged.

| Pool step | Site label / question | Options (site order) | Type on site | Pool EDIT sheet (V3, v6) |
|---|---|---|---|---|
| Seeking | Seeking | MEN · WOMEN · BOTH | single toggle | **Multi**: MEN and WOMEN toggle; BOTH = both on. Each shows ≈ pool. Every later step uses that sex's rates; Both = men + women (disjoint, so no double count). First band: MALE / FEMALE / EVERYONE. |
| City & distance | Distance from <city>; "I'm open to dating in other cities"; Partner city | 1, 3, 5, 10 … 300 mi (35 stops) | slider + checkbox + single city | Same slider. Checkbox reveals **multi-select** Partner cities (her 5 signup cities); each tract counts once (stored by exact covering pattern). |
| Age | Age | 21–80 | dual slider | Same dual slider + quick picks (a range is one answer). |
| Intentions (v10) | What should they be looking for? | Any, Committed, Casual, Either (Sandbox 2 Looking For wording) | **single** (Amanda Oct 10) | One pick accepts compatible people (Pew W111 SEEKING): Committed = committed only + either; Casual = casual only + either; Either = everyone looking; Any = no cut, every single person incl. not looking (unchanged). Learn more: Pew 2022 W111 + Pew 2019 W56 comparison. Skipped by the monotonic check (single-select). |
| Want kids | Should they want kids? | Any, Yes, Open to either, No (Sandbox 2 s3y81: Unsure removed) | multi | Multi. Yes = yes + not sure (Amanda: only yes or open to either count). No = no. Open to either = not sure (Sandbox 2 counts a partner's Unsure as Open to either). |
| Have kids | Can they already have kids? | Any, Yes, No | single | **Multi** (Yes + No = no cut). |
| Height | How tall should they be? | 4’10”–7’0” | dual slider | Same (a range is one answer). |
| Degree | How much education should they have? | Any, High school+ … Doctorate+, None Stated | select | **Single select** (minimum degree; radio rows, each with the final pool). |
| School tier | (education sheet) | Any tier, Top 100, Top 50, Ivy+ | select | **Single select** (Top 100 includes Top 50 and Ivy+). Learn more: IPEDS 2009 vs 2016. |
| Income | How much should they earn? | Any, $25k+ … $500k+, $1M+, $2M+, $3M+, None Stated | select | **Single select** (radio rows, each with the final pool), every option enabled. $1M+ / $2M+ / $3M+ tagged EST (Pareto tail; the band badge turns EST). |
| Ethnicities | Which ethnicities are you open to? | Any, White … Other, None Stated | multi (race panel) | Same rules. |
| Religion | Which religions are you open to? | Any, Agnostic … Other, None Stated | multi (race panel) | Same rules. Learn more: GSS vs Pew RLS. |
| Politics | Politics | Any, Left … Apolitical, None Stated | multi (race panel) | Same rules (single source: GSS). |

## Math (v6)
- Each question's survey answers are split into **mutually exclusive groups**, separately for men and women. Shares are normalised to the survey total.
- Want kids groups: Yes / No / Not sure (men: NSFG 2022–23 blended with Pew 2023 under 40; women: NSFG 2022–23 female only).
  - **Yes → yes + not sure** · No → no · Open to either → not sure (v8; Unsure removed on Sandbox 2)
  - Asymmetry to note: No does not include Not sure, while Yes does (Amanda's rule for Yes).
- Have kids runs inside the Want kids groups you accept: P(no child | groups) = Σ share × P(no child | group) / Σ share (men: EVBIOKID; women: PARITY = 0).
- Intentions (v10, single select, Amanda Oct 10): Pew W111 SEEKING per age and sex (men from the published cells, women from Supabase `research_pew_w111`): tk (in a relationship), nl (not looking), ca (casual only), ei (either), co (committed only). Committed = co + ei, Casual = ca + ei, Either = co + ca + ei, Any = 1 − tk (no cut, as before). Comparison (Learn more only): Pew 2019 W56 from Supabase `research_pew_w56`.
- Cities (Amanda Oct 10): the home city is always in and never appears in the Other cities list; a saved copy of it there is dropped (not double counted); changing home (`PoolEngine.setHome`) re-filters the other cities.
- Defaults (v8): Amanda's newest Sandbox 2 single signup (ycoaslgtaaiwfwgytqlm partial_leads, Oct 9 2026 11:56 PM CT, page s3y109): Austin + New York ≤30 mi, age 31–55, height 5'11"–7'0", Intentions Casual (her Looking For = Casual), Want kids Yes + Open to either, Bachelor's+, Top 100, $100k+, the rest Any.
- Income above $500k (v7, EST · IRS SOI 2023): PUMS top-codes, so share ≥ $1M = PUMS share ≥ $500k (single men / women) × P($1M+ | $500k+) for **unmarried** filers (single + head of household) in the city's state, from Supabase `public.research_irs_soi_state_agi` (TX 34.7%, NY 31.3%, CA 30.0%, IL 30.9%). Above $1M: Pareto with a = mean/(mean − $1M) from the mean AGI of $1M+ returns (TX a = 1.44 → $2M+ 12.8%, $3M+ 7.1% of $500k+). Check: `public.research_irs_soi_county` $200k+ class — unmarried returns at $200k+ are 5.0% in Travis, 2.7% Williamson, 3.9% across the 5 Austin counties vs 1.8% in Texas. The older fitted curve (PUMS $300k vs $500k, a = 1.845 men / 2.072 women) stays as the "alone" row in Learn more.
- A School tier pick implies a bachelor's degree, so Income and Ethnicity use Bachelor's+ mixes when a tier is picked (keeps widening Degree from lowering the pool).
- Start counts (v7): Supabase `public.research_acs_b12002_tract` (ACS 2020–24, e006–e016 + e068–e078 + e083–e093 men, e099–e109 + e161–e171 + e176–e186 women), verified tract by tract (md5 over all 85,382 tracts) and by direct SQL for Austin 30 mi (464 tracts: men 367,805 aged 21–80, women 360,670).
- School tier (v7): Top 50 / Top 100 ranked by admit rate (5,000+ applicants) from Supabase `public.research_ipeds_admissions` (2016, 2023), weighted by IPEDS bachelor's completions by sex (classes of 2016 and 2023).
- Several cities: tract counts are stored per exact covering pattern; a tract near several picked cities uses the city mix that keeps the most people, so adding a city never lowers the pool.
- **Learn more** (every EST sheet): one row per source with year, base, its own %, its weight, and the pool if that source were used alone (ages it doesn't cover keep the blend), then the Blended row = what you see. Single-source steps say so.
- Monotonic check: `pool_monotonic_check_grokbot.js` tries every subset of Seeking, Partner cities, Want kids, Have kids, Ethnicity, Religion and Politics in 9 contexts (Income, Degree, School tier and Intentions skipped: single-select). `pool_row_numbers_check_grokbot.js` checks every + / − row number on those multi-select sheets (with picks in place, + never below the pool, − never above) (men, women, both, several cities). Adding a pick never lowers the step share or the final pool.

## Option → groups → % kept at her age band (31–54, Austin 30 mi), men and women
Each % is the share the option keeps at that step with other preferences Any (Ethnicity among Bachelor’s+ $100k+; Tier among Bachelor’s+; Have kids within Want kids = Yes).

| Seeking | Step | Option | Groups counted | % kept |
|---|---|---|---|---|
| men | intent | Any | no cut (every single person, incl. not looking — as before) | 58.1% |
| men | intent | Committed | co + ei | 29.2% |
| men | intent | Casual | ca + ei | 24.5% |
| men | intent | Either | co + ca + ei (everyone looking) | 34.7% |
| men | kids | Yes | yes + ns | 48.9% |
| men | kids | No | no | 51.1% |
| men | kids | Open to either | ns | 8.4% |
| men | haskids | Yes | within Want kids = Yes: has a child | 18.7% |
| men | haskids | No | within Want kids = Yes: no child | 81.3% |
| men | edu | High school+ | hs or more | 91.9% |
| men | edu | Some college+ | sc or more | 73.0% |
| men | edu | Associate’s+ | aa or more | 52.4% |
| men | edu | Bachelor’s+ | ba or more | 44.7% |
| men | edu | Master’s+ | ma or more | 13.6% |
| men | edu | Doctorate+ | phd or more | 3.5% |
| men | edu | None Stated | no cut | 100.0% |
| men | inc | $25k+ | $25000 or more | 78.3% |
| men | inc | $50k+ | $50000 or more | 57.3% |
| men | inc | $75k+ | $75000 or more | 37.1% |
| men | inc | $100k+ | $100000 or more | 25.0% |
| men | inc | $150k+ | $150000 or more | 11.7% |
| men | inc | $200k+ | $200000 or more | 5.8% |
| men | inc | $300k+ | $300000 or more | 2.4% |
| men | inc | $500k+ | $500000 or more | 1.2% |
| men | inc | $1M+ | EST tail $1m or more | 0.33% |
| men | inc | $2M+ | EST tail $2m or more | 0.09% |
| men | inc | $3M+ | EST tail $3m or more | 0.04% |
| men | inc | None Stated | no cut | 100.0% |
| men | tier | Top 100 | top100 | 10.6% |
| men | tier | Top 50 | top50 | 4.9% |
| men | tier | Ivy+ | ivy | 1.4% |
| men | eth | White | white | 62.2% |
| men | eth | Black | black | 5.7% |
| men | eth | Asian | asian | 4.1% |
| men | eth | Hispanic / Latino | hisp | 16.1% |
| men | eth | South Asian | sasian | 4.2% |
| men | eth | MENA | mena | 1.3% |
| men | eth | Pacific Islander | pacific | 0.1% |
| men | eth | Native American | native | 0.1% |
| men | eth | Other | other | 6.2% |
| men | eth | None Stated | (none) | 0.0% |
| men | relig | Agnostic | agnostic | 8.2% |
| men | relig | Atheist | atheist | 6.8% |
| men | relig | Buddhist | buddhist | 1.0% |
| men | relig | Catholic | catholic | 20.2% |
| men | relig | Christian | christian | 33.1% |
| men | relig | Hindu | hindu | 0.5% |
| men | relig | Jewish | jewish | 1.2% |
| men | relig | Muslim | muslim | 1.2% |
| men | relig | Sikh | sikh | 0.2% |
| men | relig | Spiritual | spiritual | 12.9% |
| men | relig | Other | other | 14.7% |
| men | relig | None Stated | (none) | 0.0% |
| men | pol | Left | L | 16.5% |
| men | pol | Left-leaning | LL | 11.9% |
| men | pol | Moderate | M | 39.8% |
| men | pol | Right-leaning | RL | 13.7% |
| men | pol | Right | R | 15.7% |
| men | pol | Apolitical | NA | 2.3% |
| men | pol | None Stated |  | 0.0% |
| women | intent | Any | no cut (every single person, incl. not looking — as before) | 45.8% |
| women | intent | Committed | co + ei | 19.2% |
| women | intent | Casual | ca + ei | 9.4% |
| women | intent | Either | co + ca + ei (everyone looking) | 20.4% |
| women | kids | Yes | yes + ns | 31.8% |
| women | kids | No | no | 68.2% |
| women | kids | Open to either | ns | 4.4% |
| women | haskids | Yes | within Want kids = Yes: has a child | 51.1% |
| women | haskids | No | within Want kids = Yes: no child | 48.9% |
| women | edu | High school+ | hs or more | 91.8% |
| women | edu | Some college+ | sc or more | 75.7% |
| women | edu | Associate’s+ | aa or more | 57.9% |
| women | edu | Bachelor’s+ | ba or more | 51.7% |
| women | edu | Master’s+ | ma or more | 18.7% |
| women | edu | Doctorate+ | phd or more | 4.4% |
| women | edu | None Stated | no cut | 100.0% |
| women | inc | $25k+ | $25000 or more | 75.8% |
| women | inc | $50k+ | $50000 or more | 53.7% |
| women | inc | $75k+ | $75000 or more | 30.8% |
| women | inc | $100k+ | $100000 or more | 19.0% |
| women | inc | $150k+ | $150000 or more | 7.9% |
| women | inc | $200k+ | $200000 or more | 4.1% |
| women | inc | $300k+ | $300000 or more | 1.5% |
| women | inc | $500k+ | $500000 or more | 0.85% |
| women | inc | $1M+ | EST tail $1m or more | 0.20% |
| women | inc | $2M+ | EST tail $2m or more | 0.05% |
| women | inc | $3M+ | EST tail $3m or more | 0.02% |
| women | inc | None Stated | no cut | 100.0% |
| women | tier | Top 100 | top100 | 9.3% |
| women | tier | Top 50 | top50 | 4.0% |
| women | tier | Ivy+ | ivy | 1.0% |
| women | eth | White | white | 63.7% |
| women | eth | Black | black | 7.2% |
| women | eth | Asian | asian | 5.7% |
| women | eth | Hispanic / Latino | hisp | 15.2% |
| women | eth | South Asian | sasian | 1.9% |
| women | eth | MENA | mena | 1.0% |
| women | eth | Pacific Islander | pacific | 0.0% |
| women | eth | Native American | native | 0.0% |
| women | eth | Other | other | 5.1% |
| women | eth | None Stated | (none) | 0.0% |
| women | relig | Agnostic | agnostic | 6.2% |
| women | relig | Atheist | atheist | 5.1% |
| women | relig | Buddhist | buddhist | 1.4% |
| women | relig | Catholic | catholic | 17.7% |
| women | relig | Christian | christian | 43.5% |
| women | relig | Hindu | hindu | 0.9% |
| women | relig | Jewish | jewish | 1.9% |
| women | relig | Muslim | muslim | 1.0% |
| women | relig | Sikh | sikh | 0.2% |
| women | relig | Spiritual | spiritual | 9.8% |
| women | relig | Other | other | 12.3% |
| women | relig | None Stated | (none) | 0.0% |
| women | pol | Left | L | 21.4% |
| women | pol | Left-leaning | LL | 10.8% |
| women | pol | Moderate | M | 39.4% |
| women | pol | Right-leaning | RL | 10.4% |
| women | pol | Right | R | 14.4% |
| women | pol | Apolitical | NA | 3.7% |
| women | pol | None Stated |  | 0.0% |
