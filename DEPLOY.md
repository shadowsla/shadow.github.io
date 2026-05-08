Deploying the web build to GitHub Pages

This repository contains the web version in `RPGGame/web`.

What this workflow does
- The included GitHub Actions workflow (`.github/workflows/deploy-gh-pages.yml`) will publish the contents of `RPGGame/web` to the `gh-pages` branch whenever you push to `main`.
- The Pages site will be available at:

  https://<your-github-username>.github.io/<repo-name>/

  For this repository (`shadow.github.io` owned by `shadowsla`) the project site URL will be:

  https://shadowsla.github.io/shadow.github.io/

How to publish
1. Commit and push the new workflow and any local changes:

```bash
git add .
git commit -m "Add gh-pages deploy workflow and web content"
git push origin main
```

2. GitHub Actions will run and create/update the `gh-pages` branch with the `RPGGame/web` content.
3. After the Action completes (check the Actions tab), open the project URL above.

Notes & alternatives
- If you want a prettier URL (for example `https://shadowsla.github.io/RPGGame/`), rename the repository to `RPGGame` (or similar) and update the workflow; GitHub Pages URL is based on the repo name.
- If you prefer a custom domain (e.g., `shadowstower.example.com`), create a `CNAME` file with the domain and configure DNS accordingly.
- If your user pages (`https://shadowsla.github.io/`) are already used by another repo, this project will be published at the project-site path `/shadow.github.io/` as shown above.

If you want, I can (a) commit & push these changes to your repo for you, or (b) change the workflow to use a different publish path or repo name — tell me which you prefer.