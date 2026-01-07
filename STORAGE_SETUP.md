# Configuration des buckets Supabase Storage

## Problème : "bucket not found"

Si vous rencontrez l'erreur "bucket not found" lors de l'upload d'images, c'est que les buckets Supabase Storage n'ont pas été créés.

## Solution : Créer les buckets

### Méthode 1 : Via l'interface Supabase (Recommandé)

1. Connectez-vous à votre projet Supabase : https://supabase.com/dashboard
2. Allez dans **Storage** dans le menu de gauche
3. Cliquez sur **New bucket**
4. Créez les 3 buckets suivants :

#### Bucket 1 : `uploaded-images`
- **Name** : `uploaded-images`
- **Public bucket** : ❌ Non (privé)
- **File size limit** : 10 MB
- **Allowed MIME types** : `image/png, image/jpeg, image/jpg, image/gif, image/webp`

#### Bucket 2 : `final-images`
- **Name** : `final-images`
- **Public bucket** : ❌ Non (privé)
- **File size limit** : 50 MB
- **Allowed MIME types** : `image/png, image/jpeg, image/jpg`

#### Bucket 3 : `gallery-images`
- **Name** : `gallery-images`
- **Public bucket** : ✅ Oui (public)
- **File size limit** : 5 MB
- **Allowed MIME types** : `image/png, image/jpeg, image/jpg, image/webp`

### Méthode 2 : Via SQL (Alternative)

1. Allez dans **SQL Editor** dans Supabase
2. Exécutez le fichier `supabase/storage-setup.sql`
3. Cela créera automatiquement les 3 buckets avec les bonnes politiques RLS

## Configuration des politiques RLS

Après avoir créé les buckets, vous devez configurer les politiques de sécurité (RLS) :

1. Allez dans **Storage** > **Policies**
2. Pour chaque bucket, configurez les politiques suivantes :

### Bucket `uploaded-images` (privé)
- ✅ Les utilisateurs authentifiés peuvent uploader leurs propres images
- ✅ Les utilisateurs authentifiés peuvent voir leurs propres images
- ✅ Les utilisateurs authentifiés peuvent supprimer leurs propres images

### Bucket `final-images` (privé)
- ✅ Les utilisateurs authentifiés peuvent voir leurs propres images finales
- ✅ Le service role peut uploader des images finales (pour l'admin)

### Bucket `gallery-images` (public)
- ✅ Tout le monde peut voir les images de la galerie
- ✅ Seul le service role peut uploader des images de galerie

## Vérification

Après avoir créé les buckets, testez l'upload d'une image. L'erreur "bucket not found" devrait disparaître.

## Note importante

Les politiques RLS sont déjà incluses dans le fichier `supabase/storage-setup.sql`. Si vous utilisez la méthode SQL, les politiques seront créées automatiquement.
