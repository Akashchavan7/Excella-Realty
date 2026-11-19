# Content audit — items for Excellaa to verify

All business content on this site was taken from excellaa.com and the microsites it links to
(crawled 19 Nov 2026, 125 pages). Nothing was invented. Where the current site contradicts
itself or looks out of date, the value used here is listed below so Excellaa can confirm it.

## 1. Company figures (conflicting on the current site)

| Figure | Values found | Used here |
| --- | --- | --- |
| Years of legacy | 34+ (home, banners), 31+ / 30+ (older blocks), "25 years" (Group page), "13 Years of Legacy" (Tremont 2.0 banner) | **34+** |
| Projects | 22+ (current), 17+ (older) | **22+** |
| Built-up area | 50 lakh+ sq ft (current), 26 lakh+ (older) | **50 lakh+** |
| Families | 4,500+ (banners), 5,000+ (About text), 2,000+ (older) | **4,500+** |
| Awards | 10+ (current), 8+ (older) | **10+** |

Also: the About page says "Gujarat, Pune, Mumbai, and Gujarat"; several pages still contain
"Lorem Ipsum" placeholder text (Projects intro, Management, Team, Careers, Awards, two Values).

## 2. Leadership

- The About page names **Kishore Jain as MD**; the Management page lists him as "Director" and its
  profile pop-up shows "Mr. Atul Nikam, Managing Director" with placeholder text. We show Kishore Jain as MD.
- The About page mentions **Mitesh Jain**; the Management page does not list him (it lists Khushal
  Sanghvi, Rakshit Sanghvi, Deepak Jain and Mohanlal Jain instead). We show the nine people who have photos.

## 3. Project status and data

| Project | Issue | Used here |
| --- | --- | --- |
| Excellaa Virtu | "Newly launched" and "Nearing possession" both shown. Its "Location advantages" list (Seasons Mall, Magarpatta, EON…) is East Pune and appears copied from Tremont. | Ongoing; the copied distance list is **not** used |
| Excellaa Tremont 2.0 | Page contains another developer's leftovers ("Livence", enquiry@livience.com, +91 9020280000, "Tower C Simplex 6 BHK" floor plans, "Office features"). Four different starting prices appear. | Leftovers and floor plans **not** used |
| Excellaa Florence | Two MahaRERA numbers (P52100030760, P52100030786) with no phase labels; "Florence Nxt" appears in the enquiry form. Hospital distances are all "4 km". | Both numbers shown; hospital list not used |
| Excellaa Primarc | Map embed on the Autograph page points to "Astoria Royals, Ravet". Possession "2027". | Pin from the Primarc page; possession shown "as published" |
| Excellaa Plazzo / Embassy | Two pages with the same address and MahaRERA P52100021440. Plazzo is in "Completed" but banners say "Nearing possession". | One project (Plazzo), Completed |
| Excellaa Residency | Detail page shows "RERA Reg. No.: P0000000000" and a "3 & 4 BHK in Dhanori" title; listing shows P52100021432, 2 BHK, Ambegaon. | P52100021432, Luxury 2 BHK |
| Panama Park, Chesterfield | Not in the "Completed" list, but a society handover event (Panama Park) and "Possession Dec 2022" (Chesterfield) are published. | Completed |
| Ganga Acropolis | "2, 3 & 3.5 BHK" on its page; "2, 3, 3.5, 4 BHK & Penthouse" elsewhere. | 2, 3 & 3.5 BHK |
| Upcoming | "Excellaa Prospera" (Bavdhan) appears only on a banner; "Codename TOTT" has no location. "The Gold Collection" is listed as upcoming but is Virtu's collection. | Prospera and TOTT listed as upcoming, no map pin |
| Polaris reviews | excellaapolaris.com shows five "Google reviews" we could not match to a Google listing. | Not used |

**Prices are not shown anywhere.** The current site publishes conflicting prices; the site uses
"Request pricing" instead. Published figures can be added to `src/content/projects.ts` once confirmed.

## 4. Map coordinates

- **Site-level pins** (from the Google Maps embeds on Excellaa's own pages): Polaris, Primarc, Virtu,
  Florence, Kalash, Plazzo/Residency, Ganga Acropolis, Panama Park.
- **Locality-level pins** (OpenStreetMap centroid of the published locality, drawn as hollow markers):
  Tremont (Keshav Nagar), Chesterfield (Dhanori), Fortune 108 (Wakad), Fortune Mirador (Baner),
  Orchid and Solitaire (Dhanori), Sai Paradise (Vishrantwadi). Please supply exact coordinates.
- Not mapped: Iris (no coordinates found), and the projects outside Pune city (Lonavala, Mumbai, Vapi).

## 5. Contact details

Phone numbers differ page to page. The site uses, from `src/lib/site.ts`:
sales 020 7196 9111, toll-free 1800 103 3130, WhatsApp +91 85307 77566, office +91 88802 00900 /
+91 97641 88388, info@excellaa.com, hr@excellaa.com. Please confirm the canonical set.

## 6. Brochures and careers

- Only the **Panama Park** brochure still downloads from excellaa.com (hosted here in `/public/brochures`).
  The other eight brochure links on the current site return 404; those projects show "Request brochure".
- The Careers page contains three overlapping lists of openings. We show the list under
  "Hiring for below positions". Please confirm current vacancies.

## 7. Testimonials

Twelve of the seventeen written testimonials are in the data file, transcribed verbatim from Excellaa's
testimonial cards (spacing after punctuation normalised only); the homepage carousel shows the shorter ones.
Video stories are the YouTube videos embedded on excellaa.com/testimonial1.php.
