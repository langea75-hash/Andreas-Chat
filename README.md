# Psss 0.3 – Firebase-Testversion

## Neu
- Konten über Firebase Authentication
- Chats und Nachrichten in Echtzeit über Firestore
- Freunde ausschließlich per persönlichem Einladungscode
- Keine Benutzersuche, keine Sprachnachrichten, keine Audioanrufe

## Hochladen
1. ZIP entpacken.
2. `index.html`, `style.css`, `app.js`, `manifest.webmanifest` und `icon.svg` in das GitHub-Repository hochladen und alte Dateien ersetzen.
3. GitHub Pages einige Minuten aktualisieren lassen.
4. Browser-Cache leeren oder Seite mit Strg+F5 neu laden.

## Firestore-Regeln
Den Inhalt von `firestore.rules` in Firebase unter **Firestore → Regeln** einfügen und veröffentlichen. Die Regeln erlauben nur angemeldeten Nutzern den Zugriff auf Chats, an denen sie beteiligt sind.

## Test
Auf Gerät 1 ein Konto registrieren und den persönlichen Einladungscode kopieren. Auf Gerät 2 ein zweites Konto registrieren und den Code über **+ Einladung** hinzufügen. Danach können beide Geräte Nachrichten austauschen.

## Sicherheitshinweis
Dies ist eine Testversion. Der sichtbare PIN wird intern in ein Firebase-Passwort umgewandelt. Der allgemeine Registrierungscode `PSSS-2026` steht im Webcode und ist daher keine starke Zugangskontrolle. Für eine öffentliche Version braucht Psss serverseitig geprüfte Einladungen und weitere Sicherheitsprüfungen.
