# Ashraf Ali — Portfolio

Personal portfolio of **Ashraf Ali**, AI Automation Engineer & Full-Stack Developer.
A Spider-Man–themed single-page site with an admin dashboard for editing content,
a Supabase-hosted resume, and a serverless Gmail contact pipeline.

## Tech Stack

- **React 18 + TypeScript + Vite**
- **Tailwind CSS**, shadcn/ui, Framer Motion
- **Firebase Realtime Database** — content + admin
- **Supabase Storage** — resume & files
- **Serverless Gmail mailer** (`/api/send-email`) for the contact form

## Getting Started

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production build → dist/
```

## Configuration

Environment variables (Gmail SMTP) and backend setup are documented in
[`SETUP_ASHRAF.md`](./SETUP_ASHRAF.md). Copy `.env.example` to `.env` for local development.

## License

© Ashraf Ali. All rights reserved.
