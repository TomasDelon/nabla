# Audit Bundle

Reviewed range: `db7a771d8428f4fa7edcd10176d1dfac6b9206d9..a90733a`
Current branch: `phase-3-editor-core`
Current HEAD at generation time: `a90733a9349395c13ddcee10c293329b652ed59d`

Review source of truth: use the audit bundle commit hash to read `reports/audit/latest/*`.

Start with this order:
1. `audit.json` for task, branch, reviewed range, current HEAD, working tree status, review instructions, and reviewed-head reference URLs.
2. `git-status.txt` for current working tree state at generation time.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual reviewed diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
