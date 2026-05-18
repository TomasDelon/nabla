# Audit Bundle

Start with this order:
1. `audit.json` for task, branch, base, HEAD, and raw URLs.
2. `git-status.txt` for working tree state.
3. `git-log.txt` for the commit slice under review.
4. `git-show-name-only.txt` and `git-show.patch` for the actual diff.
5. `repo-tree.txt` and `package-json.txt` for repository context.

This bundle is text-only and is intended for review from GitHub without manual uploads.
