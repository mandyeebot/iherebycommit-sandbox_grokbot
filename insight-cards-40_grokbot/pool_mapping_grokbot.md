# Your Pool: app question → answer → % (men) mapping

Rebuilt Oct 9, 2026 (CT) by `/workspace/pool_map_grokbot/build_v5_grokbot.py` (v5: options mirror the Sandbox 2 s3y63 inputs; see pool_edit_inputs_grokbot.md for the input list and option → group mapping). CSV: `/workspace/pool_mapping_grokbot.csv` (one row per question × option × age band).

Rule (Amanda): every funnel step and EDIT option uses the IHereByCommit onboarding wording (sandbox `ranked-any-k11_grokbot/index.html`, K4M What Matters Most + What You Want), and each answer gets a realistic % from one source or a documented blend. Badges: **CENSUS** = direct ACS count, **CDC** = direct NHANES, **EST** = blend.

App options used (Sandbox 2 s3y63): Distance slider stops 1–300 mi (35 stops, default 30); Age dual slider 21–80; Height dual slider 4’10”–7’0”; Intentions Any / Casual / Dating / Relationship / Marriage / Life partner (multi); Want kids Any / Yes / No / Open to either / Unsure (multi here, single on the site); Have kids Any / Yes / No; Degree and Income selects incl. None Stated; School tier Any tier / Top 100 / Top 50 / Ivy+; Ethnicities, Religion, Politics (7 options) multi with None Stated.

## Blends and weights

| Step | Badge | Sources and weights | Assumptions |
|---|---|---|---|
| City & distance, Age | CENSUS | ACS 2020–24 5-yr B12002, single (never married + divorced + widowed) men by age group, tracts within radius of each city; All my cities = union of tracts; Any = U.S. | partial age groups counted by share of years |
| Intentions | EST | Pew ATP W111 Jul 2022 (men, not married): in a relationship / not looking / casual only / open to either / committed only, by Pew age 18–29, 30–49, 50–64, 65+ (n=279/503/422/293). Want-to-marry blend: 18–29 = Pew 2025 73%×0.4 + AEI 2021 76%×0.3 + Pew 2023 men 72%×0.3 = **73.6%**; 30–49 = Pew 2025 49%×0.4 + AEI 56%×0.4 + SIA 2026 44.6%×0.2 = **50.9%**; 50–64 = AEI 50+ 39%×0.6 + Pew 2013 remarry men 29%×0.2 + SIA 44.6%×0.2 = **38.1%**; 65+ = AEI 39%×0.4 + Pew 2013 29%×0.6 = **33.0%**. Long-term-without-marriage share of committed seekers not set on marriage: SIA 2026 Q55 30.0/(30.0+39.9) = **42.9%** | Dating = anyone looking; Casual = casual-only + open to either; Relationship = committed-only + open to either; Marriage = committed seekers × want-to-marry; Life partner = Marriage + 42.9% of the rest; multi-select = union; Any = all single men (excludes the ~43% of unmarried men 30–49 already partnered). Want-to-marry assumed independent of committed-only vs either |
| Want kids | EST | NSFG 2022–23 RWANT, unmarried non-cohabiting men by 5-yr age (n=168–685) blended with Pew ATP 2023 (men 18–34 childless: 57% / 15% / 28% not sure) at 0.4 under 35, 0.2 at 35–39 | Three exclusive groups yes / no / not sure. Open to either = yes + no; Unsure = not sure (no 50/50 split). 50–54 carries 45–49; older ages scaled down |
| Have kids | EST | NSFG 2022–23 EVBIOKID within the Want kids groups accepted | 50+ carries 45–49 |
| Height | CDC | NHANES Aug 2021–Aug 2023 + 2017–Mar 2020 measured, men by decade, rounded to the inch, waves averaged (n=886–1,477 per decade) | direct |
| Degree, Income, Ethnicity | CENSUS | ACS 2020–24 PUMS, single men, PUMAs inside 30 mi of each city, by age group; income among men who pass Degree; ethnicity among men who pass Degree + Income (MENA = ancestry 400–499, South Asian = detailed race) | $500k+ small samples; $1M+ no data (Census top-codes) → disabled “no data yet”; Doctorate+ includes MD/JD |
| Education tier | EST | NCES IPEDS completions 2008–09 + 2015–16 (men’s bachelor’s) × admissions; averaged | Ivy+ = 8 Ivies + Stanford, MIT, Chicago, Duke (1.4%); Top 50 / Top 100 = 50 / 100 most selective by admit rate with ≥5,000 applicants (4.9% / 10.6%) as a ranking stand-in |
| Religion | EST | GSS 2018–2024 unmarried men, weighted (n=356–712 per age group); Jewish / Muslim / Buddhist / Hindu = 50% GSS + 50% Pew RLS 2023–24 (1.7 / 1.2 / 1.1 / 0.9%) | no-religion split 5:6:19 atheist : agnostic : nothing in particular (Pew RLS); nothing in particular half Spiritual, half Other; Sikh 0.2% |
| Politics | EST | GSS 2018–2024 polviews 7-point, unmarried men, weighted | 1–2 Left, 3 Left-leaning, 4 Moderate, 5 Right-leaning, 6–7 Right, no answer = Apolitical (stand-in); None Stated adds no one |

