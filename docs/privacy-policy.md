# Privacy policy versioning

The policy text and styles live in `src/pages/politica-de-privacidad/index.astro`.
Its specific data, version and update date live in `src/privacy-policy.json`,
re-exported as `PRIVACY_POLICY` from `src/consts.ts`.

When changing either policy file:

1. Increase `version` to a higher positive integer.
2. Review `updatedAt` and set the actual update date in `YYYY-MM-DD` format.

## GitHub Actions

The workflow is defined in `.github/workflows/privacy-policy.yml` and calls
`scripts/check-privacy-policy-version.mjs`.

The `Privacy policy` workflow checks pull requests targeting `main`. It detects
changes in both `index.astro` and `privacy-policy.json` files, and will fail if something has changed without increasing the policy version.

## Manual exception for false positives

Some changes like styling and formatting can be skipped without increasing the policy version. For a reviewed change that does not alter the policy, such as a CSS adjustment, follow these steps:

1. Create the configured repository skip label in GitHub, once.
2. Explain the false positive in a PR comment.
3. Apply the label to the PR using the **Labels** sidebar.

The default skip label is `privacy-policy-version-skip`. To change it, set the repository Actions variable `PRIVACY_POLICY_SKIP_LABEL` in
**Settings → Secrets and variables → Actions → Variables**. The workflow passes
the configured name to the script through the `--skip-label` argument.

## Running the script locally

The check can also run locally executing the following command:

```sh
node scripts/check-privacy-policy-version.mjs \
  --base origin/main \
  --head HEAD \
  --config src/privacy-policy.json \
  --page src/pages/politica-de-privacidad/index.astro \
  --skip-label privacy-policy-version-skip \
  --labels '[]'
```
