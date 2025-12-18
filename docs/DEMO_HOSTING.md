# Demo Hosting Guide

To share this MVP with your Upwork client, you have several quick and professional options.

## Option 1: Vercel (Recommended for UI/UX Demo)
Vercel is excellent for showing off the design and interactions. It's free and provides a professional `vercel.app` URL.

### How to deploy:
1. Create a free account at [vercel.com](https://vercel.com).
2. Install the Vercel CLI or connect your GitHub repository.
3. **Important**: When prompted for the "Output Directory" or "Root Directory", ensure you point it to the `public` folder.
4. **Note on PHP**: Vercel does not support PHP by default. However, because I implemented **Demo Mode** in the contact form, the form will still "work" (show a success message) on Vercel, which is perfect for a client presentation.

---

## Option 2: GitHub Pages (Free & Simple)
If you already use GitHub, this is a great way to host the static frontend.

### How to deploy:
1. Push your code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Select the branch and the `/docs` folder (or move the contents of `public` to the root of a `gh-pages` branch).
4. Your site will be live at `username.github.io/repo-name`.

---

## Option 3: Namecheap Subdomain (Best for Full Test)
Since the final destination is Namecheap, creating a subdomain is the most "realistic" demo.

### How to deploy:
1. Log in to your Namecheap cPanel.
2. Go to **Subdomains** and create something like `demo.yourdomain.com`.
3. Upload the contents of the `public` folder to the new subdomain's folder.
4. Upload the `config` and `server` folders as instructed in `DEPLOY_NAMECHEAP.md`.
5. **Benefit**: This is the only option where the **real PHP email sending** will work for the demo.

---

## Summary for Upwork Client
When sharing the link, you can tell them:
> "I've hosted a live preview of the MVP here: [Link]. The design is mobile-responsive and the content is fully editable via a single configuration file. The contact form is currently in 'Demo Mode' for this preview."
