# Easy Helper 👵👴

A simple, senior-friendly app with **large, high-contrast buttons** for the
four things people use most:

| Button | What it does |
|--------|--------------|
| 📞 **Call** | Phone calls a saved contact (e.g. a family member) |
| 🌐 **Translate** | Opens Google Translate |
| 💬 **Text Help** | Sends a pre-written text message to an admin / caregiver |
| 🧭 **Directions** | Opens Maps with directions to a saved home address |

It is a small, dependency-free **Progressive Web App** — just HTML, CSS, and
plain JavaScript. It works on any modern phone, tablet, or computer, can be
"installed" to the home screen, and works offline.

## Design goals

- **Big touch targets** — each button fills roughly a quarter of the screen.
- **High contrast** and large, bold text for easy reading.
- **No accounts, no logins, no clutter** — one screen, four choices.
- **Native actions** — buttons use the device's built-in phone, messaging,
  and maps apps, so they behave the way users already expect.

## Setup (for a family member or caregiver)

1. Open the app and tap **Settings** at the bottom.
2. Fill in:
   - The **name and phone number** of the person to call.
   - The **admin's text number** and a default message.
   - The **home address** for directions.
3. Tap **Save**. The details are stored privately on the device.

## Running it

No build step. Serve the folder with any static web server:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open `http://localhost:8000` on your phone or browser. To install it to a
phone home screen, use the browser's **"Add to Home Screen"** option.

## Files

- `index.html` — the single screen and settings dialog
- `styles.css` — large-icon, high-contrast styling
- `app.js` — button actions and settings storage
- `manifest.webmanifest`, `sw.js`, `icon.svg` — installable / offline support
