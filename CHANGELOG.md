# CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Changelog Categories

- `BREAKING` for breaking changes.
- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

---
## [2.0.1] - 2026-03-15
### Fixed
- CJS `require('optiic')` now works directly without `.default` (via prepare-package footer)

### Changed
- Bump wonderful-fetch to 2.0.4 and prepare-package to 2.0.7

---
## [2.0.0] - 2026-03-15
### Changed
- Migrate build system to prepare-package (ESM, CJS, IIFE outputs)
- Upgrade to wonderful-fetch v2 (unified Node + browser fetch)
- Use wonderful-fetch's built-in authorization, JSON response parsing, and logging
- Replace package.json version import with `{version}` token (replaced at build time)
- Add `url` and `debug` constructor options
- Modernize README with updated API docs, usage examples, and curl snippets
- Upgrade all dependencies to latest

### Removed
- `.npmignore` (replaced by `files` field in package.json)

### Added
- Comprehensive live tests (validation, remote URL, local file, FormData)
- IIFE build for `<script>` tag usage via CDN

---
## [1.0.0] - 2024-06-19
### Added
- Initial release of the project 🚀
