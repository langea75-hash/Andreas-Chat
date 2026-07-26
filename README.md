# Psss🤫 Version 0.1

Enthalten:
- Anmeldung ohne E-Mail
- Benutzername und PIN
- Registrierung nur mit Einladungscode
- Firebase Authentication
- Firestore
- Startseite nach Anmeldung

Noch nicht enthalten:
- Freunde
- echte Chats
- Bilder
- Push-Nachrichten

## Firebase einrichten

1. Firebase-Projekt erstellen.
2. Authentication aktivieren.
3. Firestore-Datenbank erstellen.
4. Web-App im Firebase-Projekt anlegen.
5. Werte in `public/app.js` bei `firebaseConfig` eintragen.
6. Projekt-ID in `.firebaserc` eintragen.
7. Im Ordner `functions`: `npm install`
8. Firebase CLI: `npm install -g firebase-tools`
9. Anmelden: `firebase login`
10. Veröffentlichen: `firebase deploy --only firestore:rules,functions,hosting`

## Ersten Einladungscode erstellen

Firestore-Collection: `invites`

Dokument-ID: `PSSS-START-01`

Feld: `used` = `false`
