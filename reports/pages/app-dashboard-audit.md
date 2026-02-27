---
# 📄 Audit — App Dashboard (`/app`)
**Date** : 27 février 2026  
**Fichier** : `app/app/page.tsx`  
**Auth requise** : OUI  
**Analysée avec** : Playwright + lecture code source  

---

## 🎯 Résumé Exécutif
Le dashboard principal de l'application (après authentification) présente une interface busy avec plusieurs sections : hero carousel, salons populaires, marketplace picks, trending styles, et vidéos. La page fetch des données depuis plusieurs APIs et inclut une carte interactive (Leaflet). Cependant, il y a des problèmes de performance et d'erreurs non gérées.

---

## 📊 Scores
| Critère | Note | Objectif |
|---------|------|----------|
| Cohérence visuelle | 6/10 | 10/10 |
| Hiérarchie & Layout | 7/10 | 10/10 |
| Fluidité mobile | 6/10 | 10/10 |
| Interactions & Animations | 7/10 | 10/10 |
| Performance | 65/100 | 95+ |
| Accessibilité | 70/100 | 95+ |
| Qualité du code | 7/10 | 10/10 |
| Expérience utilisateur | 7/10 | 10/10 |
| **SCORE GLOBAL** | **6.6/10** | **10/10** |

---

## 🖼️ Screenshots
| Viewport | Screenshot |
|----------|------------|
| Mobile 375px | ![mobile-375](../screenshots/app-mobile-375.png) |
| Desktop 1280px | ![desktop](../screenshots/app-desktop-1280.png) |

---

## 🔴 Problèmes Critiques

### [PC-1] Erreur de géolocation non gérée
- **Composant** : `components/ui/Map.tsx` (importé dynamiquement)
- **Description** : `GeolocationPositionError` lors du chargement de la carte
- **Impact utilisateur** : Erreur console, la fonctionnalité carte peut être compromise
- **Solution recommandée** : 
  ```tsx
  if (!navigator.geolocation) {
    // Fallback handling
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => { /* success */ },
      (error) => { 
        console.warn('Geolocation error:', error.message);
        // Set default position ou show message
      }
    );
  }
  ```
- **Priorité** : IMMÉDIATE

---

## 🟠 Problèmes Majeurs

### [PM-1] Trop d'appels API au chargement
- **Description** : 4 appels API并行 (salons, products, videos trending, videos)
- **Impact utilisateur** : Slow LCP, possible rate limiting
- **Solution recommandée** : Créer un endpoint聚合 /api/home qui retourne toutes les données en un appel

### [PM-2] Map dynamiquesans fallback d'erreur
- **Description** : Le composant Map est importé dynamiquement mais sans gestion d'erreur complète
- **Impact utilisateur** : Si le chargement échoue, pas de message clair
- **Solution recommandée** : Ajouter un error boundary et un message plus clair

### [PM-3] Images non optimisées dans les listings
- **Description** : Les produits/salons/images utilisent des URLs directes
- **Impact utilisateur** : Images non optimisées, temps de chargement long
- **Solution recommandée** : Utiliser next/image pour toutes les images

---

## 🟡 Problèmes Moyens

### [PMoy-1] Catégorie "all" devrait être sélectionnée par défaut
- **Description** : La catégorie "all" existe mais n'est pas activée par défaut
- **Solution recommandée** : `useState("all")` au lieu de `useState("")`

### [PMoy-2] Loading state basique
- **Description** : Un simple spinner pendant le chargement
- **Solution recommandée** : Ajouter des skeletons pour chaque section

### [PMoy-3] Layout trop long
- **Description** : La page fait beaucoup de scroll sans navigation claire
- **Solution recommandée** : Ajouter une navigation latérale ou des anchor links

---

## 🐛 Erreurs Techniques Détectées
Console errors  : GeolocationPositionError
Network errors  : À vérifier
Build warnings  : Warning sur useEffect sans dépendances (ligne ~93)
TypeScript errors: Aucun

---

## 📱 Détail Mobile
- ✅ Navigation fonctionne
- ⚠️ La carte prend beaucoup de place verticalement
- ⚠️ Les cards de produits sont trop petites sur mobile
- ❌ Le hero carousel pourrait être difficile à utiliser sur mobile

---

## ♿ Détail Accessibilité
- ✅ Labels sur les boutons
- ⚠️ Les images de produits n'ont pas toutes des alt texts
- ⚠️ La navigation pourrait avoir plus de ARIA labels

---

## 💡 Note du CTO
Le dashboard est le cœur de l'expérience utilisateur connectée. Il montre beaucoup de potentiel avec les différentes sections (salons, produits, vidéos), mais la performance est un problème majeur.

Points prioritaires:
1. Corriger l'erreur géolocation - montre un manque de gestion d'erreur defensive
2. Optimiser les appels API - un seul endpoint serait mieux
3. Ajouter des skeletons - le spinner seul est insuffisant pour une UX premium

La carte Leaflet est un bon ajout pour les salons, mais elle doit être opt-in plutôt que obligatoire (problème de permission).
