# Mon Petit Poster

Site e-commerce pour la vente de posters paysage en style croquis. Les utilisateurs peuvent uploader leurs photos ou choisir dans une galerie, et l'image finale est transformée manuellement par l'équipe admin puis envoyée par email.

## Technologies

- **Frontend:** Next.js 14 + React + TypeScript
- **Styling:** Tailwind CSS
- **Backend/BaaS:** Supabase (Auth, PostgreSQL, Storage, Functions)
- **Paiement:** Stripe / PayPal (placeholders)
- **Emails:** SendGrid / Mailgun (via Supabase Functions)
- **Hébergement:** Cloudflare Pages (frontend)

## Fonctionnalités

- ✅ Upload d'images ou sélection depuis une galerie
- ✅ Personnalisation de texte avec sélection de police
- ✅ Création de compte et authentification
- ✅ Suivi des commandes avec statuts multiples
- ✅ Intégration de paiement (Stripe/PayPal - placeholders)
- ✅ Envoi d'images finales par email (placeholder)
- ✅ Images de galerie avec watermark et protection contre le clic droit

## Installation

### Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)
- (Optionnel) Comptes Stripe et/ou PayPal pour les paiements
- (Optionnel) Compte SendGrid ou Mailgun pour les emails

### Configuration

1. **Cloner le projet**
```bash
git clone <repository-url>
cd latelierduposter
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine du projet :

```env
# Supabase Configuration (requis)
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase

# Stripe (optionnel)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=votre_clé_publique_stripe
STRIPE_SECRET_KEY=votre_clé_secrète_stripe

# PayPal (optionnel)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=votre_client_id_paypal

# Email (pour Supabase Functions)
SENDGRID_API_KEY=votre_clé_sendgrid
# OU
MAILGUN_API_KEY=votre_clé_mailgun
MAILGUN_DOMAIN=votre_domaine_mailgun
```

4. **Configurer Supabase**

   a. Créez un projet sur [Supabase](https://supabase.com)

   b. Exécutez le script SQL dans `supabase/schema.sql` dans l'éditeur SQL de Supabase

   c. Créez les buckets de stockage :
     - `uploaded-images` (privé)
     - `final-images` (privé)
     - `gallery-images` (public)

   d. Configurez les politiques RLS (Row Level Security) - elles sont déjà dans le schéma SQL

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## Structure du projet

```
latelierduposter/
├── components/          # Composants React réutilisables
│   ├── auth/           # Composants d'authentification
│   ├── image/          # Composants pour images (galerie, upload)
│   ├── layout/         # Layout principal
│   ├── orders/         # Composants pour les commandes
│   ├── payment/        # Composants de paiement
│   └── poster/         # Composants de personnalisation
├── lib/                # Utilitaires et configurations
│   └── supabase/       # Client Supabase
├── pages/              # Pages Next.js
│   ├── api/            # Routes API
│   ├── auth/           # Pages d'authentification
│   ├── orders/         # Pages de commandes
│   └── ...
├── styles/             # Styles globaux
├── supabase/           # Configuration Supabase
│   ├── functions/      # Edge Functions
│   └── schema.sql      # Schéma de base de données
└── public/             # Fichiers statiques
```

## Déploiement

### Frontend (Cloudflare Pages)

1. Build le projet :
```bash
npm run build
```

2. Déployer sur Cloudflare Pages (via dashboard ou CLI)

3. Configurer les variables d'environnement dans Cloudflare Pages

### Supabase Functions

1. Installer Supabase CLI :
```bash
npm install -g supabase
```

2. Se connecter :
```bash
supabase login
```

3. Lier le projet :
```bash
supabase link --project-ref votre-project-ref
```

4. Déployer les functions :
```bash
supabase functions deploy send-validation-email
```

## Statuts des commandes

Les commandes passent par les statuts suivants :

1. `pending_transformation` - En attente de transformation
2. `in_progress` - En cours
3. `sent_for_validation` - Envoyé pour validation
4. `validated` - Validé
5. `printing` - En impression
6. `shipped` - Expédié
7. `delivered` - Livré

## Notes importantes

- ⚠️ Les intégrations de paiement (Stripe/PayPal) sont des **placeholders**. Pour la production, implémentez :
  - Création de Payment Intents (Stripe) ou Orders (PayPal) côté serveur
  - Gestion des webhooks pour confirmer les paiements
  - Mise à jour du statut des commandes

- ⚠️ L'envoi d'emails est un **placeholder**. Pour la production :
  - Configurez SendGrid ou Mailgun
  - Implémentez l'envoi d'emails dans la function Supabase
  - Ajoutez des templates d'emails

- 🔒 Les images de galerie sont protégées avec watermark et clic droit désactivé
- 🔒 L'authentification et le stockage sont gérés par Supabase avec RLS activé
- 🔒 Les paiements doivent être conformes PCI-DSS (traitement côté serveur)

## Développement

### Commandes disponibles

```bash
npm run dev      # Lance le serveur de développement
npm run build    # Build pour la production
npm run start    # Lance le serveur de production
npm run lint     # Vérifie le code avec ESLint
```

### Ajouter des images à la galerie

Pour ajouter des images à la galerie, insérez-les dans la table `gallery_images` via Supabase :

```sql
INSERT INTO gallery_images (name, thumbnail_url, low_res_url)
VALUES ('Nom de l image', 'https://...', 'https://...');
```

**Important :** Les images doivent être :
- Basse résolution
- Avec watermark
- Stockées dans le bucket `gallery-images`

## Contribution

Les contributions sont les bienvenues ! Veuillez créer une issue ou une pull request.

## Licence

[À définir]

## Support

Pour toute question, contactez : contact@lafabriqueaposter.fr