## Mapping table (men)

### Intentions (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Any (single men) | 18-29 | 73.8 | Pew ATP W111 Jul 2022 | 100% Pew W111: share of unmarried men not in a relationship |
| Casual | 18-29 | 34.4 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: casual-only + open-to-either |
| Dating | 18-29 | 43.4 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: looking for dates or a relationship (any) |
| Relationship | 18-29 | 33.0 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: committed-only + open-to-either |
| Marriage | 18-29 | 24.3 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111 committed-or-either x want-to-marry blend 73.6% (Pew ATP 2025, never-married 18-29 73% w0.4; AEI 2021, singles 18-29 76% w0.3; Pew ATP 2023, never-married men 18-34 72% w0.3) |
| Life Partner | 18-29 | 28.0 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | marriage share + committed seekers not set on marriage x 42.9% open to long-term committed w/o marriage (SIA 2026 Q55 30.0 vs 39.9) |
| Any (single men) | 30-49 | 56.8 | Pew ATP W111 Jul 2022 | 100% Pew W111: share of unmarried men not in a relationship |
| Casual | 30-49 | 25.0 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: casual-only + open-to-either |
| Dating | 30-49 | 35.5 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: looking for dates or a relationship (any) |
| Relationship | 30-49 | 29.8 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: committed-only + open-to-either |
| Marriage | 30-49 | 15.2 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111 committed-or-either x want-to-marry blend 50.9% (Pew ATP 2025, never-married 30-49 49% w0.4; AEI 2021, singles 30-49 56% w0.4; SIA 2026, singles 18+ 45% w0.2) |
| Life Partner | 30-49 | 21.5 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | marriage share + committed seekers not set on marriage x 42.9% open to long-term committed w/o marriage (SIA 2026 Q55 30.0 vs 39.9) |
| Any (single men) | 50-64 | 66.7 | Pew ATP W111 Jul 2022 | 100% Pew W111: share of unmarried men not in a relationship |
| Casual | 50-64 | 20.7 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: casual-only + open-to-either |
| Dating | 50-64 | 28.9 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: looking for dates or a relationship (any) |
| Relationship | 50-64 | 24.9 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: committed-only + open-to-either |
| Marriage | 50-64 | 9.5 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111 committed-or-either x want-to-marry blend 38.1% (AEI 2021, singles 50+ 39% w0.6; Pew 2013, previously married men want to remarry 29% w0.2; SIA 2026, singles 18+ 45% w0.2) |
| Life Partner | 50-64 | 16.1 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | marriage share + committed seekers not set on marriage x 42.9% open to long-term committed w/o marriage (SIA 2026 Q55 30.0 vs 39.9) |
| Any (single men) | 65+ | 78.4 | Pew ATP W111 Jul 2022 | 100% Pew W111: share of unmarried men not in a relationship |
| Casual | 65+ | 17.1 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: casual-only + open-to-either |
| Dating | 65+ | 20.0 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: looking for dates or a relationship (any) |
| Relationship | 65+ | 16.3 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111: committed-only + open-to-either |
| Marriage | 65+ | 5.4 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | Pew W111 committed-or-either x want-to-marry blend 33.0% (AEI 2021, singles 50+ 39% w0.4; Pew 2013, previously married men want to remarry 29% w0.6) |
| Life Partner | 65+ | 10.1 | Pew W111 2022; Pew 2023/2025; AEI 2021; SIA 2026; Pew 2013 | marriage share + committed seekers not set on marriage x 42.9% open to long-term committed w/o marriage (SIA 2026 Q55 30.0 vs 39.9) |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 20-24 | 67.3 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 20-24, n=387), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 20-24 | 17.9 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 20-24, n=387), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 20-24 | 85.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 20-24, n=387), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 20-24 | 14.8 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 20-24, n=387), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 20-24 | 97.3 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 25-29 | 64.5 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 25-29, n=421), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 25-29 | 22.0 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 25-29, n=421), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 25-29 | 86.6 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 25-29, n=421), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 25-29 | 13.4 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 25-29, n=421), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 25-29 | 93.6 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 30-34 | 59.4 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 30-34, n=384), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 30-34 | 27.1 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 30-34, n=384), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 30-34 | 86.5 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 30-34, n=384), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 30-34 | 13.5 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 30-34, n=384), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.4; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 30-34 | 89.0 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 35-39 | 44.6 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 35-39, n=322), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.2; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 35-39 | 45.4 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 35-39, n=322), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.2; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 35-39 | 90.0 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 35-39, n=322), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.2; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 35-39 | 10.0 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 35-39, n=322), Pew ATP 2023 men 18-34 childless 57/15/28 at weight 0.2; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 35-39 | 69.7 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 40-44 | 32.1 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 40-44, n=237); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 40-44 | 62.0 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 40-44, n=237); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 40-44 | 94.1 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 40-44, n=237); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 40-44 | 5.9 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 40-44, n=237); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 40-44 | 64.4 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 45-49 | 23.3 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 45-49 | 73.4 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 45-49 | 96.8 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 45-49 | 3.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 45-49 | 53.6 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 50-54 | 23.3 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 50-54 | 73.4 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 50-54 | 96.8 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 50-54 | 3.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168); base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 50-54 | 53.6 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men (45-49 carried) |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 55-59 | 11.7 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.50 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 55-59 | 85.1 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.50 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 55-59 | 96.8 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.50 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 55-59 | 3.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.50 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 55-59 | 53.6 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men (45-49 carried) |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 60-64 | 8.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.35 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 60-64 | 88.6 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.35 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 60-64 | 96.8 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.35 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 60-64 | 3.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.35 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 60-64 | 53.6 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men (45-49 carried) |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 65-74 | 4.7 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.20 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 65-74 | 92.1 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.20 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 65-74 | 96.7 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.20 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 65-74 | 3.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.20 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 65-74 | 53.6 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men (45-49 carried) |

