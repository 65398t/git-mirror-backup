# Prompt Tracking - Git Mirror Backup Admin

## Prompt 1 - Initiale Erstellung
**Datum:** 31.05.2026
**Beschreibung:** React Admin UI fuer Azure DevOps Git Mirror Backup erstellen. Material UI mit Login via Entra ID (deaktiviert), vollstaendige Verwaltungsfunktionen: Konfiguration, Monitoring, Ignore-Listen, manuelle Mirror-Ausloesung, Status/Logs, Repository-Inventar.
**Ergebnis:** Projektgeruest, Datenbankschema, TypeScript-Typen erstellt.

## Prompt 2 - Release Notes und Changelogs
**Datum:** 31.05.2026
**Beschreibung:** RELEASE_NOTES.md und CHANGELOG.md (Englisch) sowie RELEASE_NOTES_de.md und CHANGELOG_de.md (Deutsch) erstellen und aktuell halten.
**Ergebnis:** Vier Dokumentationsdateien erstellt und auf Version 0.2.0 aktualisiert.

## Prompt 3 - Mock REST API
**Datum:** 31.05.2026
**Beschreibung:** Mock REST API erstellen, die spaeter Supabase ersetzen wird. Alle Seiten sollen diese API-Schicht nutzen statt direkter Supabase-Aufrufe.
**Ergebnis:**
- `src/lib/api.ts` - Mock API Service mit Methoden fuer Auth, Settings, Repositories, Ignore-Regeln, Mirror Runs
- `src/lib/mockData.ts` - Realistische Demodaten (18 Repos, 4 Regeln, 7 Laeufe)
- Alle 6 Seiten nutzen `api.*` Methoden
- Dashboard, Repositories, Mirror Runs, Ignore-Liste, Konfiguration, Login vollstaendig implementiert
- Responsive Layout mit Drawer-Navigation
- MUI Theme mit blue[800]/teal[600] Farbpalette

## Prompt 4 - Login mit Zugangsdaten
**Datum:** 31.05.2026
**Beschreibung:** Username und Passwort in das Login einfuegen, solange es noch nicht ueber Entra ID funktioniert.
**Ergebnis:**
- Auto-Login entfernt, Benutzer sehen die Login-Seite bei jedem Besuch
- Demo-Zugangsdaten auf der Login-Seite angezeigt (git-mirror@m-s.ch / Mirror2026!)
- Validierung der eingegebenen Zugangsdaten gegen Demo-Daten
- Deutsche Fehlermeldung bei falschen Anmeldedaten
- Entra ID Button bleibt deaktiviert mit Hinweistext
- Version auf 0.3.0 aktualisiert

## Prompt 6 - Dockerfile fuer Container-Hosting
**Datum:** 31.05.2026
**Beschreibung:** Dockerfile erstellen, damit die App als Docker-Container betrieben werden kann.
**Ergebnis:**
- `Dockerfile` - Multi-Stage Build (Node 22 Alpine fuer Build, nginx stable-alpine fuer Serving)
- `nginx.conf` - SPA-Fallback-Konfiguration, Asset-Caching, Sicherheitsheader, gzip
- VITE-Umgebungsvariablen werden als Docker Build-Args uebergeben

## Prompt 5 - M&S Corporate Design (rueckgaengig gemacht)
**Datum:** 31.05.2026
**Beschreibung:** Design an der Website m-s.ch orientieren. Wurde anschliessend wieder rueckgaengig gemacht.
**Ergebnis:** Alle Aenderungen rueckgaengig gemacht, urspruengliches blue[800]/teal[600] Design wiederhergestellt.

## Prompt 7 - Internationalisierung (i18n)
**Datum:** 31.05.2026
**Beschreibung:** i18n-Unterstuetzung mit Deutsch (DE), Franzoesisch (FR) und Englisch (EN) fuer alle Seiten einrichten.
**Ergebnis:**
- i18next, react-i18next und i18next-browser-languagedetector installiert
- Uebersetzungsdateien fuer DE, EN, FR erstellt (src/i18n/locales/)
- i18n-Konfiguration mit Browser-Spracherkennung und localStorage-Persistenz
- Sprachwechsler im Header (Globe-Icon) und auf der Login-Seite
- Alle Seiten vollstaendig uebersetzt: Login, Dashboard, Repositories, Mirror Runs, Ignore-Liste, Konfiguration
- Navigation und Layout-Elemente uebersetzt
- Datums-/Zeitformatierung passt sich an die gewaehlte Sprache an
- Fallback-Sprache: Deutsch

