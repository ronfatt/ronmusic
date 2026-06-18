# R.ON Music

Premium artist-owned music platform for R.ON. This MVP is a Next.js App Router website with public artist pages, a persistent HTML5 audio player, Supabase Auth admin dashboard, Supabase Storage uploads, contact inquiries, albums, songs, lyrics, stories, and play count tracking.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Database, Auth, and Storage
- Vercel-ready deployment

## Install Dependencies

```bash
npm install
```

## Create Supabase Project

1. Go to Supabase and create a new project.
2. Open **Project Settings > API**.
3. Copy:
   - Project URL
   - anon public key
   - service role key
4. Create a local `.env.local` file from `.env.example`.

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
OPENAI_API_KEY=your-openai-api-key
OPENAI_TEXT_MODEL=gpt-5.5
OPENAI_IMAGE_MODEL=gpt-image-1
ADMIN_EMAILS=ronfatt@gmail.com
```

The service role key is used only on the server for play count updates and admin-safe operations. Never expose it in client components.

## SQL Schema Setup

1. Open Supabase SQL Editor.
2. Paste and run the contents of:

```text
supabase/schema.sql
```

This creates:

- `songs`
- `albums`
- `song_albums`
- `inquiries`
- `admin_users`
- updated timestamp triggers
- Row Level Security policies
- storage object policies for `audio` and `covers`

## Supabase Storage Buckets

Create two public buckets in Supabase Storage:

1. `audio`
2. `covers`

The SQL file includes policies so public users can read files and authenticated admins can upload, update, and delete objects in those buckets.

## Create Admin User

1. Go to **Authentication > Users** in Supabase.
2. Create a user with email and password.
3. Add the email to `ADMIN_EMAILS` in `.env.local` and Vercel environment variables.
4. Use that account at:

```text
/admin/login
```

Only emails listed in `ADMIN_EMAILS` can access the protected dashboard. Separate multiple admin emails with commas.

## Run Locally

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin:

```text
http://localhost:3000/admin/login
```

## Build

```bash
npm run build
```

## Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Add the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `OPENAI_API_KEY`
   - `OPENAI_TEXT_MODEL`
   - `OPENAI_IMAGE_MODEL`
   - `ADMIN_EMAILS`
4. Deploy.

## Admin AI Song Assistant

The song create/edit form includes an admin-only AI assistant.

It can:

- Draft a song `description`
- Draft a longer song `story`
- Suggest SEO title and SEO description
- Suggest a social launch caption
- Generate mood tags
- Generate multilingual intro notes and lyric translation helpers
- Generate a release kit for YouTube, Facebook, Instagram, TikTok, WhatsApp, and licensing
- Generate three editable cover directions
- Generate a square cover image and upload it to the Supabase `covers` bucket

Workflow:

1. Enter song title, language, genre, lyrics, and optional AI notes.
2. Click **Generate copy**.
3. Review and edit the generated description, story, SEO fields, mood tags, translations, release kit, and cover directions.
4. Choose a cover direction or edit the cover prompt.
5. Click **Generate cover** if you want AI cover art.
6. Submit the song form to save the generated metadata and cover URL with the song.

AI routes are protected by the same `ADMIN_EMAILS` whitelist as the rest of the admin dashboard.

## Project Structure

```text
app
  (public)
    page.tsx
    music/page.tsx
    music/[slug]/page.tsx
    albums/page.tsx
    albums/[slug]/page.tsx
    artist/page.tsx
    contact/page.tsx
  (auth)
    admin/login/page.tsx
  admin
    dashboard/page.tsx
    songs/page.tsx
    songs/new/page.tsx
    songs/[id]/edit/page.tsx
    albums/page.tsx
    inquiries/page.tsx
components
  admin
  forms
  layout
  music
  player
  ui
lib
  supabase
  types
  utils
supabase
  schema.sql
```

## Notes

- Public pages show demo content if Supabase environment variables are not configured.
- Admin pages require Supabase Auth.
- Admin access also requires the authenticated user's email to be listed in `ADMIN_EMAILS`.
- Audio playback is handled by a persistent bottom mini-player in the root layout.
- Play count increments through `POST /api/songs/[id]/play`.
- Contact forms include server-side validation and a hidden honeypot field for basic spam reduction.
- Song uploads validate file type and size before sending files to Supabase Storage.
- The Admin AI Song Assistant uses OpenAI server-side only; the API key is never exposed to the browser.
