# Excellaa Realty — website redesign proposal

A redesign of [excellaa.com](https://www.excellaa.com/) prepared by **NIVON Tech Studio**.
All business content and imagery come from Excellaa's existing website; see
[docs/CONTENT-AUDIT.md](docs/CONTENT-AUDIT.md) for the items Excellaa should verify before launch.

## Run it

```bash
npm install
npm run dev        # http://localhost:6500
npm run build && npm start
npm run lint && npm run typecheck
```

Copy `.env.example` to `.env.local` to set the public site URL and the CRM provider.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · Radix primitives (shadcn-style
components) · Lucide · MapLibre GL JS · React Hook Form · Zod.

## Structure

```
src/app                  routes: /, /projects, /projects/[slug], /api/enquiry, sitemap, robots, OG image
src/components/sections  homepage sections (hero, about, projects, map, autograph, …)
src/components/project   project card (location above image), filter grid, gallery lightbox
src/components/map       Pune explorer, project map, shared map style
src/components/forms     enquiry form and dialog
src/content              typed data: projects.ts, company.ts, media.generated.ts
src/lib/crm              CRM integration boundary (adapters: log, webhook)
src/lib/site.ts          contact details, offices, social links
```

## Things to know

- **Content** lives in `src/content`. Add or edit a project in `projects.ts` and its page, card,
  map marker, sitemap entry and enquiry option all update.
- **Map**: OpenFreeMap dark vector tiles recoloured to the Excellaa palette, with AWS Terrarium
  elevation tiles for 3D terrain. No API key. MapLibre's worker is copied to `public/maplibre`
  by the `predev` / `prebuild` scripts.
- **Enquiries** post to `/api/enquiry`, are validated with the same Zod schema as the form, and
  are handed to a `CrmAdapter`. Set `CRM_PROVIDER=webhook` and `CRM_WEBHOOK_URL` to forward leads,
  or add an adapter in `src/lib/crm/adapters` for a specific CRM. The built-in rate limit is
  per-instance; use a shared store when running several instances.
- **Images** in `public/images` are optimised WebP conversions of Excellaa's published renders.
  Most originals are 800–1400 px wide; higher-resolution renders from Excellaa would sharpen the
  hero and galleries.
- **Journal** articles link to the existing posts on excellaa.com.
