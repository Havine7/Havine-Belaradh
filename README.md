# Havine Belaradh — Portfolio professionnel

Site React + TypeScript + Tailwind CSS 4 + Vite, responsive, avec trois sites de démonstration fictifs et indépendants :
- `/demos/boulangerie` : Maison Aurore, produits et informations pratiques.
- `/demos/coiffure` : Studio Éclat, prestations et simulation de réservation.
- `/demos/plombier` : Atelier Martin, services et simulation de devis.

## Développement et vérification

Node.js 22 ou 24 recommandé.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vite affiche l’adresse locale et le port utilisés. Ouvrir cette adresse dans un navigateur local. Pour une prévisualisation publique, importer le dépôt dans Vercel et utiliser son déploiement Preview. Dans un environnement cloud, utiliser le mécanisme de transfert de port proposé par votre outil, s’il est disponible.

Le build de production est généré dans `dist/`. `npm run preview` sert ce build ; ce n’est pas un serveur de production.

## Formulaire de contact

Copier `.env.example` vers `.env.local`, puis renseigner `VITE_CONTACT_ENDPOINT` avec l’URL HTTPS d’un service acceptant un POST FormData et une réponse JSON, par exemple Formspree. Sur Vercel, ajouter cette variable aux environnements concernés et redéployer. Ne jamais y mettre un secret : les variables VITE sont publiques.

Sans endpoint, le bouton d’envoi est désactivé et une explication est affichée. Un envoi HTTP réussi affiche une confirmation ; une erreur conserve les champs et propose de réessayer. Vérifier la réception réelle dans la boîte configurée avant publication. Les formulaires des démos fonctionnent uniquement en simulation, sans transmission ni réservation réelle.

## Déploiement Vercel

1. Importer ce dépôt GitHub dans Vercel, choisir le framework **Vite**.
2. Utiliser `npm run build` et le répertoire de sortie `dist` (définis aussi dans `vercel.json`).
3. Renseigner éventuellement `VITE_CONTACT_ENDPOINT`, puis déployer.
4. Tester directement les trois URL de démonstration et `/confidentialite`, y compris après actualisation. La règle de réécriture permet ces routes.

Avant publication commerciale : compléter les mentions légales et la politique de confidentialité dans `src/App.tsx` avec les coordonnées, le statut, l’hébergeur, le prestataire de formulaire et la conservation des données. Aucun renseignement légal n’a été inventé. Confirmer les conditions commerciales et fiscales. Les tarifs indiqués sont des frais uniques de création ; domaine, abonnements et maintenance sont exclus.

Le référencement de base comprend langue, titre, description, Open Graph, structure de titres et textes alternatifs. Les démos sont rendues côté client. Après choix du domaine final, ajouter des URL canoniques et un sitemap adapté. Les images proviennent d’Unsplash et les polices de Google Fonts : une connexion Internet est nécessaire à ces ressources, avec polices de repli en cas d’échec. Pour supprimer ces connexions tierces, héberger des ressources locales avec les licences appropriées.

## Enregistrer sur GitHub

```sh
git status
git diff
npm test
npm run build
git add .
git commit -m "Créer le portfolio et les trois sites de démonstration"
git push origin HEAD:main
```

La branche locale peut être `work`. Pour un flux avec revue, pousser plutôt sur une branche dédiée : `git push origin HEAD:portfolio`, puis ouvrir une pull request vers `main`. Ne pas committer `.env.local`, `node_modules` ou `dist`. L’authentification et les droits de push doivent être disponibles. Aucun commit ni push n’est effectué automatiquement par ce projet.