### Want kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Yes -> yes | 75-84 | 2.3 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.10 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| No -> no | 75-84 | 94.4 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.10 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Open to either -> yes + no | 75-84 | 96.7 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.10 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |
| Unsure -> not sure | 75-84 | 3.2 | NSFG 2022-23; Pew ATP 2023 | NSFG 2022-23 RWANT (unmarried non-cohabiting men 45-49 carried, n=168), extrapolated x0.10 for age; base = yes / no / not sure (NSFG don't know + Pew not sure), mutually exclusive |

### Have kids (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| No | 75-84 | 53.6 | NSFG 2022-23 EVBIOKID | no biological child, unmarried non-cohabiting men (45-49 carried) |

### Height (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| 5'11"-7'0" | 20-24 | 30.8 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 20-29 |
| 5'11"-7'0" | 25-29 | 30.8 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 20-29 |
| 5'11"-7'0" | 30-34 | 36.1 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 30-39 |
| 5'11"-7'0" | 35-39 | 36.1 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 30-39 |
| 5'11"-7'0" | 40-44 | 36.0 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 40-49 |
| 5'11"-7'0" | 45-49 | 36.0 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 40-49 |
| 5'11"-7'0" | 50-54 | 26.7 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 50-59 |
| 5'11"-7'0" | 55-59 | 26.7 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 50-59 |
| 5'11"-7'0" | 60-64 | 26.3 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 60-69 |
| 5'11"-7'0" | 65-74 | 21.0 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 60-69/70-80 |
| 5'11"-7'0" | 75-84 | 15.6 | CDC NHANES Aug 2021-Aug 2023 + 2017-Mar 2020, measured | 100% NHANES (direct); groups 70-80 |

### Religion (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Buddhist | 21-29 | 0.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Catholic | 21-29 | 18.0 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Christian | 21-29 | 27.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Hindu | 21-29 | 1.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Jewish | 21-29 | 1.8 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Muslim | 21-29 | 1.7 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Other | 21-29 | 18.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Atheist | 21-29 | 7.5 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Agnostic | 21-29 | 8.9 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Spiritual | 21-29 | 14.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Sikh | 21-29 | 0.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |

### Politics (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Left | 21-29 | 17.9 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=580) |
| Left-leaning | 21-29 | 15.9 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=580) |
| Moderate | 21-29 | 38.8 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=580) |
| Right-leaning | 21-29 | 13.3 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=580) |
| Right | 21-29 | 12.0 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=580) |
| Apolitical | 21-29 | 2.1 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=580) |

