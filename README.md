# Vitora — AI Health Co-Pilot

A mobile-first health companion app built with React Native + Expo. Vitora tracks your key health metrics, surfaces AI-generated correlations, and acts as a daily health coach.

## Screens

| Screen | Description |
|---|---|
| **Login** | Auth screen with focus-state inputs and Google sign-in |
| **Dashboard** | Recharge Score, AI Health Coach, metric cards with 7-day sparklines, goal progress rings |
| **Health** | Heart rate graph, interactive water tracker, sleep stage breakdown |
| **Insights** | AI-generated correlations with confidence scores, weekly health report |
| **SOS** | Emergency alert with 3-second hold, live simulation flow, emergency contacts |

## Key Features

- **Recharge Score** — composite score (sleep quality + activity + heart recovery + hydration) with full breakdown
- **AI Coach card** — personalised daily suggestions based on current metrics
- **7-day sparklines** — trend mini-charts inside every metric card
- **Goal rings** — circular SVG progress rings for steps, hydration, and sleep
- **AI Insight cards** — correlations with confidence scores (e.g. "Sleep × HR: 87% confidence")
- **Weekly Health Report** — average sleep, HR, activity, hydration across the week
- **SOS simulation** — animated step-by-step alert flow (location → vitals → contacts notified)
- **Micro-feedback toasts** — live feedback on water glass taps (+200ml logged)
- **Detail modals** — every card opens a bottom-sheet with full data breakdown

## Stack

- **Framework:** Expo (React Native) with Expo Router
- **Language:** TypeScript
- **Charts:** react-native-svg
- **Gradients:** expo-linear-gradient
- **Icons:** @expo/vector-icons (Ionicons)
- **Navigation:** expo-router (file-based)

## Run Locally

```bash
npm install
npx expo start
```

Open in Expo Go on your phone, or press `w` for the web preview.

## Project Structure

```
app/
  _layout.tsx        # Root layout + auth guard
  index.tsx          # Redirects to /login
  login.tsx          # Login screen
  (tabs)/
    _layout.tsx      # Tab bar
    dashboard.tsx    # Main dashboard
    health.tsx       # Health metrics
    insights.tsx     # AI insights
    sos.tsx          # Emergency SOS

components/
  DetailModal.tsx    # Reusable bottom-sheet modal
  GoalRing.tsx       # SVG circular progress ring
  Toast.tsx          # Micro-feedback toast

context/
  auth.tsx           # Auth state (signIn / signOut)

constants/
  colors.ts          # Design tokens
```
