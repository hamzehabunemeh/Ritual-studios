# Ritual Studios — website

A fast, static, multi-page website for **Ritual Studios**, a women-only fitness studio in Shmeisani, Amman.
Plain HTML, CSS and JavaScript — no build step, no framework. It can be hosted anywhere (Netlify, Vercel, GitHub Pages, any web host).

## Pages
| File | Page |
|---|---|
| `index.html` | Home — hero, studio video, The Ritual (In · Train · Stretch · Refuel · Out), services, this week, spaces, Google reviews, visit |
| `classes.html` | Interactive weekly schedule with coach filter, Train with Layali, first-class guide, FAQ |
| `personal-training.html` | Personal training |
| `pre-post-natal.html` | Pre & post natal training |
| `about.html` | Story, coaches, values |
| `book.html` | Booking form that emails each request |

## Editing — everything is in one file
Open **`assets/js/config.js`**:

- **Connect the booking form to email:** create a free access key at <https://web3forms.com> using the inbox that should receive bookings, then paste it into `web3formsKey`. Until a key is added the form shows a message pointing visitors to Instagram.
- **Google rating:** set `googleRating` (e.g. `4.9`) and `googleReviewCount` (e.g. `87`). Leave `null` to show only the "Read our reviews" button.
- **Timetable:** edit `RITUAL_SCHEDULE`. The schedule page, the home page "This week" and "Up next", the coach cards and the booking form's class list all update automatically.
- Instagram and Google Maps links are also set here.

## Assets
- `assets/brand/` — logo (wordmark + R mark) as transparent SVG, favicon
- `assets/img/` — photos (WebP, full + small sizes)
- `assets/video/inside-the-studio.mp4` — home page video (autoplays muted when scrolled into view, with a single "Tap for sound" button)
- `assets/fonts/` — Jost and Cormorant Garamond, self-hosted (SIL Open Font License)

## Preview locally
```
python3 -m http.server 8000
```
then open <http://localhost:8000>.
