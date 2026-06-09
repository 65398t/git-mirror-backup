# Aenderungsprotokoll

Alle wichtigen Aenderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.3.0] - 31.05.2026

### Hinzugefuegt
- Demo-Zugangsdaten-Anzeige auf der Login-Seite (Info-Box mit Benutzername und Passwort)
- Validierung der Zugangsdaten gegen Demo-Benutzername/Passwort beim Absenden
- Deutsche Fehlermeldung bei ungueltigen Anmeldeversuchen

### Geaendert
- Auto-Login entfernt; Benutzer muessen nun Zugangsdaten auf der Login-Seite eingeben
- Login-Seite zeigt Demo-Zugangsdaten fuer Entwicklungskomfort an

### Entfernt
- Auto-Login-Verhalten im AuthContext

## [0.2.0] - 31.05.2026

### Hinzugefuegt
- Mock REST API Service-Schicht (`src/lib/api.ts`) mit Methoden fuer Auth, Einstellungen, Repositories, Ignore-Regeln und Mirror-Laeufe
- Mock-Datenmodul (`src/lib/mockData.ts`) mit 18 Repositories, 4 Ignore-Regeln, 7 Mirror-Laeufen und veraenderlicher Zustandsverwaltung
- Dashboard-Seite mit Repository-Statistiken und letztem Lauf-Ueberblick
- Repositories-Seite mit Suche, Status- und Projektfiltern
- Mirror Runs Seite mit aufklappbaren Log-Details und manuellem Ausloeser
- Ignore-Listen-Seite mit CRUD-Operationen fuer Ignore-Regeln
- Konfigurationsseite fuer Organisation, Speicher, Zeitplan und Leistungseinstellungen
- Login-Seite mit E-Mail/Passwort-Formular und Entra ID Platzhalter
- Auth-Context mit Mock-Auto-Login fuer Entwicklung
- Responsive Layout mit permanenter/temporaerer Drawer-Navigation
- MUI-Theme mit blue[800] Primaer, teal[600] Sekundaer, grey[50] Hintergrund

### Geaendert
- Alle Seiten nutzen `api.*` Methoden statt direkter Supabase-Aufrufe

## [0.1.0] - 31.05.2026

### Hinzugefuegt
- Projektgeruest (Vite, React 19, TypeScript, MUI v7)
- Supabase Datenbank-Migration mit `mirror_settings`, `mirror_repositories`, `ignore_rules`, `mirror_runs`, `restore_tests` Tabellen
- Row Level Security Richtlinien fuer alle Tabellen
- TypeScript Typdefinitionen (`src/types/database.ts`)