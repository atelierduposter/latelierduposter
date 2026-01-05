# Structure du Projet La fabrique à poster

Ce document décrit la structure complète du projet généré.

## Fichiers de configuration

- `package.json` - Dépendances et scripts npm
- `tsconfig.json` - Configuration TypeScript
- `next.config.js` - Configuration Next.js
- `tailwind.config.js` - Configuration Tailwind CSS
- `postcss.config.js` - Configuration PostCSS
- `.gitignore` - Fichiers à ignorer par Git
- `.env.local.example` - Exemple de variables d'environnement

## Structure des dossiers

```
latelierduposter/
├── components/              # Composants React réutilisables
│   ├── auth/
│   │   ├── LoginForm.tsx   # Formulaire de connexion
│   │   └── SignUpForm.tsx  # Formulaire d'inscription
│   ├── image/
│   │   ├── ImageGallery.tsx    # Galerie d'images avec watermark
│   │   └── ImageUpload.tsx     # Upload d'images
│   ├── layout/
│   │   └── Layout.tsx      # Layout principal avec header/footer
│   ├── orders/
│   │   ├── OrderCard.tsx   # Carte de commande
│   │   ├── OrderDetail.tsx # Détails d'une commande
│   │   └── OrderList.tsx   # Liste des commandes
│   ├── payment/
│   │   └── PaymentForm.tsx # Formulaire de paiement (Stripe/PayPal)
│   └── poster/
│       └── PosterCustomizer.tsx  # Personnalisation de poster
│
├── lib/                    # Utilitaires et configurations
│   └── supabase/
│       └── client.ts       # Client Supabase et types
│
├── pages/                  # Pages Next.js (Pages Router)
│   ├── api/                # Routes API
│   │   └── payment/
│   │       ├── stripe.ts   # API Stripe (placeholder)
│   │       └── paypal.ts   # API PayPal (placeholder)
│   ├── auth/
│   │   ├── login.tsx       # Page de connexion
│   │   ├── signup.tsx      # Page d'inscription
│   │   └── callback.tsx    # Callback OAuth/email
│   ├── orders/
│   │   ├── index.tsx       # Liste des commandes
│   │   └── [id].tsx        # Détail d'une commande
│   ├── account.tsx         # Page compte utilisateur
│   ├── customize.tsx       # Page de personnalisation
│   ├── index.tsx           # Page d'accueil
│   └── _app.tsx            # App wrapper
│
├── styles/                 # Styles globaux
│   └── globals.css         # Styles Tailwind et personnalisés
│
├── supabase/               # Configuration Supabase
│   ├── functions/          # Edge Functions
│   │   ├── send-validation-email/
│   │   │   └── index.ts    # Function d'envoi d'email
│   │   └── README.md       # Documentation des functions
│   └── schema.sql          # Schéma de base de données
│
├── README.md               # Documentation principale
└── PROJECT_STRUCTURE.md    # Ce fichier
```

## Fonctionnalités implémentées

### ✅ Authentification
- Connexion avec email/mot de passe
- Inscription de nouveaux utilisateurs
- Gestion de session avec Supabase Auth
- Protection des routes

### ✅ Gestion d'images
- Galerie d'images avec watermark
- Protection contre le clic droit
- Upload d'images personnelles
- Stockage sécurisé dans Supabase Storage

### ✅ Personnalisation
- Sélection d'image (galerie ou upload)
- Ajout de texte personnalisé
- Sélection de police de caractères
- Aperçu en temps réel

### ✅ Commandes
- Création de commandes
- Suivi des statuts (7 statuts différents)
- Affichage des détails
- Historique des commandes

### ✅ Paiement
- Intégration Stripe (placeholder)
- Intégration PayPal (placeholder)
- Formulaires de paiement

### ✅ Base de données
- Schéma PostgreSQL complet
- Row Level Security (RLS) activé
- Tables: orders, gallery_images
- Index pour performance

### ✅ Emails
- Function Supabase pour envoi d'emails (placeholder)
- Support SendGrid et Mailgun

## Prochaines étapes

1. **Configuration Supabase**
   - Créer un projet Supabase
   - Exécuter le schéma SQL
   - Créer les buckets de stockage
   - Configurer les variables d'environnement

2. **Implémentation des paiements**
   - Configurer Stripe ou PayPal
   - Implémenter les Payment Intents (Stripe)
   - Implémenter les webhooks
   - Mettre à jour les statuts de commande

3. **Implémentation des emails**
   - Configurer SendGrid ou Mailgun
   - Implémenter l'envoi d'emails dans la function
   - Créer des templates d'emails

4. **Ajout d'images à la galerie**
   - Uploader des images avec watermark
   - Les ajouter à la table gallery_images

5. **Déploiement**
   - Déployer le frontend sur Cloudflare Pages
   - Déployer les functions Supabase
   - Configurer le domaine (OVH + Cloudflare)

## Notes importantes

- ⚠️ Les intégrations de paiement sont des **placeholders**
- ⚠️ L'envoi d'emails est un **placeholder**
- 🔒 La sécurité est gérée par Supabase (RLS, Auth, Storage)
- 🎨 Le design utilise Tailwind CSS avec un thème personnalisé
- 📱 L'interface est responsive
