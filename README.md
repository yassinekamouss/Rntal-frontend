# Rapport Frontend – Real Estate Rental Platform

## 1. Résumé Exécutif
Ce document présente le frontend Angular de la plateforme de location immobilière. Il couvre la conception, l’architecture, les flux critiques (authentification, réservation), les choix techniques, la sécurité, la qualité et les perspectives d’évolution. L’application est une SPA (Single Page Application) modulaire, construite avec Angular (standalone components + lazy loading) et Angular Material.

## 2. Objectifs Fonctionnels
- Parcourir et filtrer les biens (status, recherche adresse)
- Visualiser les détails d’un bien (galerie, localisation, prix)
- Authentification (inscription, connexion, profil) basée sur JWT
- Gestion propriétaire/admin : CRUD de biens et consultation des réservations par bien
- Gestion locataire : création de réservation et liste de ses locations
- Respect strict du contrat API fourni (DTOs typés)

## 3. Stack Technique & Versions
| Domaine | Choix | Détails |
|---------|-------|---------|
| Framework | Angular | v20.x (standalone) |
| UI | Angular Material | Thème indigo-pink + composants formulaires |
| Langage | TypeScript | Typage strict DTOs |
| Réactivité | RxJS | Observables pour flux HTTP & état auth |
| Tests | Jasmine + Karma | Tests unitaires ciblés services & guards |
| Build | Angular build system | Config production avec fileReplacements |

## 4. Architecture Logique
```
src/
  app/
    core/        # Services, guards, intercepteur, modèles, constantes
    shared/      # Composants transverses (navbar, dialogs, notifications)
    features/    # Domaines fonctionnels (auth, properties, rentals, profile)
    app.routes.ts
    app.config.ts
```
Principes :
- Séparation des préoccupations (Core vs Features vs Shared)
- Lazy loading des pages via `loadComponent` pour réduire le bundle initial
- Intercepteur HTTP central pour token + erreurs
- Pas de state manager externe ; usage de BehaviorSubject + signals Angular

## 5. Flux d’Authentification
1. L’utilisateur soumet login ou register → POST `/auth/login` ou `/auth/register`
2. Réception du JWT → stockage selon préférence (localStorage si "remember", sinon sessionStorage)
3. Hydratation utilisateur → GET `/auth/me`
4. Publication sur `currentUser$` → mise à jour UI (Navbar, accès routes)
5. Déconnexion → purge stockage + redirection `/login`

Pseudo-diagramme:
```
[Form Login] -> AuthService.login() -> POST /auth/login -> token -> GET /auth/me -> currentUser$ -> UI
```

## 6. Routing & Contrôle d’Accès
| Route | Guard(s) | Roles requis | Lazy | Composant |
|-------|----------|--------------|------|-----------|
| `/` | - | - | Oui | HomeComponent |
| `/properties/:id` | - | - | Oui | PropertyDetailComponent |
| `/login` | UnauthGuard | - | Oui | LoginComponent |
| `/register` | UnauthGuard | - | Oui | RegisterComponent |
| `/profile` | AuthGuard | - | Oui | ProfileComponent |
| `/me/rentals` | AuthGuard + RoleGuard | TENANT | Oui | MyRentalsComponent |
| `/me/properties` & enfants | AuthGuard + RoleGuard | OWNER, ADMIN | Oui | MyProperties / PropertyForm / PropertyRentals |
| `/access-denied` | - | - | Oui | AccessDeniedComponent |
| `**` | - | - | Oui | NotFoundComponent |

## 7. Modèles & Contrat API
Tous les DTOs sont définis dans `core/models/dtos.ts` avec correspondance stricte aux schémas backend. Aucune propriété supplémentaire ni renommage. Avantages : robustesse de compilation et alignement contractuel.

## 8. Services & Intercepteur
- `AuthService`: login, register, me, gestion token, hydrate
- `PropertyService`: list (filtres), get, listMine, create, update, delete
- `RentalService`: create, listMine, listForProperty
- `jwt.interceptor.ts`: ajoute `Authorization: Bearer <token>` si présent, gère statuts HTTP (401 → logout, 403 → snack + redirection, 400/404 → message backend, 5xx → message générique)

## 9. Gestion d’État
- Auth : `BehaviorSubject<UserResponseDTO|null>` exposé via `currentUser$`
- Composants métiers : usage des `signal()` pour données locales (liste de propriétés, liste de locations, property courante, état de chargement)
- Pas de global store lourd (NgRx) pour réduire la complexité initiale.

## 10. UI & UX
- Navigation adaptative selon rôle
- Feedback immédiat (snackbars) pour succès/erreurs
- Formulaires réactifs : validation synchrone (dates, champs obligatoires)
- États vides explicites (“Aucun bien.”, “Aucune réservation.”)
- Calcul dynamique du prix total des nuits

## 11. Validation & Règles Métier
- Réservation: startDate ≥ aujourd’hui; endDate ≥ startDate + 1 jour (contrôle côté client avant POST)
- Interdiction implicite de réservation si bien non `AVAILABLE` (masqué via `canBook()`)
- Saisie images: textarea multi-lignes transformé en tableau `imageUrls` filtré

