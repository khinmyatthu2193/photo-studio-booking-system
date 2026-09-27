---
name: project-setup
description: Initialize or adjust Snapora's Next.js, TypeScript, Tailwind, environment, quality-tooling, and deployment foundation. Use for project scaffolding and configuration, not feature implementation.
---

# Project setup

- Read `prd.md` and `AGENTS.md`, then inspect the repository, package scripts, lockfile, framework versions, configuration, and Git status before changing setup.
- If a compatible Next.js App Router project exists, modify it in place; never create a second app or replace working configuration wholesale.
- For a greenfield setup, use `src/app`, strict TypeScript, Tailwind CSS, ESLint, and the repository's chosen package manager. Keep defaults unless an MVP requirement needs a change.
- Establish import aliases and the folder boundaries defined in `AGENTS.md`; do not pre-create unused feature files or abstraction layers.
- Install only dependencies required by the current phase. Explain each non-core dependency and prefer platform capabilities for simple needs.
- Create an ignored local environment file only when values are available locally. Keep an example file to variable names and safe placeholders; never read secrets into output or commit them.
- Provide scripts for development, build, lint, typecheck, and tests as those tools are introduced.
- Preserve user changes and existing style. Run relevant configuration checks and a production build before declaring setup complete.
- Stop if the package manager/framework baseline is ambiguous, a requested change would overwrite an implementation, or external credentials are required.
