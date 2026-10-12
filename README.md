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

Le référencement de base comprend langue, titre, description, Open Graph, structure de titres et textes alternatifs. Les démos sont rendues côté client. Après choix du domaine final, ajouter des URL canoniques et un sitemap adapté. Les visuels photoréalistes générés et les polices Inter / Cormorant Garamond sont hébergés localement. Les licences des polices sont conservées dans `public/fonts`. Aucune dépendance de production supplémentaire n’a été ajoutée pour la refonte.

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

## Direction artistique — Dark Editorial Luxury

Noir profond, chocolat, anthracite et bordeaux cerise ; textes crème et accents pastel discrets. Inter et Cormorant Garamond sont hébergées localement avec leurs licences. Le logo bordeaux apparaît sur un cartouche crème pour conserver sa lisibilité.

L’entrée révèle le logo, le titre et le grand visuel en moins de 1,3 seconde, sans écran de chargement ni blocage de navigation. Au défilement : IntersectionObserver pour les contenus, zoom photographique de 2,5 à 7 % sur les seuls visuels visibles, mises à jour regroupées par requestAnimationFrame et écouteurs passifs. En mouvement réduit, ces animations et zooms sont désactivés. Le contenu reste visible si IntersectionObserver manque.

Les trois démonstrations conservent leurs prestations et leurs parcours : Maison Aurore (chocolat / cuivre), Studio Éclat (bordeaux / bronze), Atelier Martin (anthracite / vert minéral). Les tarifs du portfolio restent exactement 50 €, 100 € et 150 €. Le formulaire principal reste désactivé sans endpoint HTTPS ; les formulaires des démos simulent uniquement une demande.

Les anciens dessins SVG sont remplacés dans l’interface par trois **visuels photoréalistes générés**, pas des photographies d’entreprises réelles. Ils sont hébergés localement en WebP responsive à 400, 700 et 1024 px. Voir `public/images/README.md`. Aucun secret ni dépendance de production n’a été ajouté.

Pour visualiser les modifications locales sans publication :

```sh
cd /workspace/Havine-Belaradh
npm run dev
```

Pour vérifier le résultat de production : `npm test`, `npm run build`, puis `npm run preview`. Ouvrir l’adresse locale affichée par Vite sur la machine où le serveur tourne. Dans un environnement cloud, il faut un transfert de port fourni par votre outil ou récupérer les fichiers modifiés sur votre ordinateur. Aucun push, déploiement ou fusion n’est nécessaire pour prévisualiser.

Les tests de navigateur utilisent Chromium à 320, 390, 768 et 1440 px. Safari, Firefox et appareils physiques restent à vérifier.

Validation de cette version sombre : 14 tests Vitest réussis, build TypeScript/Vite réussi, Chromium à 320/390/768/1440 px sans débordement horizontal. Chargement des WebP et polices locales, sélection de pack, contact inactif, parcours des trois démos, retour du focus après Échap, zoom au défilement et désactivation effective en mouvement réduit vérifiés. Les contrastes principaux sont supérieurs à 4,5:1. Aucun navigateur externe autre que Chromium ni appareil physique n’a été vérifié.
