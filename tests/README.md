# Tests - Priisme Audit

Ce dossier contient tous les tests pour le projet Priisme, organisés en plusieurs catégories.

## Structure

```
tests/
├── audit/           # Tests d'audit automatisés
├── e2e/             # Tests end-to-end des flux utilisateurs
└── README.md        # Ce fichier
```

## Audit Tests (`tests/audit/`)

Ces tests sont conçus pour auditer automatiquement la qualité du code et les performances.

### `crawl.spec.ts`
Crawler automatique qui:
- Teste toutes les routes principales
- Capture les erreurs console
- Génère des rapports JSON dans `reports/crawl-audit.json`
- Teste en desktop (1920x1080) et mobile (375x812)

**Routes testées:**
- `/` - Page d'accueil
- `/about`, `/blog`, `/careers`, `/contact`
- `/auth/sign-in`, `/auth/sign-up`
- `/app`, `/app/search`, `/app/shop`
- `/app/marketplace`, `/app/ai-stylist`
- etc.

### `performance.spec.ts`
Tests de performance mesurant:
- **LCP** (Largest Contentful Paint) - Objectif: < 2.5s
- **TTFB** (Time to First Byte) - Objectif: < 600ms
- **FCP** (First Contentful Paint) - Objectif: < 1.8s
- Nombre de ressources chargées
- Taille totale de la page
- Taille du JavaScript

**Rapport:** `reports/performance-audit.json`

### `accessibility.spec.ts`
Tests d'accessibilité utilisant axe-core:
- Contraste des couleurs
- Textes alternatifs des images
- Labels des formulaires
- Ordre des titres
- Landmarks ARIA
- Navigation au clavier

**Rapport:** `reports/accessibility-audit.json`

## E2E Tests (`tests/e2e/`)

Tests des flux utilisateurs critiques.

### `critical-flows.spec.ts`
- Chargement de la page d'accueil
- Navigation entre les pages
- Accessibilité des pages d'authentification
- Responsive design (mobile)
- Fonctionnalité de recherche
- Détection des erreurs console

## Exécution des Tests

### Tous les tests d'audit
```bash
npm run test:audit
```

### Tests E2E complets
```bash
npm run test:e2e
```

### Mode UI interactif
```bash
npm run test:e2e:ui
```

### Tests spécifiques
```bash
# Crawler uniquement
npx playwright test tests/audit/crawl.spec.ts

# Performance uniquement
npx playwright test tests/audit/performance.spec.ts

# Accessibilité uniquement
npx playwright test tests/audit/accessibility.spec.ts
```

## Configuration

La configuration de Playwright se trouve dans `playwright.config.ts`:

- **Desktop:** Chrome 1920x1080
- **Mobile:** iPhone 14 (375x812)
- **Firefox:** Desktop
- **Trace:** Activée sur premier retry
- **Screenshots:** Sur échec uniquement
- **Video:** Sur premier retry

## CI/CD

Les tests sont exécutés automatiquement via GitHub Actions (`.github/workflows/audit.yml`):

1. **Lint** - Vérification ESLint
2. **Type Check** - Vérification TypeScript
3. **Unit Tests** - Tests Vitest
4. **E2E Tests** - Tests Playwright
5. **Security Audit** - npm audit + vérification console.log
6. **Performance Audit** - Analyse du bundle

## Rapports

Les rapports générés sont stockés dans `reports/`:

- `crawl-audit.json` - Résultats du crawl
- `performance-audit.json` - Métriques de performance
- `accessibility-audit.json` - Violations d'accessibilité
- `AUDIT_REPORT.md` - Rapport complet de l'audit

## Bonnes Pratiques

1. **Ajouter des tests** pour chaque nouvelle route critique
2. **Exécuter les tests localement** avant de pousser
3. **Vérifier les rapports** générés dans `playwright-report/`
4. **Maintenir les seuils de performance** définis
5. **Corriger les violations d'accessibilité** immédiatement

## Dépannage

### Les tests échouent en local
```bash
# Installer les navigateurs Playwright
npx playwright install

# Exécuter avec le mode debug
npx playwright test --debug
```

### Timeouts
Augmenter le timeout dans `playwright.config.ts` si nécessaire:
```typescript
use: {
  actionTimeout: 30000,
  navigationTimeout: 60000,
}
```

### Ressources externes
Pour ignorer les erreurs de ressources externes:
```typescript
page.route('**/*.{png,jpg,jpeg,gif,svg}', route => route.abort());
```