### Religion (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Buddhist | 30-44 | 1.1 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Catholic | 30-44 | 18.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Christian | 30-44 | 29.0 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Hindu | 30-44 | 0.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Jewish | 30-44 | 1.1 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Muslim | 30-44 | 1.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Other | 30-44 | 16.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Atheist | 30-44 | 7.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Agnostic | 30-44 | 9.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Spiritual | 30-44 | 14.5 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Sikh | 30-44 | 0.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |

### Politics (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Left | 30-44 | 17.1 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=753) |
| Left-leaning | 30-44 | 13.2 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=753) |
| Moderate | 30-44 | 39.5 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=753) |
| Right-leaning | 30-44 | 14.2 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=753) |
| Right | 30-44 | 13.7 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=753) |
| Apolitical | 30-44 | 2.2 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=753) |

### Religion (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Buddhist | 45-54 | 0.8 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Catholic | 45-54 | 24.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Christian | 45-54 | 41.1 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Jewish | 45-54 | 1.1 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Muslim | 45-54 | 0.9 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Other | 45-54 | 10.8 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Hindu | 45-54 | 0.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Atheist | 45-54 | 5.0 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Agnostic | 45-54 | 6.0 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Spiritual | 45-54 | 9.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Sikh | 45-54 | 0.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |

### Politics (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Left | 45-54 | 15.1 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=382) |
| Left-leaning | 45-54 | 8.7 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=382) |
| Moderate | 45-54 | 40.6 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=382) |
| Right-leaning | 45-54 | 12.4 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=382) |
| Right | 45-54 | 20.5 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=382) |
| Apolitical | 45-54 | 2.6 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=382) |

### Religion (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Buddhist | 55-64 | 1.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Catholic | 55-64 | 24.5 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Christian | 55-64 | 44.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Jewish | 55-64 | 1.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Muslim | 55-64 | 0.8 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Other | 55-64 | 9.8 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Hindu | 55-64 | 0.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Atheist | 55-64 | 4.1 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Agnostic | 55-64 | 5.0 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Spiritual | 55-64 | 7.8 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Sikh | 55-64 | 0.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |

