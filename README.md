# iherebycommit.com — pre-merge preview sandbox

This repo is a **preview sandbox** for testing changes to [iherebycommit.com](https://iherebycommit.com)
(source: `pearlouisebot/iherebycommit.com`, branch `master`) *before* they are merged.

**The live site is not affected by anything in this repo.** There is intentionally no `CNAME` file here,
so this sandbox never claims the iherebycommit.com domain. It is served only at
https://mandyeebot.github.io/iherebycommit-sandbox_grokbot/

## Layout
- `/` — a mirror of the current live `master` (re-synced on every publish).
- `/pr-<N>/` — the head of pull request #N, e.g. https://mandyeebot.github.io/iherebycommit-sandbox_grokbot/pr-7/

Published with `publish_pr_to_sandbox.sh <PR_NUMBER>`. `robots.txt` blocks indexing.

## Caveats
- Root-absolute links such as `/privacy` and `/terms` resolve to `mandyeebot.github.io/privacy` (404) under the sandbox subpath.
- Form submissions to the Supabase edge functions are rejected from this origin unless the functions' origin allow-list includes `https://mandyeebot.github.io`.