## 12. Sécurité Frontend
- Token jamais exposé directement dans le DOM hors usage pour rôle/email
- Stockage sécurisé (localStorage ou sessionStorage) et purge sur logout/401
- Erreurs serveur réduites au champ `message` en interface utilisateur
- Guard multi-niveaux empêche accès direct aux routes protégées

## 13. Tests & Qualité
Couverture minimale implémentée pour points critiques :
- AuthService (stockage token / hydratação basique) ✔
- AuthGuard / RoleGuard (logique accès / redirection) ✔
- PropertyService (filtres requête HTTP) ✔

Stratégie future recommandée :
- Tests sur RentalService (création réservation avec mock dates)
- Tests sur intercepteur (vérifier injection header + flux erreurs)
- Tests composants (Validation formulaire réservation)

## 14. Build & Environnements
- `environment.ts` / `environment.prod.ts`: `apiBaseUrl` identique, surcharges possibles
- `angular.json`: `fileReplacements` en configuration production
- Production: hashing de sortie + optimisation Angular par défaut

## 15. Scripts NPM
| Script | Usage |
|--------|-------|
| `npm start` | Dev server (http://localhost:4200) |
| `npm run build` | Build production (dist/) |
| `npm test` | Tests unitaires watch |

## 16. Installation & Démarrage
```bash
# Installation
npm install

# Démarrage dev
npm start

# Build prod
npm run build
```
Assurez-vous que le backend écoute sur `http://localhost:8080/api`.

## 17. Observabilité & Diagnostic
- Console logs contrôlés (erreurs API critiques)
- Snackbars pour visibilité utilisateur
- (À ajouter) logger central + monitoring performance (Web Vitals)

## 18. Performance & Optimisations
Déjà en place :
- Lazy loading des principales features
- Signals pour minimiser surcharges de change detection

À envisager :
- Pré-chargement intelligent (quicklink) pour routes critiques
- Compression d’images côté serveur & CDN
- Virtualisation listes (si volume important)

## 19. Roadmap (Évolutions Futures)
| Priorité | Item | Description |
|----------|------|-------------|
| Haute | Statuts réservation interactifs | CONFIRMED / CANCELLED transitions côté UI |
| Haute | Pagination & tri | Optimisation listes propriétés / réservations |
| Moyenne | Intégration carte réelle | Leaflet ou Google Maps pour géolocalisation |
| Moyenne | Cache HTTP | TTL sur listes publiques de propriétés |
| Basse | i18n | Internationalisation (fr/en) |
| Basse | Tests E2E | Cypress ou Playwright |

## 20. Limitations Actuelles
- Pas de mise à jour automatique du statut d’un bien après réservation (rechargement manuel)
- Aucune gestion des collisions de dates côté client (confiance au backend)
- Layout basique (Material par défaut, pas de thème custom avancé)
- Aucune persistance locale offline / PWA

## 21. Couverture des Critères d’Acceptation
| Critère | Statut | Détails |
|---------|--------|---------|
| Base API utilisée partout | ✔ | `environment.apiBaseUrl` centralisé |
| Auth + JWT + stockage token | ✔ | Intercepteur + AuthService |
| Guards (auth / role / unauth) | ✔ | Définitions + tests unitaires |
| CRUD Propriétés propriétaire | ✔ | Liste, création, édition, suppression |
| Réservation locataire | ✔ | Formulaire + validation dates + calcul prix |
| Affichage réservations par bien | ✔ | Page `property-rentals` |
| Feedback erreurs backend | ✔ | Intercepteur + NotificationService |
| Tests unitaires minimaux | ✔ | 4 specs critiques |
| Lazy loading routes | ✔ | `loadComponent` dans `app.routes.ts` |
| Formulaires réactifs & validations | ✔ | Login, Register, Booking, PropertyForm |
| README détaillé | ✔ | Présent (ce document) |

## 22. Arborescence (Extrait)
```
src/app/
  core/
    services/ (auth.service.ts, property.service.ts, rental.service.ts)
    guards/ (auth.guard.ts, role.guard.ts, unauth.guard.ts)
    interceptors/ (jwt.interceptor.ts)
    models/dtos.ts
    constants.ts
  shared/
    components/ (navbar, confirm-dialog, access-denied, not-found)
    services/ (notification.service.ts)
  features/
    auth/ (login, register)
    properties/ (home, detail, my-properties, property-form)
    rentals/ (my-rentals, property-rentals)
    profile/ (profile.component.ts)
```

## 23. Recommandations Immédiates
1. Ajouter tests sur l’intercepteur (simulation 401/403/400/500)
2. Gérer invalidation cachée des listes (refetch après actions CRUD sans besoin d’un reload manuel)
3. Compléter gestion de statut propriété après réservation si logique backend évolue


---
**Fin du rapport.** Pour toute évolution, se référer à la section Roadmap et maintenir la stricte conformité avec le contrat API backend.