## Prompt 8 - Mock-Daten i18n
**Datum:** 31.05.2026
**Beschreibung:** Die gemockten Daten (Beschreibungen, Log-Meldungen, Fehlermeldungen) ebenfalls uebersetzen.
**Ergebnis:**
- Uebersetzungsschluessel fuer alle Mock-Daten-Texte in DE, EN, FR hinzugefuegt
- Ignore-Regel-Beschreibungen werden uebersetzt
- Log-Eintraege (Mirror-Lauf gestartet, Synchronisierung, Fehler) werden uebersetzt
- Fehlermeldungen (PAT abgelaufen, HTTP 403, Repository nicht gefunden) werden uebersetzt
- Mock-Daten werden bei Sprachwechsel automatisch neu generiert

## Prompt 9 - Sprachwechsel aktualisiert Mock-Daten nicht
**Datum:** 31.05.2026
**Beschreibung:** Beim Sprachwechsel wurden die gemockten Inhalte (Log-Eintraege, Fehlermeldungen, Ignore-Regel-Beschreibungen) nicht in der neuen Sprache angezeigt.
**Ergebnis:**
- Alle Seiten (Dashboard, Repositories, Mirror Runs, Ignore-Liste) laden Daten neu bei Sprachwechsel
- i18n.language als Dependency in useEffect-Hooks hinzugefuegt
- Hardcodierte deutsche Strings in api.ts trigger() durch i18n.t()-Aufrufe ersetzt

## Prompt 10 - Azure DevOps Multi-Org Settings
**Datum:** 09.06.2026
**Beschreibung:** Die Azure DevOps Organisations-Konfiguration von einer einzelnen auf eine Liste umgestellt, damit mehrere Azure DevOps Organisationen verwaltet werden koennen.
**Ergebnis:**
- AzureDevOpsOrganization-Typ: Liste statt Einzelwert
- Settings-Seite: Mehrere Org-Karten mit Hinzufuegen/Entfernen
- Mock-Daten mit zwei Beispiel-Organisationen

## Prompt 11 - GitHub Workflows und Multi-Provider
**Datum:** 09.06.2026
**Beschreibung:** .github/workflows Ordner erstellen. mirror-to-azure-devops.yml Workflow anlegen. System erweitern, damit neben Azure DevOps auch GitHub-Organisationen als Quell-Provider unterstuetzt werden.
**Ergebnis:**
- `.github/workflows/mirror-to-azure-devops.yml` - GitHub Actions Workflow mit Basic-Auth, PAT-Validierung, Force-Push auf main und Tags
- `SourceProviderType` Union-Typ ('azure_devops' | 'github') eingefuehrt
- `GitHubOrganization` Interface erstellt (ohne Projects, da GitHub keine Projekt-Ebene hat)
- `SourceOrganization` Discriminated Union (AzureDevOps | GitHub)
- Settings-Seite: Getrennte Karten fuer Azure DevOps und GitHub Organisationen
- Mock-Daten: Dritte Organisation (GitHub: ms-software-engineering) hinzugefuegt
- i18n-Uebersetzungen (DE, EN, FR) fuer GitHub-Organisationen ergaenzt
- Vite auf v7 zurueckgestuft wegen Rolldown/WASI-Fehler in der Deployment-Umgebung

