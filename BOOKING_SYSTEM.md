# Système de Booking Complet - Priisme

Ce document décrit le système de booking complet implémenté pour Priisme, incluant la gestion du staff, les politiques d'annulation, le CRM et bien plus.

## 🚀 Fonctionnalités

### 1. Gestion du Staff

#### Tables
- `staff` - Membres du personnel (propriétaires, managers, stylistes, assistants)
- `staff_hours` - Horaires de travail par membre (peuvent différer des heures du salon)
- `staff_time_off` - Congés et indisponibilités
- `staff_services` - Services que chaque membre peut effectuer

#### API Routes
- `GET/POST /api/salons/[salonId]/staff` - Lister/créer des membres du staff
- `GET/PATCH/DELETE /api/staff/[staffId]` - Gérer un membre spécifique
- `GET /api/staff/[staffId]/availability?date=YYYY-MM-DD&serviceId=xxx` - Disponibilité
- `GET/PUT /api/staff/[staffId]/hours` - Horaires du staff

#### Fonctionnalités
- ✅ Rôles granulaires (owner, manager, stylist, assistant, receptionist)
- ✅ Horaires personnalisés par membre avec pauses
- ✅ Gestion des congés
- ✅ Commission par membre
- ✅ Couleurs pour l'affichage calendrier

### 2. Réservations Avancées

#### Améliorations de la table `bookings`
- `staff_id` - Assignation à un membre spécifique
- `source` - Origine de la réservation (web, app, phone, walk_in, instagram, google)
- `cancelled_at`, `cancelled_by`, `cancellation_reason` - Tracking d'annulation
- `checked_in_at`, `checked_in_by` - Check-in client
- `completed_at` - Date de complétion
- `internal_notes` - Notes privées salon

#### API Routes Mises à Jour
- `POST /api/bookings` - Crée une réservation avec support staff + CRM
- `GET /api/bookings` - Liste les réservations avec données staff
- `PATCH /api/bookings/[id]` - Mise à jour avancée (status, check-in, completion)
- `GET /api/bookings/availability?salonId=xxx&serviceId=xxx&date=YYYY-MM-DD&staffId=xxx`

### 3. Politiques d'Annulation et Acomptes

#### Tables
- `cancellation_policies` - Politiques par salon
  - `policy_type` - flexible, moderate, strict, custom
  - `free_cancellation_hours` - Heures avant annulation gratuite
  - `late_cancellation_fee` - % de pénalité
  - `no_show_fee` - % de pénalité no-show
  - `require_card` - Carte requise
  - `require_deposit` - Acompte requis
  - `deposit_percentage` - % d'acompte

- `booking_deposits` - Acomptes/paiements
  - `payment_intent_id` - ID Stripe
  - `status` - pending, held, charged, refunded, released

- `booking_reminders` - Configuration rappels
- `sent_reminders` - Log des rappels envoyés

#### API Routes
- `GET /api/salons/[salonId]/policies` - Récupérer politiques
- `PUT /api/salons/[salonId]/policies` - Mettre à jour politiques

### 4. CRM (Gestion Client)

#### Tables
- `client_profiles` - Profils clients par salon
  - Historique de visites
  - Dépenses totales
  - Préférences (staff préféré, allergies)
  - Tags (VIP, Regular, etc.)
  - Notes privées

- `service_history` - Historique détaillé des services
  - Formules (pour colorations)
  - Produits utilisés
  - Photos avant/après
  - Feedback client

- `client_communications` - Log communications
- `marketing_campaigns` - Campagnes marketing
- `campaign_recipients` - Destinataires campagnes

#### API Routes
- `GET /api/salons/[salonId]/crm` - Liste clients avec stats
- `GET /api/salons/[salonId]/crm/[clientId]` - Détail client complet
- `PATCH /api/salons/[salonId]/crm/[clientId]` - Modifier profil
- `POST /api/salons/[salonId]/crm/[clientId]` - Ajouter historique service

### 5. Migrations SQL

Le fichier `drizzle/0010_complete_booking_system.sql` contient toutes les migrations nécessaires :
- Enums PostgreSQL
- Création de tables
- Clés étrangères
- Index pour performance

## 📊 Architecture des Données

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     salons      │────<│  client_profiles│>────│     users       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │                 │
         │     ┌────────▼────────┐ ┌──────▼──────────┐
         │     │  service_history│ │campaign_recipients│
         │     └─────────────────┘ └─────────────────┘
         │
         ├────────────────────────────────────┐
         │                                    │
┌────────▼────────┐                  ┌────────▼────────┐
│     staff       │                  │ cancellation_   │
│   ├─ staff_hours│                  │    policies     │
│   ├─ staff_time_│                  └─────────────────┘
│   │   off       │
│   └─ staff_     │                  ┌─────────────────┐
│       services  │                  │  booking_       │
└─────────────────┘                  │   reminders     │
         │                           └─────────────────┘
         │                                    │
         └──────────────┬─────────────────────┘
                        │
               ┌────────▼────────┐
               │    bookings     │
               │  (améliorée)    │
               └─────────────────┘
```

## 🔌 Utilisation API

### Créer une réservation avec staff

```http
POST /api/bookings
Content-Type: application/json

{
  "salonId": "sal_xxx",
  "serviceId": "srv_xxx",
  "staffId": "stf_xxx",  // Optionnel
  "startTime": "2024-01-15T14:00:00Z",
  "endTime": "2024-01-15T15:00:00Z",
  "notes": "Première visite",
  "source": "web"
}
```

### Vérifier disponibilité staff

```http
GET /api/staff/[staffId]/availability?date=2024-01-15&serviceId=srv_xxx
```

Réponse:
```json
{
  "staffId": "stf_xxx",
  "staffName": "Julie",
  "date": "2024-01-15",
  "slots": [
    { "time": "09:00", "displayTime": "9:00 AM", "available": true },
    { "time": "09:30", "displayTime": "9:30 AM", "available": true }
  ]
}
```

### Check-in client

```http
PATCH /api/bookings/[id]
Content-Type: application/json

{
  "checkIn": true
}
```

### Marquer comme complété + mise à jour CRM

```http
PATCH /api/bookings/[id]
Content-Type: application/json

{
  "complete": true
}
```

Cela met à jour automatiquement:
- `bookings.status` → `completed`
- `bookings.completed_at` → now()
- `client_profiles.total_spent` += prix réservation

### Configurer politique d'annulation

```http
PUT /api/salons/[salonId]/policies
Content-Type: application/json

{
  "policyType": "moderate",
  "freeCancellationHours": 24,
  "lateCancellationFee": 50,
  "noShowFee": 100,
  "requireDeposit": true,
  "depositPercentage": 30
}
```

## 🎯 Prochaines Étapes Recommandées

1. **Intégration Stripe Connect** pour les acomptes
2. **Synchronisation Calendrier** (Google/Outlook)
3. **Notifications SMS** (Twilio)
4. **Rappels Automatiques** (cron job)
5. **Dashboard Analytics** pour les salons
6. **Export données clients** (CSV)
7. **Intégration avis post-rdv**

## 📝 Notes Importantes

- Les réservations créent automatiquement/mettent à jour les profils clients
- Les horaires staff ont priorité sur les horaires salon
- Les congés staff bloquent automatiquement les créneaux
- Les index SQL optimisent les requêtes de disponibilité
- Le check-in et complétion sont réservés aux propriétaires de salon
