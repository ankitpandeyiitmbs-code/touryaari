# Touryaari Travels v3 — Setup Guide

## What's New in V3

### 🔐 Critical Security Fix
- **All 18 admin API routes** now require `admin_session` cookie
- Any unauthenticated request to `/api/admin/*` returns **401 Unauthorized**
- Tested routes: tours, destinations, blog, hero-slides, testimonials, gallery, bookings, inquiries, users, settings, states

### 🏠 Homepage Redesign
- Replaced hard-coded destinations grid with **2 big state cards** (Uttar Pradesh & Uttarakhand)
- Each card links to `/states/[slug]` which shows all tours tagged to that state
- Cards are fully DB-driven — add/edit states in Admin → States

### 🗺️ States Feature
- New **States** section in admin sidebar
- Add unlimited states/regions from Admin → States → Add State
- Each state has: name, slug, card image, hero image, description, sort order, visibility
- Tours are linked to states via the **State** field in tour edit forms

### 📧 Booking Confirmation Emails
- After successful Razorpay payment, both customer and admin receive emails
- Customer gets: booking summary, payment ID, next steps
- Admin gets: full booking details + link to admin panel
- Uses SMTP (Gmail app password recommended)

### 💬 WhatsApp Button
- Floating WhatsApp button on every public page
- Set number in Admin → Settings → Contact → WhatsApp Number
- Expands on hover, opens pre-filled chat

### 🧹 Cleanup
- Removed "International" from tour categories
- Removed old CategoryStrip's International link

---

## Quick Start

### 1. Copy environment file
```bash
cp .env.local.example .env.local
```

Fill in all values in `.env.local`. Key ones:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password (change this!) |
| `SMTP_HOST` | SMTP server (e.g. `smtp.gmail.com`) |
| `SMTP_PORT` | SMTP port (`587` for TLS) |
| `SMTP_USER` | Gmail address |
| `SMTP_PASS` | Gmail App Password (not your login password) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number with country code, no `+` |

### 2. Run database migration
In your Supabase dashboard → SQL Editor, run the contents of:
```
states_migration.sql
```

This creates the `states` table and seeds Uttar Pradesh + Uttarakhand.

### 3. Install dependencies
```bash
npm install
```

### 4. Run locally
```bash
npm run dev
```

---

## Setting Up Gmail SMTP

1. Enable 2-Step Verification on your Google account
2. Go to **Google Account → Security → App passwords**
3. Create a new App Password for "Mail"
4. Use the 16-character password as `SMTP_PASS`

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop   ← remove spaces
```

---

## Admin Panel Guide

### Adding a New State
1. Admin → States → Add State
2. Fill: Name, Slug (auto-generated), Description, Card Image URL
3. Sort Order: 1 = first, 2 = second on homepage
4. Save → visible on homepage immediately

### Tagging Tours to a State
1. Admin → Tours → Edit any tour
2. Basic Info tab → scroll to **State** field
3. Enter state name (e.g. `Uttarakhand`) and slug (e.g. `uttarakhand`)
4. Save → tour now appears on `/states/uttarakhand`

### WhatsApp Setup
1. Admin → Settings → Contact tab
2. Enter WhatsApp number in format `919876543210` (91 = India code)
3. Save — button appears on all public pages instantly

---

## Verifying the Security Fix

```bash
# Should return 401 (not 200)
curl -i https://your-domain.com/api/admin/tours

# Should return 401
curl -i -X POST https://your-domain.com/api/admin/tours \
  -H 'Content-Type: application/json' -d '{}'

# Should return 200 after login
curl -i -X POST https://your-domain.com/api/admin/login \
  -H 'Content-Type: application/json' \
  -c cookies.txt \
  -d '{"email":"admin@yourdomain.com","password":"yourpassword"}'

curl -i https://your-domain.com/api/admin/tours -b cookies.txt
```

---

## File Structure (New/Changed)

```
src/
├── lib/
│   ├── admin-auth.ts          ← FIXED: added requireAdminApi()
│   └── email.ts               ← NEW: booking confirmation emails
├── app/
│   ├── page.tsx               ← CHANGED: uses StatesSection
│   ├── states/[slug]/
│   │   └── page.tsx           ← NEW: tours for a state
│   ├── api/
│   │   ├── states/route.ts    ← NEW: public states API
│   │   └── admin/
│   │       ├── states/        ← NEW: admin states CRUD API
│   │       └── */route.ts     ← FIXED: all have auth guards
│   └── admin/
│       └── states/            ← NEW: admin states management pages
├── components/
│   ├── home/
│   │   ├── StatesSection.tsx  ← NEW: homepage state cards
│   │   └── CategoryStrip.tsx  ← CHANGED: removed International
│   └── layout/
│       └── WhatsAppButton.tsx ← NEW: (backup; layout uses shared/WhatsAppFloat.tsx)
states_migration.sql           ← NEW: run in Supabase SQL editor
```
