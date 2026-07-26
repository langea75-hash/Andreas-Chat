const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

admin.initializeApp();
const db = admin.firestore();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

const clean = value => String(value || "").trim().toLowerCase();
const validUsername = value => /^[a-z0-9äöü_-]{3,20}$/i.test(value);
const validPin = value => /^\d{4,8}$/.test(String(value || ""));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, app: "Psss🤫", version: "0.1" });
});

app.post("/api/register", async (req, res) => {
  try {
    const username = clean(req.body.username);
    const displayName = String(req.body.displayName || "").trim();
    const pin = String(req.body.pin || "");
    const inviteCode = String(req.body.inviteCode || "").trim().toUpperCase();

    if (!validUsername(username)) throw new Error("BAD_USERNAME");
    if (!displayName || displayName.length > 40) throw new Error("BAD_NAME");
    if (!validPin(pin)) throw new Error("BAD_PIN");
    if (!inviteCode) throw new Error("NO_INVITE");

    const inviteRef = db.collection("invites").doc(inviteCode);
    const usernameRef = db.collection("usernames").doc(username);
    let uid = null;

    await db.runTransaction(async tx => {
      const inviteSnap = await tx.get(inviteRef);
      const usernameSnap = await tx.get(usernameRef);

      if (!inviteSnap.exists) throw new Error("INVALID_INVITE");
      if (inviteSnap.data().used === true) throw new Error("INVITE_USED");
      if (usernameSnap.exists) throw new Error("USERNAME_TAKEN");

      const userRecord = await admin.auth().createUser({ displayName });
      uid = userRecord.uid;
      const pinHash = await bcrypt.hash(pin, 12);

      tx.set(db.collection("users").doc(uid), {
        username,
        displayName,
        pinHash,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      tx.set(usernameRef, {
        uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      tx.update(inviteRef, {
        used: true,
        usedBy: uid,
        usedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });

    const token = await admin.auth().createCustomToken(uid);
    res.json({ token, username, displayName });
  } catch (error) {
    const messages = {
      BAD_USERNAME: "Benutzername: 3 bis 20 Zeichen.",
      BAD_NAME: "Bitte einen Namen eingeben.",
      BAD_PIN: "Die PIN muss 4 bis 8 Ziffern haben.",
      NO_INVITE: "Einladungscode fehlt.",
      INVALID_INVITE: "Der Einladungscode ist ungültig.",
      INVITE_USED: "Der Einladungscode wurde bereits verwendet.",
      USERNAME_TAKEN: "Der Benutzername ist bereits vergeben."
    };
    res.status(400).json({ error: messages[error.message] || "Registrierung fehlgeschlagen." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const username = clean(req.body.username);
    const pin = String(req.body.pin || "");

    if (!validUsername(username) || !validPin(pin)) throw new Error();

    const usernameSnap = await db.collection("usernames").doc(username).get();
    if (!usernameSnap.exists) throw new Error();

    const uid = usernameSnap.data().uid;
    const userSnap = await db.collection("users").doc(uid).get();
    if (!userSnap.exists) throw new Error();

    const user = userSnap.data();
    if (!(await bcrypt.compare(pin, user.pinHash))) throw new Error();

    const token = await admin.auth().createCustomToken(uid);
    res.json({ token, username: user.username, displayName: user.displayName });
  } catch {
    res.status(401).json({ error: "Benutzername oder PIN ist falsch." });
  }
});

exports.api = onRequest({ region: "europe-west1", maxInstances: 10 }, app);
