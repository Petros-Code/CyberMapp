# 🚀 Déploiement Railway — Node.js/Express + AlwaysData + Resend
> Contexte : API backend Node.js/Express, base de données AlwaysData (MySQL), emails transactionnels via Resend, déploiement sur Railway.

---

## ÉTAPE 1 — Préparer le projet pour Railway

- Le script `start` dans `package.json` doit pointer vers le point d'entrée (`node index.js`)
- Ajouter le champ `engines` avec la version Node (`>=18.0.0`)
- Le serveur doit écouter sur `process.env.PORT || 3000`
- Créer un fichier `.railwayignore` excluant `node_modules`, `.env`, `*.log`

---

## ÉTAPE 2 — Configurer Resend (SMTP)

- Créer un compte sur resend.com (gratuit : 3 000 emails/mois)
- Générer une clé API (`re_...`) dans le dashboard → API Keys
- Optionnel mais recommandé : ajouter un domaine custom et configurer les DNS
- Installer le SDK : `npm install resend`
- Créer `services/mailer.js` avec une fonction `sendVerificationEmail(toEmail, token)`
- La fonction construit un lien `APP_URL/auth/verify?token=...` et envoie l'email via `resend.emails.send()`

### Routes auth à créer
- `POST /auth/register` → crée l'user, génère un token (crypto.randomBytes), envoie l'email
- `GET /auth/verify?token=...` → vérifie le token en BDD, passe `is_verified = true`

---

## ÉTAPE 3 — Variables d'environnement

Fichier `.env` local (ne jamais commiter) :

```
DB_HOST=mysql.alwaysdata.net
DB_USER=...
DB_PASSWORD=...
DB_NAME=...
DB_PORT=3306

RESEND_API_KEY=re_xxxxx

APP_URL=https://ton-app.railway.app
NODE_ENV=production
```

---

## ÉTAPE 4 — Déployer sur Railway

1. **New Project** → Deploy from GitHub repo → sélectionner le repo
2. Onglet **Variables** → ajouter toutes les variables du `.env` une par une
3. Onglet **Settings → Networking** → Generate Domain → copier l'URL
4. Mettre à jour `APP_URL` avec l'URL générée
5. Onglet **Deployments** → View Logs → vérifier `Server running on port XXXX`

---

## ÉTAPE 5 — Tester

```bash
curl -X POST https://ton-app.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

L'email de vérification doit arriver dans la foulée.

---

## Récapitulatif des variables Railway

| Variable         | Valeur                        |
|------------------|-------------------------------|
| `DB_HOST`        | `mysql.alwaysdata.net`        |
| `DB_USER`        | Ton user AlwaysData           |
| `DB_PASSWORD`    | Ton mot de passe              |
| `DB_NAME`        | Nom de ta BDD                 |
| `DB_PORT`        | `3306`                        |
| `RESEND_API_KEY` | `re_xxxxx`                    |
| `APP_URL`        | `https://xxx.railway.app`     |
| `NODE_ENV`       | `production`                  |

---

## Prompt Cursor suggéré

Copie-colle ce bloc dans Cursor pour générer le code manquant :

```
Tu es un expert Node.js/Express. Mon projet utilise :
- Express pour l'API REST
- MySQL via AlwaysData (variables d'env : DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT)
- Resend pour les emails (variable : RESEND_API_KEY)
- Déployé sur Railway (variable APP_URL pour construire les liens)

Génère :
1. services/mailer.js — fonction sendVerificationEmail(toEmail, token) avec Resend SDK
2. routes/auth.js — POST /register (génère token, sauvegarde en BDD, envoie email) + GET /verify?token= (valide token, met is_verified=true)
3. Le schéma SQL de la table users avec les champs : id, email, password_hash, is_verified, verification_token, token_expires_at, created_at

Utilise async/await, gère les erreurs avec try/catch, et respecte les bonnes pratiques de sécurité (bcrypt pour le mot de passe, token expirant en 24h).
```