# Plan de Implementación Simplificado - AbTech

## Phase 1: Configuración Inicial (Completado)
- [x] Backend Setup (Spring Boot 2.7, JWT, H2).
- [x] Frontend Setup (Angular 17, TailwindCSS).
- [x] Deployment Mockup.

## Phase 2: Sitio Público (Completado)
- [x] Header/Footer Responsive.
- [x] Landing Page Sections (Hero, Services, Systems).
- [x] Contact Form & API Integration.
- [x] Chatbot Widget.

## Phase 3: Internationalization (Completado)
- [x] Install `ngx-translate`.
- [x] Configure `TranslateModule`.
- [x] Create JSON assets.
- [x] Implement Language Switcher.
- [x] Translate Main Landing Page components.

## Phase 4: CRM Core & Funnel (Completado)
- [x] **Leads Module**: Capture, List, Detail.
- [x] **Opportunities Module**: Dedicated view for qualified leads.
- [x] **Clients Module**: Automated conversion (Lead -> Client).
- [x] **Dashboard Base**: Key metrics.

## Phase 5: Notifications & Dashboard Inbox (Current)
- [x] **Dashboard Inbox**: Recent messages list with quick actions.
- [ ] **Email Notifications**: SMTP setup and automated alerts.
- [ ] **SEO & Performance**: Meta tags and build optimization.

## Phase 6: Migración de Base de Datos & SEO
- [ ] **DB Migration**: Switch from H2 to PostgreSQL (e.g., Neon or Supabase).
- [ ] **SEO Optimization**: Meta tags, titles, and dynamic descriptions.
- [ ] **Sitemap & Robots**: Generation for better indexing.

## Phase 7: Deployment (Staging) [COMPLETE]

Summary of deployment to Vercel (Frontend) and Render/Neon (Backend/DB).

## Phase 8: Bug Fixes & UX Polishing [IN PROGRESS]

### Chatbot Responsiveness
- [ ] Migrate `messages`, `isOpen`, and `isEmailCaptured` to Angular Signals.
- [ ] Implement auto-scroll to bottom on new messages.
```
