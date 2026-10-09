# Your Pool EDIT sheets: Sandbox 2 partner-preference inputs (grokbot)

Source (read only): `/workspace/k5-split_grokbot/sandbox-repo/k5-s3y63-sandbox2_grokbot/index.html`. Screen 3 is "WHAT YOU WANT", and the What Matters Most (WMM) sheet holds the long questions. I also checked the newer k5-s3y66-sandbox2. It only adds a prenup question and kids count/ages to *her own* answers, and the partner inputs are unchanged.

| Pool step | Site label / question | Options (site order) | Type on site | Any / None Stated / special rules | Pool EDIT sheet (V3) |
|---|---|---|---|---|---|
| Seeking | Seeking | MEN · WOMEN · BOTH | single toggle | none | Same toggle. WOMEN and BOTH are disabled ("no data yet"). |
| City & distance | Distance from <city> (WMM: "How far away can they live?"). Checkbox "I'm open to dating in other cities", then Partner city | Slider stops 1, 3, 5, 10, 15, 20, 25, 30, 40 … 300 mi (35 stops); default 30 | single slider + checkbox | No "Any distance" on the site (max 300) | Same slider and stops. Bubble reads "N miles". Checkbox reveals her signup cities + All my cities. The old "Any distance" is removed. |
| Age | Age (WMM: "How old should they be?") | 21–80 | dual slider | min ≤ max − 1 (thumbs can't meet) | Same dual slider and rule, plus quick picks. The current pick is the highlighted "yours" row with its count (a custom range gets its own row). The signup range 31–54 is tagged "signup". |
| Looking for | Looking for (WMM: "What should they be looking for?") | Any, Casual, Dating, Relationship, Marriage, Life partner | multi | Any is exclusive (clears the rest); empty = Any | Same list. Each row shows +≈N if added and −≈N if removed. |
| Want kids | WMM: "Should they want kids?" | Any, Yes, No, Open to either, Unsure (codes yes / no / open_either_way / not_sure) | **single on the site** | Any = no cut | **Multi-select here** (Amanda asked for it). Any is exclusive. The sheet explains that Open to either = Yes + No and excludes Unsure. |
| Have kids | WMM: "Can they already have kids?" | Any, Yes, No | single | none | Same, radio rows with counts. |
| Height | Height (WMM: "How tall should they be?") | 58–84 in (4’10”–7’0”), labels like 5’10” | dual slider | min ≤ max − 1 | Same dual slider, plus signup / Any height rows. |
| Degree | Degree (WMM: "How much education should they have?") | Any, High school+, Some college+, Associate’s+, Bachelor’s+, Master’s+, Doctorate+, None Stated | select | None Stated = no cut here (the census has no "not stated") | Same select. Each option shows ≈ pool. |
| School tier | School tier (inside the education sheet) | Any tier, Top 100, Top 50, Ivy+ | select | none | Same select, in the same sheet as Degree (both the Degree and Tier bands open it). |
| Income | Income (WMM: "How much should they earn?") | Any, $25k+ … $3M+, None Stated | select | None Stated = no cut; $1M+ / $2M+ / $3M+ disabled ("no data yet") | Same select. |
| Ethnicities | Ethnicities (WMM: "Which ethnicities are you open to?") | Any, White, Black, Asian, Hispanic / Latino, South Asian, MENA, Pacific Islander, Native American, Other, None Stated | multi (race panel) | Any is exclusive; None Stated stacks with the others; ticking every item = Any | Same rules. None Stated adds no one. |
| Religion | Religion (WMM: "Which religions are you open to?") | Any, Agnostic, Atheist, Buddhist, Catholic, Christian, Hindu, Jewish, Muslim, Sikh, Spiritual, Other, None Stated | multi (race panel) | same as Ethnicities | Same rules. None Stated adds no one. |
| Politics | Politics | Any, Left, Left-leaning, Moderate, Right-leaning, Right, Apolitical, None Stated | multi (race panel) | same as Ethnicities | Same rules. Apolitical uses the GSS no answer / don't know share as a stand-in. None Stated adds no one. |

## Math (v5)
- Each question's survey answers are split into **mutually exclusive groups of men**. Each site option maps to the set of groups that would match it.
- Picking several options adds the **union** of their groups, each group counted once. Any = no cut. There are no invented 50/50 splits.
- Shares are normalised to the survey total, so rounding can't push a sum past 100%.
- Want kids groups: Yes / No / Not sure (NSFG 2022–23 yes / no / don't know, blended with Pew 2023 not sure).
  - Yes → yes
  - No → no
  - Unsure → not sure
  - **Open to either → yes + no (excludes not sure)**
  - The old version gave Open to either and Unsure half each of the not-sure share. That was wrong.
- Have kids is computed inside the Want kids groups you accept: P(no child | accepted groups) = Σ share × P(no child | group) / Σ share.
- Intentions groups (Pew W111 per age): in a relationship, not looking, casual only, and committed-only / open-to-either, each split into marry / life partner / relationship. Any = every single man not in a relationship (1 − "in a relationship").
- Politics groups (GSS 7-point): 1–2 Left, 3 Left-leaning, 4 Moderate, 5 Right-leaning, 6–7 Right, no answer = Apolitical.
- Row numbers on multi-select sheets:
  - unselected option: final pool if it were **added** (+)
  - selected option: final pool if it were **removed** (−)
  - Any: the no-cut pool
  - Counts under 100 are shown unrounded (one decimal under 10).
- Monotonic check: `pool_monotonic_check_grokbot.js` tries every subset of Intentions, Want kids, Ethnicity, Religion and Politics in 5 contexts. Adding an option never lowers the step share or the final pool.

## Option → groups → % kept at her age band (31–54, Austin 30 mi)
Each % is the share of men aged 31–54 that the option keeps, before other steps. Ethnicity is among Bachelor’s+ $100k+ men, because it runs after Degree and Income.

| Step | Option | Groups counted | % kept |
|---|---|---|---|
| intent | Any | (no cut) | 58.1% |
| intent | Casual | ca, eiM, eiL, eiR | 24.5% |
| intent | Dating | ca, coM, coL, coR, eiM, eiL, eiR | 34.7% |
| intent | Relationship | coM, coL, coR, eiM, eiL, eiR | 29.2% |
| intent | Marriage | coM, eiM | 14.4% |
| intent | Life partner | coM, coL, eiM, eiL | 20.8% |
| kids | Any | (no cut) | 100.0% |
| kids | Yes | yes | 41.0% |
| kids | No | no | 50.6% |
| kids | Open to either | yes + no | 91.5% |
| kids | Unsure | ns | 8.5% |
| pol | Any | (no cut) | 100.0% |
| pol | Left | L | 16.6% |
| pol | Left-leaning | LL | 12.0% |
| pol | Moderate | M | 39.8% |
| pol | Right-leaning | RL | 13.8% |
| pol | Right | R | 15.6% |
| pol | Apolitical | NA | 2.3% |
| pol | None Stated | (none) | 0.0% |
| relig | Any | (no cut) | 100.0% |
| relig | Agnostic | agnostic | 8.3% |
| relig | Atheist | atheist | 6.9% |
| relig | Buddhist | buddhist | 1.0% |
| relig | Catholic | catholic | 20.2% |
| relig | Christian | christian | 32.3% |
| relig | Hindu | hindu | 0.5% |
| relig | Jewish | jewish | 1.1% |
| relig | Muslim | muslim | 1.2% |
| relig | Sikh | sikh | 0.2% |
| relig | Spiritual | spiritual | 13.1% |
| relig | Other | other | 15.0% |
| relig | None Stated | (none) | 0.0% |
| eth | Any | (no cut) | 100.0% |
| eth | White | white | 62.3% |
| eth | Black | black | 5.6% |
| eth | Asian | asian | 4.2% |
| eth | Hispanic / Latino | hisp | 15.9% |
| eth | South Asian | sasian | 4.2% |
| eth | MENA | mena | 1.3% |
| eth | Pacific Islander | pacific | 0.1% |
| eth | Native American | native | 0.1% |
| eth | Other | other | 6.3% |
| eth | None Stated | (none) | 0.0% |
| kids | Yes + Unsure | yes + ns | 49.4% |
| kids | Yes + Open to either | yes + no (once) | 91.5% |
| kids | Open to either + Unsure | yes + no + ns = all | 100.0% |
| intent | Dating + Relationship + Marriage + Life partner (signup) | ca, coM, coL, coR, eiM, eiL, eiR (once) | 34.7% |
| haskids | Any | (no cut) | 100.0% |
| haskids | Yes | within Want kids = Yes: has a child | 18.4% |
| haskids | No | within Want kids = Yes: no biological child | 81.6% |

