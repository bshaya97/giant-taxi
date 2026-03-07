# Giant Taxi - Project Instructions

## Project Overview
This is an internal taxi management system for a taxi company.

## Core Rules
- Hebrew-only UI
- RTL layout
- Desktop-first
- MVP scope only
- Keep implementation simple and structured
- Do not over-engineer
- Do not add libraries unless explicitly requested
- Prefer clear feature-based structure over abstraction

## Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS v4
- Supabase
- React Hook Form
- Zod
- TanStack Query
- React Router

## Tailwind Rules
- Use Tailwind CSS v4 with `@tailwindcss/vite`
- Do not use outdated Tailwind/PostCSS setup unless explicitly needed
- Keep styling simple and consistent
- Respect RTL in all layouts

## Architecture Rules
- Feature-based folder structure
- Shared reusable UI components under `src/components/ui`
- Supabase client in `src/lib/supabase.ts`
- Auth state in `src/context/AuthContext.tsx`
- Route constants in `src/config/routes.ts`
- Hebrew text centralized in `src/i18n/he.ts`
- Database uses snake_case
- Avoid unnecessary generic abstractions

## Auth / Permissions
- Auth is handled with Supabase Auth
- Roles are stored in `app_users`
- Protected routes require authenticated session
- Role-based access should be explicit and simple
- Do not assume every auth user has an app_users row

## Current Iteration Scope
Implement only the foundation phase:
1. Project scaffolding
2. Tailwind + RTL setup
3. Supabase client + auth context + login page + protected route + role guard
4. Database migration
5. App layout + routing + placeholder pages

Stop after that phase.
Do not implement CRUD yet.
Do not implement dashboard data logic yet.
Do not implement assignment business logic yet.

## Coding Style
- Strong typing
- Small focused components
- Clear file names
- Minimal comments, only where useful
- Production-structured code
- Avoid dead code
- Prefer readability over cleverness

## When unsure
- Choose the simplest MVP-safe implementation
- Do not invent extra business rules
- Keep placeholders minimal and explicit