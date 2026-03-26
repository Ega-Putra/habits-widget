# Agents Guide

This repository uses Codex-style agent collaboration. These notes keep changes consistent and safe.

## Project Basics
- Stack: Expo + React Native + Expo Router
- Language: TypeScript
- Styling: React Native `StyleSheet`
- UI icons: `@expo/vector-icons` (prefer `Ionicons` with `-outline` names)
- Storage: `@react-native-async-storage/async-storage`

## File & Route Conventions
- Routes live in `app/`.
- Dynamic routes use bracketed folders, e.g. `app/edit/[id].tsx`.
- Keep Stack config in `app/_layout.tsx`.
- Avoid adding new dependencies unless requested.

## UI & Design Rules
- Match Figma spacing and sizes as closely as possible.
- Avoid Tailwind; use `StyleSheet`.
- Favor `Ionicons` outline icons instead of external SVGs.
- If a Figma design includes any SVG icon, replace it with an equivalent `Ionicons` outline icon.
- Use consistent colors:
  - Blue `#4285F4`
  - Red `#EA4335`
  - Yellow `#FBBC05`
  - Green `#34A853`
  - Grey `#5E636A`
  - Black `#1F1F1F`
  - White `#FFFFFF`

## Data & Behavior
- Habits are stored in AsyncStorage under key `habits`.
- A habit includes:
  - `id`, `name`, `description`, `color`, `emoji`, `track`, `repeat`
  - `days`, `monthDays`, `streak`, `lastCompletedDate`, `createdAt`
- Done logic:
  - Only one completion per day.
  - `lastCompletedDate` tracks the last completion date (YYYY-MM-DD).
  - Reset availability the next day (based on local device date).

## Guardrails
- Never delete unrelated files or revert user changes.
- Keep edits minimal and scoped.
- If unsure about a UX flow, implement the safest version and call it out.
