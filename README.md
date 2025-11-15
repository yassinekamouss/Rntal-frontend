# Real Estate Rental Frontend

Application Angular pour la plateforme de location immobilière.

## Prérequis
- Node.js (version LTS recommandée)
- Backend accessible sur `http://localhost:8080/api`

## Installation
```bash
npm install
```

## Démarrage (dev)
```bash
npm start
```
Ouvre `http://localhost:4200`.

## Build production
```bash
npm run build
```
Le fichier `angular.json` remplace `environment.ts` par `environment.prod.ts` pour la build de production.

## Configuration API
La base d’URL est définie dans `src/environments/environment*.ts`:
```ts
apiBaseUrl: 'http://localhost:8080/api'
```
Modifier si nécessaire (ex: variable d’environnement, proxy, etc.).

## Architecture
- `core/models/dtos.ts` : Interfaces TypeScript reflétant EXACTEMENT les DTO backend
- `core/services` : AuthService, PropertyService, RentalService
- `core/guards` : AuthGuard, RoleGuard, UnauthGuard
- `core/interceptors/jwt.interceptor.ts` : Injection automatique du header Authorization + gestion centralisée des erreurs
- `shared/services/notification.service.ts` : Snackbars Angular Material
- `features/**` : Composants fonctionnels (auth, propriétés, locations, profil)
- Standalone Components + Lazy Loading via `app.routes.ts`

## Rôles & Accès
| Rôle | Description | Accès principal |
|------|-------------|-----------------|
| ROLE_TENANT | Locataire | Réservation de biens, vue Mes locations |
| ROLE_OWNER  | Propriétaire | CRUD sur ses biens, vue réservations d’un bien |
| ROLE_ADMIN  | Admin | Droits identiques propriétaire (+ éventuellement futures admin features) |

## Routes & Protection
| Route | Public | AuthGuard | RoleGuard |
|-------|--------|-----------|----------|
| `/` | Oui | - | - |
| `/properties/:id` | Oui | - | - |
| `/login`, `/register` | Oui (redir si déjà auth) | UnauthGuard | - |
| `/profile` | Non | Oui | - |
| `/me/rentals` | Non | Oui | ROLE_TENANT |
| `/me/properties` & sous-routes | Non | Oui | ROLE_OWNER, ROLE_ADMIN |
| `/access-denied` | Oui | - | - |
| `**` (NotFound) | Oui | - | - |

## Formulaires & Validation
- Réservation: startDate >= aujourd’hui; endDate >= startDate + 1 jour
- Calcul du prix total en temps réel (nuits * pricePerNight)
- PropertyForm: URLs d’images saisies ligne par ligne

## Intercepteur
- Ajoute `Authorization: Bearer <token>` si token présent
- 401: logout + redirection `/login`
- 403: snackbar "Accès refusé" + redirection `/access-denied`
- 400/404: affiche le champ `message` backend
- 500+: snackbar générique + log console

## Stockage du token
- `Remember me` coché: `localStorage`
- Non coché: `sessionStorage`
- Hydratation au bootstrap via `APP_INITIALIZER` + `AuthService.hydrateFromStorage()`

## Tests unitaires
Fichiers présents:
- `auth.service.spec.ts`
- `auth.guard.spec.ts`
- `role.guard.spec.ts`
- `property.service.spec.ts`

Exécuter les tests:
```bash
npm test
```
(Karma en mode watch.) Pour une exécution unique CI, utiliser un script personnalisé (non inclus) ou configurer `--watch=false`.

## Notification & Feedback
- Snackbars pour succès/erreur/avertissement
- États de chargement (spinner sur la liste des propriétés, messages vides)

## Limitations connues
- Carte affichée sous forme de placeholder texte (pas d’intégration Maps réelle)
- Pas de pagination / tri avancé sur listes
- Pas de gestion internationale / i18n
- Aucune actualisation automatique des propriétés après création d’une réservation (nécessite recharger)
- Pas de tests E2E

## Prochaines améliorations suggérées
- Ajout d’un service de géolocalisation / composant Map
- Pagination et tri côté serveur
- Gestion des statuts de réservation (confirmation, annulation)
- Composant de chargement global et directives utilitaires

## Commandes utiles
```bash
npm start        # Dev server (watch)
npm run build    # Build prod
npm test         # Tests unitaires watch
## Sécurité
Ne jamais exposer le token en clair dans l’UI (conservé uniquement en storage). Les erreurs backend sont limitées au champ message pour l’utilisateur.
---
Ce projet est prêt pour consommer l’API backend. Adapter les styles ou ajouter des modules supplémentaires selon vos besoins.

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
