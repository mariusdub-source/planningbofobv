# MetaFlight AI

Application moderne de comparaison de vols avec :

- recherche flexible par mois ;
- départ depuis les principaux aéroports français ;
- interface Next.js prête pour Vercel ;
- API Route Next.js de démonstration dans `app/api`.

> Cette version est prête pour un premier déploiement technique. Les prix de vols réels nécessitent encore l'intégration d'un fournisseur de données vols.

## Prérequis

- Node.js 20 ou supérieur recommandé.
- Un compte GitHub.
- Un compte Vercel.

## Installation locale

```bash
npm install
npm run dev
```

Puis ouvrir :

```text
http://localhost:3000
```

## Build de production

```bash
npm run build
npm run start
```

## Déploiement GitHub + Vercel

1. Créer un dépôt GitHub.
2. Pousser ce dossier dans le dépôt.
3. Importer le dépôt dans Vercel.
4. Garder les paramètres par défaut du framework Next.js.
5. Lancer le déploiement.

## Structure

```text
metaflight-ai/
├─ app/
│  ├─ api/
│  │  ├─ search/
│  │  │  └─ route.js
│  │  └─ status/
│  │     └─ route.js
│  ├─ layout.jsx
│  └─ page.jsx
├─ data/
│  └─ france-airports.json
├─ .gitignore
├─ package.json
├─ README.md
└─ vercel.json
```

## API

### `GET /api/status`

Retourne le statut de l'API.

### `POST /api/search`

Payload attendu :

```json
{
  "departure": "Paris — Charles-de-Gaulle (CDG)",
  "destination": "Tokyo",
  "month": "2026-09"
}
```
