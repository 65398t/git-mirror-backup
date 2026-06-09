# Release Notes - Git Mirror Backup Admin

## Version 0.3.0 (31.05.2026)

### Highlights

- **Login mit Demo-Zugangsdaten**: Die Login-Seite erfordert nun die Eingabe von Benutzername und Passwort. Demo-Zugangsdaten werden auf der Login-Seite angezeigt, solange Entra ID noch nicht aktiv ist.
- **Kein Auto-Login mehr**: Benutzer muessen sich nun mit Zugangsdaten anmelden, um auf die Anwendung zuzugreifen.

### Aenderungen

- Auto-Login entfernt; Benutzer sehen bei jedem Besuch die Login-Seite
- Demo-Zugangsdaten-Anzeige (Info-Box) auf der Login-Seite hinzugefuegt
- Validierung der Zugangsdaten gegen Demo-Benutzername/Passwort
- Deutsche Fehlermeldung bei ungueltigen Anmeldedaten

---

## Version 0.2.0 (31.05.2026)

### Highlights

- **Mock REST API Schicht**: Alle Seiten nutzen nun einen zentralen API-Service (`api.ts`) anstelle direkter Supabase-Aufrufe. Diese Schicht wird spaeter durch echte REST API Endpunkte ersetzt.
- **Vollstaendige Admin-Oberflaeche**: Dashboard, Repositories, Mirror Runs, Ignore-Liste und Konfiguration sind voll funktionsfaehig mit realistischen Demodaten.
- **Responsive Layout**: Permanente Seitenleiste auf Desktop (260px), ausklappbare Seitenleiste auf Mobilgeraeten.
- **Deutsche Oberflaeche**: Alle benutzersichtbaren Texte sind auf Deutsch.

### Neue Funktionen

- Mock API Service mit simulierten Verzoegerungen fuer realistische Benutzererfahrung
- Dashboard mit Repository-Statistiken und Uebersicht des letzten Mirror-Laufs
- Repository-Inventar mit Suche, Status- und Projektfilter
- Mirror Runs Seite mit aufklappbaren Log-Eintraegen und manueller Ausloesung
- Ignore-Listen-Verwaltung mit Erstellen, Aktivieren/Deaktivieren und Loeschen
- Konfigurationsseite fuer Azure DevOps Einstellungen, Zeitplan und Leistung
- Login-Seite mit Entra ID Platzhalter (derzeit deaktiviert)

### Technische Details

- Erstellt mit React 19, TypeScript, Vite und Material UI v7
- Demodaten enthalten 18 Repositories in 4 Projekten, 4 Ignore-Regeln und 7 Mirror-Laeufe
- Veraenderlicher In-Memory-Zustand ermoeglicht CRUD-Operationen zur Laufzeit
- Alle API-Methoden geben Kopien zurueck, um unbeabsichtigte Zustandsaenderungen zu vermeiden

---

## Version 0.1.0 (31.05.2026)

### Erstveroeffentlichung

- Projektgeruest mit Vite, React, TypeScript
- Supabase Datenbank-Migration mit 5 Tabellen und RLS-Richtlinien
- TypeScript Typdefinitionen fuer alle Entitaeten