### Politics (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Left | 55-64 | 15.8 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=460) |
| Left-leaning | 55-64 | 11.3 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=460) |
| Moderate | 55-64 | 34.4 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=460) |
| Right-leaning | 55-64 | 14.8 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=460) |
| Right | 55-64 | 19.8 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=460) |
| Apolitical | 55-64 | 4.0 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=460) |

### Religion (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Buddhist | 65+ | 1.3 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Catholic | 65+ | 29.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Christian | 65+ | 44.6 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Hindu | 65+ | 0.5 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Jewish | 65+ | 2.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Muslim | 65+ | 0.8 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Other | 65+ | 7.1 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Atheist | 65+ | 3.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Agnostic | 65+ | 4.0 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Spiritual | 65+ | 6.4 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |
| Sikh | 65+ | 0.2 | GSS 2018-2024 (unmarried men, weighted); Pew RLS 2023-24 | GSS share; Jewish/Muslim/Buddhist/Hindu = 50% GSS + 50% Pew RLS adult share (small GSS n); nones split atheist 5 : agnostic 6 : nothing-in-particular 19 (Pew RLS), nothing-in-particular half Spiritual, half Other (assumption); Sikh 0.2% (Pew RLS <0.3% other world religions) |

### Politics (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Left | 65+ | 16.7 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=612) |
| Left-leaning | 65+ | 10.6 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=612) |
| Moderate | 65+ | 31.5 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=612) |
| Right-leaning | 65+ | 12.0 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=612) |
| Right | 65+ | 27.7 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=612) |
| Apolitical | 65+ | 1.6 | GSS 2018-2024 polviews (7-point) | 100% GSS: 1-2 (extremely) liberal = Left, 3 slightly liberal = Left-leaning, 4 = Moderate, 5 slightly conservative = Right-leaning, 6-7 = Right, no answer / don't know = Apolitical (stand-in); unmarried men, weighted (n=612) |

### Education tier (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Top 100 | all ages | 10.6 | NCES IPEDS completions 2008-09, 2015-16 x admissions | share of men's bachelor's degrees; Ivy+ = 8 Ivies + Stanford, MIT, Chicago, Duke; Top 50/100 = most selective by admit rate (>=5,000 applicants) as a stand-in for a published ranking; applied to men who pass Degree |
| Top 50 | all ages | 4.9 | NCES IPEDS completions 2008-09, 2015-16 x admissions | share of men's bachelor's degrees; Ivy+ = 8 Ivies + Stanford, MIT, Chicago, Duke; Top 50/100 = most selective by admit rate (>=5,000 applicants) as a stand-in for a published ranking; applied to men who pass Degree |
| Ivy+ | all ages | 1.4 | NCES IPEDS completions 2008-09, 2015-16 x admissions | share of men's bachelor's degrees; Ivy+ = 8 Ivies + Stanford, MIT, Chicago, Duke; Top 50/100 = most selective by admit rate (>=5,000 applicants) as a stand-in for a published ranking; applied to men who pass Degree |

### Education degree (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Bachelor's+ | 30-34 (Austin) | 50.1 | Census ACS 2020-24 PUMS | 100% ACS (direct), single men in PUMAs within 30 mi |

### Income (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| $100k+ (among Bachelor's+) | 30-34 (Austin) | 38.1 | Census ACS 2020-24 PUMS | 100% ACS (direct) |

### Education degree (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| Bachelor's+ | 45-49 (Austin) | 41.9 | Census ACS 2020-24 PUMS | 100% ACS (direct), single men in PUMAs within 30 mi |

### Income (partner)

| Option | Age band | % | Sources | Blend / note |
|---|---|---|---|---|
| $100k+ (among Bachelor's+) | 45-49 (Austin) | 43.5 | Census ACS 2020-24 PUMS | 100% ACS (direct) |
