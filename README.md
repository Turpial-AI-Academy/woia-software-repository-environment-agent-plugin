# woia-software-repository-environment

WOIA Software provider for the `repository-environment` capability. Portable capability content is migrated preserve-first from `Turpial-AI-Academy/repository-environment-agent-plugin@1.0.1` and remains independently usable.

- Plugin version: `0.5.7`
- Primary skill: `$repository-environment`
- Authoring profile: thin

Generic certification/release tooling is centralized in `woia-ecosystem`.

## Maintenance

Edit only this canonical repository. Keep `plugin.json`, `package.json` and `dev.woia/manifest.json` versions aligned. From the canonical WOIA Ecosystem repository, run `mise run plugin:certify-thin --repo <absolute-plugin-repository>`, then use its release preparation/publication tasks. Install and update consumers from immutable published artifacts; keep Project personalization in overlays.
