# Release Notes - Git Mirror Backup Admin

## Version 0.3.0 (2026-05-31)

### Highlights

- **Login with demo credentials**: The login page now requires username and password entry. Demo credentials are displayed on the login page for convenience while Entra ID is not yet active.
- **No more auto-login**: Users must now enter credentials to access the application, providing a more realistic authentication flow.

### Changes

- Removed auto-login behavior; users see the login page on every visit
- Added demo credentials display (info box) on the login page
- Added credential validation against demo username/password
- German error messages for invalid credentials

---

## Version 0.2.0 (2026-05-31)

### Highlights

- **Mock REST API layer**: All pages now consume data through a centralized API service (`api.ts`) instead of direct Supabase calls. This layer will later be replaced by real REST API endpoints.
- **Complete admin UI**: Dashboard, Repositories, Mirror Runs, Ignore List, and Settings pages are fully functional with realistic demo data.
- **Responsive layout**: Permanent sidebar on desktop (260px), temporary drawer on mobile.
- **German UI labels**: All user-facing text is in German.

### New Features

- Mock API service with simulated async delays for realistic UX
- Dashboard with repository statistics and latest mirror run overview
- Repository inventory with search, status filter, and project filter
- Mirror Runs page with expandable log entries and manual trigger
- Ignore List management with create, toggle, and delete operations
- Settings page for Azure DevOps configuration, schedule, and performance tuning
- Login page with Entra ID placeholder (currently deactivated)

### Technical Details

- Built with React 19, TypeScript, Vite, and Material UI v7
- Mock data includes 18 repositories across 4 projects, 4 ignore rules, and 7 mirror runs
- Mutable in-memory state allows runtime CRUD operations
- All API methods return copies to prevent unintended state mutations

---

## Version 0.1.0 (2026-05-31)

### Initial Release

- Project scaffolding with Vite, React, TypeScript
- Supabase database migration with 5 tables and RLS policies
- TypeScript type definitions for all entities