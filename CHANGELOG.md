# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.3.0] - 2026-05-31

### Added
- Demo credentials display on login page (info box with username and password)
- Credential validation against demo username/password on form submit
- German error message for invalid login attempts

### Changed
- Removed auto-login; users must now enter credentials on the login page
- Login page shows demo credentials for development convenience

### Removed
- Auto-login behavior in AuthContext

## [0.2.0] - 2026-05-31

### Added
- Mock REST API service layer (`src/lib/api.ts`) with namespaced methods for auth, settings, repositories, ignore rules, and mirror runs
- Mock data module (`src/lib/mockData.ts`) with 18 repositories, 4 ignore rules, 7 mirror runs, and mutable state management
- Dashboard page with repository statistics and latest run overview
- Repositories page with search, status and project filters
- Mirror Runs page with expandable log details and manual trigger button
- Ignore List page with CRUD operations for ignore rules
- Settings page for organization, storage, schedule, and performance configuration
- Login page with email/password form and Entra ID placeholder
- Auth context with mock auto-login for development
- Responsive layout with permanent/temporary drawer navigation
- MUI theme with blue[800] primary, teal[600] secondary, grey[50] background

### Changed
- All pages consume data through `api.*` methods instead of direct Supabase calls

## [0.1.0] - 2026-05-31

### Added
- Project scaffolding (Vite, React 19, TypeScript, MUI v7)
- Supabase database migration with `mirror_settings`, `mirror_repositories`, `ignore_rules`, `mirror_runs`, `restore_tests` tables
- Row Level Security policies for all tables
- TypeScript type definitions (`src/types/database.ts`)