# havine. — Studio web indépendant, Lyon

Proposition **Éditorial affirmé** sur la branche `havine-editorial`, construite avec React, TypeScript, Tailwind CSS et Vite. Les versions `main`, `portfolio` et `havine-dark` sont conservées. Aucun déploiement ni changement de domaine n’est nécessaire pour examiner cette version.

## Récupérer et prévisualiser sur Debian

**Node 24 LTS recommandé** (`24.19.0` dans `.nvmrc`). L’installation, les 16 tests, le contrôle TypeScript et la compilation ont aussi été vérifiés avec **Node 20.19.2**. Node 20 étant une version ancienne, privilégier une version LTS maintenue pour les futurs travaux.

```sh
git clone --branch havine-editorial --single-branch https://github.com/Havine7/Havine-Belaradh.git havine-editorial
cd havine-editorial
npm ci
npm run dev
```

Ouvrir l’adresse **locale** affichée par Vite dans le navigateur de cet ordinateur. Pour utiliser la version recommandée avec nvm, s’il est déjà installé : `nvm install && nvm use` depuis le dossier. Ne pas ouvrir `index.html` directement : le serveur Vite est nécessaire.

Si le dépôt est déjà cloné et que les fichiers locaux sont enregistrés, utiliser `git fetch origin` puis `git switch --track origin/havine-editorial` ; si la branche locale existe déjà, `git switch havine-editorial` puis `git pull --ff-only`. Ne pas écraser des modifications locales.

## Vérifications

```sh
npm test
npm run typecheck
npm run build
npm audit
npm run preview
```

`npm run build` contrôle TypeScript et génère `dist/`. `npm run preview` sert ce build localement ; ce n’est pas un serveur de production. Aucun lint n’est configuré dans le dépôt. Aucun `npm audit fix --force` n’a été utilisé.

Les tests Vitest vérifient les routes, les prix, le choix d’un pack, l’état du contact, les réponses d’envoi, les simulations des démos et la couverture sans photographie. Les scripts navigateur vérifient aussi le logo sans cadre, les captures adaptées à l’écran, les contrastes de textes principaux, le menu, le clavier et le mouvement réduit.

Pour les contrôles Chromium :

1. Démarrer le build avec `npm run preview -- --port 4173` dans un terminal.
2. Dans un autre terminal, lancer `npm run test:browser`.

Le script utilise `/usr/bin/chromium` s’il existe ; sur Debian, il peut être installé avec `sudo apt install chromium`. Sinon, installer le navigateur Playwright avec `npx playwright install chromium`, ou définir `PLAYWRIGHT_CHROMIUM_EXECUTABLE` avec le chemin de Chromium. `PREVIEW_URL` permet de choisir l’adresse du serveur. Les captures de contrôle sont ignorées par Git dans `test-results/editorial/`. `PLAYWRIGHT_NO_SANDBOX=1` est réservé aux conteneurs où le sandbox de Chromium ne peut pas démarrer ; ne pas l’utiliser sur un poste habituel.

Chromium a été vérifié à 320, 390, 768 et 1440 px. Safari, Firefox et appareils physiques restent à contrôler.

## Direction artistique et architecture

Fond taupe #AAA39F, gris perle #D4CEC9, gris profond #514A49, texte charbon #373332. Le bordeaux a été légèrement ajusté à #602539 pour le contraste. Pas de couverture noire, de photo de salon dans le premier écran, ni de cadre autour du logo.

Inter structure les titres et les informations ; Cormorant Garamond apporte les accents serif, avec une graisse 700 propre au logo. Les polices sont hébergées dans `public/fonts` avec leurs licences. `src/editorial.css` applique la nouvelle proposition au portfolio et laisse les trois démos indépendantes. Les styles partagés et la direction des démos sont conservés dans `src/styles.css` et `src/dark.css`.

Les animations utilisent CSS, IntersectionObserver et requestAnimationFrame, avec un défilement natif et sans bibliothèque d’animation. Le mouvement réduit supprime révélations et zooms. Les captures d’interface ne subissent qu’un zoom d’environ 0,3 à 1,2 % ; les photographies des démos gardent leur mouvement léger.

## Trois vraies démonstrations accessibles

- `/demos/boulangerie` — **Maison Aurore** : produits et informations pratiques.
- `/demos/coiffure` — **Studio Éclat** : prestations et simulation de réservation.
- `/demos/plombier` — **Atelier Martin** : services et simulation de devis.

Ces entreprises sont fictives. Les formulaires des démos ne transmettent aucune donnée et n’effectuent aucune réservation réelle. Les prestations et les tarifs du portfolio sont conservés dans `src/content.ts`, sans modification des inclusions et des limites des offres à **50 €, 100 € et 150 €**.

Le portfolio utilise de **véritables captures des routes**, et non des interfaces inventées : six fichiers desktop/mobile dans `public/previews`. `manifest.json` consigne les routes et les tailles de capture. Les photos d’ambiance visibles *dans* les démos sont les compositions photoréalistes générées de la version sombre ; elles ne représentent pas des entreprises réelles.

Pour actualiser les captures après une modification d’une démo : servir le dernier build sur le port 4173, puis `npm run capture:previews`, et refaire `npm run build` pour inclure les nouvelles images. Ne pas remplacer ces captures par des maquettes. Les originaux générés et les anciennes illustrations restent conservés ; seuls les fichiers utiles sont chargés par l’interface.

## Formulaire et informations à compléter

Aucune adresse e-mail, téléphone ou URL WhatsApp de Havine n’a été inventée. Le formulaire est **inactif tant que son service n’est pas configuré**. Copier `.env.example` vers `.env.local`, puis renseigner `VITE_CONTACT_ENDPOINT` avec l’URL HTTPS d’un service acceptant un POST FormData et une réponse JSON, par exemple Formspree. C’est une variable publique : ne jamais y mettre de secret. Redémarrer Vite après sa configuration et vérifier la réception réelle.

La page `/confidentialite` signale les informations qui restent à compléter avant toute publication commerciale : coordonnées professionnelles, statut et identifiants applicables, hébergeur, prestataire de formulaire, conservation des données et conditions de vente. Le référencement de base comprend les métadonnées, la langue, les titres et les textes alternatifs. Domaine canonique et sitemap attendent le choix d’un domaine final.

## Compatibilité et audit des dépendances

- `jsdom` est fixé à **27.4.0**, compatible Node 20.19.2, au lieu de 30.1.2 qui demandait un Node plus récent. Cela ne modifie que l’environnement de test.
- Vitest est mis à jour de **3.2.7 à 4.1.11**, de façon ciblée pour corriger les alertes GHSA-82fw-gwwq-j7x9, GHSA-5gmw-xhrv-c9v3 et GHSA-85c8-ppgw-ccpr touchant son ancien outillage. Les tests et Vite 6 restent compatibles ; aucun passage à une nouvelle majeure de Vite ou React.
- Playwright est une dépendance de développement, utilisée pour les vérifications et les captures réelles. Il n’entre pas dans le bundle du site.
- L’audit npm complet et de production ne signalent aucune vulnérabilité connue au moment de la validation.
- Le lockfile contient une dépendance native **optionnelle** de Rollup (`@napi-rs/lzma-linux-x64-gnu`) avec une exigence Node plus récente. L’installation avec Node 20.19.2 l’omet normalement et le build a été vérifié ainsi. Node 24.19.0 évite cette différence.

Cette branche est proposée pour examen local. Sa création sur GitHub ne constitue pas une fusion ni un déploiement. Ne pas fusionner dans une ancienne branche ou lancer de publication sans décision explicite.
