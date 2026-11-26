# Teteman View Hotel website

Static public website with a Supabase-ready private admin dashboard. No build step is required for the public site.

## 1. Structure

```
index.html  rooms.html  dining.html  amenities.html  gallery.html  about.html  contact.html
css/style.css         main styles and colour variables (:root at the top)
css/responsive.css    mobile and tablet overrides
js/data.js            ALL editable content: phone, rooms, prices, amenities, reviews, gallery
js/icons.js           SVG icons
js/main.js            header, footer, forms, gallery, lightbox
images/               logo, hotel, rooms, dining, gallery
```

The header, footer, room cards, amenities, reviews, gallery and forms are built by `main.js` from `data.js`, so edit them once and every page updates.

## 2. Run it

Open `index.html` in a browser, or run a local server from this folder:

```text
python -m http.server 8080
```

Then open `http://localhost:8080`.

## 3. Replace the logo

Put the official logo in `images/logo/`:

- `logo.png` for light backgrounds (the scrolled navigation)
- `logo-light.png` (white version) for the dark hero and footer
- `favicon.png` for the browser tab

If `logo-light.png` is missing, the site shows `logo.png` in white (a display-only filter). If both are missing, it shows the hotel name as text. The logo itself is never altered.

## 4. Add hotel photos

Save photos with these names and they appear automatically. Until then the site shows a "Photo needed" placeholder (a temporary asset).

- `images/hotel/`: hero.jpg, exterior.jpg, reception.jpg, pool.jpg, conference.jpg
- `images/rooms/`: standard.jpg, deluxe.jpg, executive.jpg
- `images/dining/`: restaurant.jpg, bar.jpg, breakfast.jpg, menu.jpg
- `images/gallery/`: file names are listed in `js/data.js` under `gallery`

Use JPG or WebP, around 1600px wide, compressed under 300 KB each. To use WebP, change the extensions in `data.js` and the HTML files.

## 5. Room prices and details

The confirmed categories and prices are Economy GH₵250, Standard GH₵400 and Executive GH₵500. Edit `js/data.js` to update public fallback prices. Supabase room prices can be managed from the admin dashboard after setup.

## 6. Phone and WhatsApp number

`js/data.js`: `phone` (shown and used for calls) and `whatsapp` (international format without +). Also search the HTML files for `0245467920` (visible text in a few places).

## 7. Other hotel information

- Amenities: `data.js`, `amenities`
- Wording on each page: edit the matching `.html` file
- Menu: `dining.html`, the "Menu coming soon" section
- Footer and TikTok text: `js/main.js`, `chrome()`

## 8. Reviews

No fake ratings or reviews are displayed. Verified content must be approved in the Supabase `reviews` table.

## 9. Google Maps

The map uses Google's keyless embed with the hotel's coordinates, so no API key is needed. If you prefer the official embed, open the hotel on Google Maps, choose Share, then Embed a map, and replace the iframe `src` in `index.html` and `contact.html`. "Get directions" and "Open in Google Maps" use the coordinates; replace them with the hotel's Google Maps share link when you have it (`DIRS` and `MAPS` at the top of `main.js`).

## 10. Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/20261126000000_hotel_schema.sql` in the SQL editor.
3. Create an administrator in Supabase Auth.
4. Insert that user's UUID into `public.admin_users`:

```sql
insert into public.admin_users (user_id, role)
values ('ADMIN_AUTH_USER_UUID', 'manager');
```

5. Put the project URL and public anon key in `js/supabase-config.js`:

```javascript
window.TETEMAN_SUPABASE = {
  url: "https://your-project.supabase.co",
  anonKey: "your-public-anon-key"
};
```

Never add the Supabase service-role key to this file or any public website file.

Open `/admin.html`. The public booking form is WhatsApp-first and does not claim that a request is confirmed. Database storage is intentionally not added as an anonymous public insert: it would require a secure server-side booking endpoint and client-side price validation.

## 11. Deploy

Upload the whole folder to any web host (cPanel public_html, Netlify, Vercel static, GitHub Pages, Cloudflare Pages). `index.html` must be at the site root. After going live, change each `og:image` to a full URL (for example `https://yourdomain.com/images/hotel/hero.jpg`) so link previews work.

## Notes

- Enquiries open WhatsApp with the details filled in. Nothing is confirmed automatically.
- No email, Instagram, Facebook or website has been supplied, so none are shown.
