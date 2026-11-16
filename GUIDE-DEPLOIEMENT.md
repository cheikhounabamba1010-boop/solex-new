# Déployer SOLEX gratuitement (Render + Supabase)

Architecture : le serveur Node/Express tourne sur **Render** (gratuit).
Les données (produits, devis, réglages, mot de passe admin) sont dans **Supabase** (gratuit),
et les images envoyées depuis l'admin sont dans **Supabase Storage**.
Résultat : rien n'est perdu quand Render redémarre ou redéploie.

## 1. Supabase (≈ 5 min)
1. Créer un compte sur https://supabase.com puis **New project** (région proche, ex. Paris/Frankfurt).
2. Menu **SQL Editor → New query**, coller le contenu de `supabase-setup.sql`, cliquer **Run**.
3. Menu **Project Settings → API** et copier :
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** (clé secrète) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. GitHub
Remplacer le contenu du dépôt par ce projet, puis retirer l'ancien fichier de données du suivi Git :
```
git rm -r --cached data
git add .
git commit -m "Migration Supabase + Render"
git push
```

## 3. Render (≈ 5 min)
1. https://render.com → **New → Web Service** → choisir le dépôt SOLEX
   (ou **New → Blueprint** : le fichier `render.yaml` pré-remplit tout).
2. Réglages si saisie manuelle :
   - Build Command : `npm install --include=dev && npm run build`
   - Start Command : `npm start`
   - Plan : **Free**
3. **Environment** : ajouter
   - `NODE_ENV` = `production`
   - `SUPABASE_URL` = (Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY` = (service_role key)
   - `SUPABASE_BUCKET` = `uploads`
   - `ADMIN_PASSWORD` = le mot de passe admin de votre choix
4. **Create Web Service**. Quand c'est « Live », ouvrir `https://votre-app.onrender.com/admin`.
   Identifiant : `admin` — mot de passe : la valeur de `ADMIN_PASSWORD`.

> `ADMIN_PASSWORD` n'est lu qu'à la toute première initialisation de la base.
> Ensuite, changez le mot de passe depuis les Réglages de l'admin.

## 4. Limites du plan gratuit
- **Render Free** : le site se met en veille après ~15 min sans visite ; le premier chargement prend alors ~30 s.
- **Supabase Free** : un projet sans activité pendant environ 7 jours peut être mis en pause. Il se réactive en un clic dans le tableau de bord (les données sont conservées).
- Pour limiter la veille : un service de ping gratuit (ex. UptimeRobot) sur `https://votre-app.onrender.com/healthz` toutes les 5 min.

## 5. Test en local
```
cp .env.example .env     # puis remplir les valeurs
npm install
npm run dev              # http://localhost:3000
```
Sans variables Supabase, le projet utilise un fichier local `data/store.json` (pratique pour développer).

## Sécurité
- Ne jamais publier la clé `service_role` (ni sur GitHub, ni dans le code front).
- Vercel n'est plus utilisé : vous pouvez supprimer ce projet Vercel.
