# ShopEase — React Frontend

A standalone e-commerce storefront built with React, JavaScript, Vite, and CSS.
It uses local sample product data and browser `localStorage`; it does not require a backend.

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Create the production build

```bash
npm run build
```

Vite creates the production-ready static website in the `dist/` directory.

To test the production build locally:

```bash
npm run preview
```

## AWS S3 + CloudFront practice

1. Run `npm run build`.
2. Upload the **contents of `dist/`** to your S3 bucket (not the entire project folder).
3. Configure the S3 bucket as a private origin and use CloudFront Origin Access Control (OAC).
4. Set the CloudFront default root object to `index.html`.
5. Create a CloudFront invalidation for `/*` after publishing updates.
6. Open the CloudFront distribution domain to test the site.

For a single-page app, configure CloudFront custom error responses for 403 and 404 to return `/index.html` with HTTP 200 if you later add client-side routes. This starter uses simple in-page view switching, so it does not require route rewrites.

## Project structure

```text
shopease-react-frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── data/
    │   └── products.js
    └── styles.css
```

## Practice tasks

- Inspect the unfamiliar repository and identify the build command.
- Find which directory contains the production build.
- Change the site title and a product, then rebuild.
- Deploy to S3 and serve through CloudFront.
- Upload a second version and invalidate the CloudFront cache.
- Test the website in a private/incognito browser window.

## Notes

- This is a frontend-only practice project.
- Cart data is stored in the browser's local storage.
- Product images are loaded from remote Unsplash image URLs, so images require internet access.
