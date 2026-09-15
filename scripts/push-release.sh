#!/usr/bin/env bash
set -euo pipefail

: "${GITHUB_REF_NAME:?Missing release branch}"
: "${VERSION:?Missing release version}"

# Retry the same commit and tag; never rerun version generation or force-push.
for attempt in 1 2 3 4; do
  if git push --atomic origin "HEAD:refs/heads/${GITHUB_REF_NAME}" "refs/tags/v${VERSION}:refs/tags/v${VERSION}"; then
    exit 0
  fi
  if [ "$attempt" -lt 4 ]; then
    echo "Release push failed (attempt ${attempt}/4); retrying in $((attempt * 5)) seconds..."
    sleep "$((attempt * 5))"
  fi
done

echo 'Release push failed after 4 attempts. Check GitHub availability, branch protection, and write permissions.' >&2
exit 1