## Prompt 12 - Organisations-URL-Feld
**Datum:** 09.06.2026
**Beschreibung:** URL-Feld fuer Azure DevOps und GitHub Organisationen hinzufuegen, damit die Basis-URL (z.B. https://dev.azure.com/M-S) direkt in der Konfiguration hinterlegt werden kann.
**Ergebnis:**
- `url` Eigenschaft zu `AzureDevOpsOrganization` und `GitHubOrganization` Interfaces hinzugefuegt
- URL-Eingabefeld in der Settings-Seite mit provider-spezifischem Placeholder
- Mock-Daten mit realistischen URLs aktualisiert (https://dev.azure.com/M-S, https://github.com/ms-software-engineering)
- i18n-Uebersetzungen (DE, EN, FR) fuer URL-Feld ergaenzt

## Prompt 13 - Organisationen in Supabase-Datenbank
**Datum:** 09.06.2026
**Beschreibung:** Die Liste der Azure DevOps und GitHub Organisationen nicht mehr mocken, sondern in der Supabase-Datenbank speichern. Tabelle `source_organizations` anlegen und die API-Schicht auf echte Supabase-Aufrufe umstellen.
**Ergebnis:**
- Supabase-Migration `create_source_organizations`: Tabelle mit id, name, url, provider, projects, pat, pat_expiry, created_at, updated_at
- RLS aktiviert mit anon+authenticated CRUD-Policies (Daten sind absichtlich oeffentlich/geteilt)
- `api.organizations.list()` liest per Supabase-Client aus der Datenbank
- `api.organizations.save()` implementiert Smart-Sync: bestehende IDs laden, entfernte loeschen, aktuelle upserten
- `rowToOrganization()` Konvertierungsfunktion fuer DB-Rows zu Frontend-Typen (Discriminated Union)
- `SourceOrganizationRow` Typ fuer Datenbank-Zeilen in `database.ts` hinzugefuegt
- `organizations` Feld aus `MirrorSettings` entfernt (nicht mehr dort gespeichert)
- Mock-Organisationen aus `mockData.ts` entfernt
- SettingsPage und RepositoriesPage laden Organisationen separat ueber `api.organizations.list()`
- Alle anderen Entitaeten (Repositories, Ignore-Regeln, Mirror Runs, Settings) bleiben weiterhin gemockt

## Prompt 14 - Fix: Organisationen wurden nicht in DB gespeichert
**Datum:** 09.06.2026
**Beschreibung:** Beim Hinzufuegen und Speichern von Organisationen auf der Settings-Seite wurden die Daten nicht in der Supabase-Datenbank gespeichert. Ursache: Die ID-Spalte ist `uuid`, aber das Frontend generierte String-IDs (`org-{timestamp}`), die kein gueltiges UUID-Format waren. Der Fehler wurde nicht angezeigt, da die Fehlerbehandlung beim Speichern fehlte.
**Ergebnis:**
- ID-Generierung in `addOrg()` auf `crypto.randomUUID()` umgestellt (SettingsPage.tsx)
- Fehlerbehandlung beim Speichern hinzugefuegt: Fehler werden als roter Alert angezeigt
- `saveError` State und Fehler-Alert in die Settings-Seite integriert
- i18n-Uebersetzungen (DE, EN, FR) fuer `saveError` Key ergaenzt

## Prompt 15 - Fix: Konfigurationsseite bleibt weiss
**Datum:** 09.06.2026
**Beschreibung:** Die Settings-Seite wurde komplett weiss angezeigt, weil die Datenbank-Spalte von `projects` zu `tags` umbenannt wurde, aber der Frontend-Code noch `projects` referenzierte. Das verursachte Runtime-Crashes, da `row.projects` undefined war.
**Ergebnis:**
- Alle TypeScript-Interfaces (`AzureDevOpsOrganization`, `GitHubOrganization`, `SourceOrganizationRow`) von `projects` auf `tags` umgestellt
- `api.ts`: `rowToOrganization()` und `save()` nutzen `tags` statt `projects`
- `RepositoriesPage.tsx`: Projekt-Filter nutzt `o.tags` statt `o.projects`
- `SettingsPage.tsx`: Komplett ueberarbeitet mit Tags-Chips und Fetch-Button
- `ProjectSelectionModal.tsx`: Neue Komponente fuer Projekt-/Repo-Auswahl mit Suche, Select-All und Checkboxen
- `supabase/functions/fetch-projects/index.ts`: Edge Function deployed fuer Azure DevOps und GitHub API-Abfragen
- i18n-Uebersetzungen (DE, EN, FR) fuer alle neuen Keys ergaenzt (fetchProjects, selectAll, confirmSelection, etc.)

## Prompt 16 - Bestaetigung speichert Tags in DB
**Datum:** 09.06.2026
**Beschreibung:** Wenn im ProjectSelectionModal der Bestaetigungsbutton gedrueckt wird, sollen die ausgewaehlten Tags sofort in der Supabase-Datenbank gespeichert werden, nicht nur im lokalen React-State.
**Ergebnis:**
- `onConfirm` Handler in SettingsPage.tsx erweitert: nach State-Update wird `api.organizations.save()` aufgerufen
- Erfolgs-Snackbar wird nach erfolgreichem Speichern angezeigt
- Fehler werden als Alert angezeigt falls das Speichern fehlschlaegt

## Prompt 17 - Scrollbars durch transparente Dreiecke ersetzen
**Datum:** 09.06.2026
**Beschreibung:** Keine vertikalen Scrollbars mehr anzeigen. Stattdessen transparente Dreiecke oben bzw. unten einblenden, wenn Inhalt scrollbar ist.
**Ergebnis:**
- Globale CSS-Regel in `theme.ts` via `MuiCssBaseline` styleOverrides: `scrollbarWidth: 'none'` und `::-webkit-scrollbar { display: none }` auf alle Elemente
- Neue Komponente `ScrollContainer.tsx`: Wrapper mit `position: relative`, verstecktem Scroll-Bereich und transparenten Dreieck-Indikatoren (oben/unten) die per Scroll-Position ein-/ausgeblendet werden
- Dreiecke nutzen Theme-Tokens (`palette.text.secondary`, `palette.background.paper`, `transitions`)
- `ScrollContainer` angewendet in: Sidebar-Navigation (Layout.tsx), Projekt-Auswahl-Modal (ProjectSelectionModal.tsx), Log-Eintraege (MirrorRunsPage.tsx), Main-Content-Bereich (Layout.tsx)

## Prompt 18 - Nicht-ausgewaehlte Projekte auf Ignore-Liste
**Datum:** 09.06.2026
**Beschreibung:** Logik umgestellt: Alle Projekte werden immer gescannt. Nicht ausgewaehlte Projekte im Projekt-Auswahl-Dialog kommen auf die Ignore-Liste (als `project_repository` Regeln), statt ausgewaehlte als Tags zu speichern.
**Ergebnis:**
- `ProjectSelectionModal.tsx`: `onConfirm` gibt jetzt die ignorierten (nicht ausgewaehlten) Projekte zurueck statt der ausgewaehlten Tags. Neue `existingIgnored` Prop zum Pre-Select basierend auf bestehenden Ignore-Rules. Button zeigt Anzahl der ignorierten Projekte.
- `SettingsPage.tsx`: Laedt Ignore-Rules beim Start, zeigt ignorierte Projekte als Chips mit Loeschbutton an, erstellt beim Bestaetigen neue `project_repository` Ignore-Rules fuer die Organisation (mit `org:{id}` als Beschreibung).
- Tags-Anzeige durch Ignore-Anzeige ersetzt: "Alle Projekte werden gespiegelt" wenn nichts ignoriert, sonst Chips mit den ignorierten Projektnamen.
- i18n-Uebersetzungen (DE, EN, FR) fuer neue Keys: `ignored`, `ignoredProjects`, `allProjectsMirrored`

## Prompt 19 - RLS Security Fix: source_organizations
**Datum:** 09.06.2026
**Beschreibung:** Sicherheitsluecke in RLS-Policies der Tabelle `source_organizations` behoben. Die alten Policies (`anon_delete_source_organizations`, `anon_insert_source_organizations`, `anon_update_source_organizations`) hatten `USING (true)` bzw. `WITH CHECK (true)`, was uneingeschraenkten Zugriff fuer alle (inkl. anonyme Benutzer) erlaubte.
**Ergebnis:**
- `user_id` Spalte (uuid, FK auf auth.users, DEFAULT auth.uid()) zur Tabelle hinzugefuegt
- Alle 4 alten `anon_*` Policies entfernt
- 4 neue ownership-basierte Policies erstellt: `select_own_source_organizations`, `insert_own_source_organizations`, `update_own_source_organizations`, `delete_own_source_organizations` -- alle nur fuer `authenticated` mit `auth.uid() = user_id`
- `SourceOrganizationRow` TypeScript-Interface um `user_id` Feld ergaenzt
- Migration `fix_source_organizations_rls` auf Supabase angewendet
- Urspruengliche Migrationsdatei aktualisiert, damit sie die sichere Policy-Variante dokumentiert