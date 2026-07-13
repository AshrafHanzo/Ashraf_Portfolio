# 🕷️ Ashraf Ali — Portfolio Setup Guide

Your portfolio is now fully rebranded (Spider-Man comic theme + your resume data) and
wired to **your own** Firebase Realtime Database and **Supabase** storage.

The site works **right now** using the built-in data in `src/data/storytellingData.ts`.
Follow the steps below only to unlock the live **admin editor**, **resume upload**, and
**visitor analytics**.

---

## ▶️ Run it

```bash
npm install      # already done
npm run dev      # http://localhost:8080
npm run build    # production build → dist/
```

---

## 1. Firebase Realtime Database (content + admin)

Already connected to your project:

```
databaseURL: https://ashraf-portfolio-cd970-default-rtdb.firebaseio.com
```

**Set the database rules** (Firebase Console → Realtime Database → Rules).
For a public portfolio the simplest working rules are:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

> ⚠️ These rules are open to anyone. For production, lock `admin` down. A good middle ground:
> ```json
> {
>   "rules": {
>     "portfolio":       { ".read": true, ".write": true },
>     "settings":        { ".read": true, ".write": true },
>     "tracked_visitors":{ ".read": true, ".write": true },
>     "admin":           { ".read": true, ".write": true }
>   }
> }
> ```

**Seed your data into the DB:** open **`/admin/dashboard`** once — it pushes the built-in
content up to Firebase automatically. After that you can edit everything live in the dashboard.

**Optional (Auth / Analytics):** paste the remaining keys into `src/lib/firebase.ts`
(`apiKey`, `appId`, `messagingSenderId`, `measurementId`) from
Firebase Console → Project settings → *Your apps* → Web app config. RTDB works without them.

---

## 2. Supabase Storage (resume + files)

Connected in `src/lib/supabase.ts`:

```
URL:    https://hvimkesgfmetklwmrovi.supabase.co
Bucket: portfolio   (must be PUBLIC)
Resume: Ash_Resume.pdf
```

- The **Download Resume** button fetches:
  `https://hvimkesgfmetklwmrovi.supabase.co/storage/v1/object/public/portfolio/Ash_Resume.pdf`
- To replace your resume: upload a new `Ash_Resume.pdf` to the `portfolio` bucket
  (or use the **Resume** tab in `/admin/dashboard`, which uploads to Supabase for you).
- Make sure the bucket is **Public** (Supabase → Storage → portfolio → Settings) so downloads work.

---

## 3. Admin login

Go to **`/admin`**:

```
Username: ashraf
Password: Ashraf@2025      ← CHANGE THIS after first login (Settings → password)
```

The admin user is auto-created in your Firebase on first login attempt.

---

## 4. Things to personalise (quick TODOs)

| What | Where | Note |
|------|-------|------|
| GitHub URL | `src/data/storytellingData.ts` → `github` / `socials` | currently a placeholder `github.com/ashrafali2004` |
| Your DOB | `src/components/storytelling/StorySkills.tsx` → `birthDate` | drives the "Level" number (set to 2004) |
| Email delivery | Gmail SMTP via `/api/send-email` (see section 5) | ✅ Already yours — no EmailJS. |
| Profile photo | `public/assets/profile.png` | your portrait, copied from your old project |

---

## 5. Email — Gmail (contact form, OTP, visitor alerts)

Emails are sent through a **secure serverless function** (`api/send-email.js`) using your
Gmail **App Password** — with stunning Spider-Man HTML templates. The password lives ONLY in
environment variables, never in the browser bundle or the repo.

**Local dev:** already set in `.env` (git-ignored) — the contact form works under `npm run dev`.

**Production (Vercel):** add these in **Vercel → Project → Settings → Environment Variables**:

```
GMAIL_USER            = ashrafali.offic@gmail.com
GMAIL_APP_PASSWORD    = <your 16-char Gmail App Password>
CONTACT_TO            = ashrafali.offic@gmail.com
```

> 🔐 **Security:** your real App Password lives ONLY in `.env` (git-ignored) — never in the repo.
> The actual value is in your local `.env`; copy it from there into the Vercel env var.
> Generate/rotate app passwords at https://myaccount.google.com/apppasswords

Three email types (all styled): `contact` (form), `otp` (admin reset), `visitor` (visit alerts).

---

## 🎨 The theme
Full comic-book Spider-Man: red (`#e11d2a`) + blue (`#2563eb`), spider-web corner overlays,
halftone print texture, web-shooter cursor, comic scrollbar, and a spider loading emblem.
Colors live in `src/index.css` **and** `src/lib/themeSettings.ts` (kept in sync). You can also
recolor live from the **Appearance** tab in the admin dashboard.
