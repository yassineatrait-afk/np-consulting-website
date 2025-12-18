# Deploying to Namecheap Hosting

This guide walks you through deploying your NP Consulting website to Namecheap shared hosting.

---

## Prerequisites

- Namecheap hosting account (Stellar or similar shared hosting)
- Domain connected to your hosting
- FTP client (FileZilla, Cyberduck) OR use cPanel File Manager

---

## Step 1: Access Your Hosting

### Option A: cPanel File Manager
1. Log in to Namecheap
2. Go to **Dashboard** → **Manage** next to your hosting
3. Click **cPanel** → **File Manager**

### Option B: FTP
1. In cPanel, find **FTP Accounts** to get your credentials
2. Connect with FileZilla using:
   - Host: `ftp.yourdomain.com`
   - Username: your cPanel username
   - Password: your cPanel password
   - Port: 21

---

## Step 2: Upload Files

### Public Files (Website)
1. Navigate to the `public_html` folder (this is your web root)
2. Upload the **contents** of the `/public` folder:
   ```
   public_html/
   ├── index.html
   ├── services.html
   ├── contact.html
   ├── about.html
   ├── privacy.html
   ├── robots.txt
   ├── sitemap.xml
   ├── assets/
   │   ├── css/
   │   ├── js/
   │   └── img/
   ├── content/
   │   └── content.json
   └── server/
       └── send-contact.php
   ```

### Config Files (Secure)
1. Go **one level up** from `public_html` (to your home directory)
2. Create a folder called `config`
3. Upload:
   - `config/config.php`
   - `config/.htaccess`

### Update PHP Path
Open `public_html/server/send-contact.php` in the file manager and update line 25:
```php
// Change this:
$configPath = __DIR__ . '/../config/config.php';

// To this (adjust path based on your setup):
$configPath = '/home/YOUR_USERNAME/config/config.php';
```

Replace `YOUR_USERNAME` with your actual cPanel username.

---

## Step 3: Configure SMTP Email

1. In cPanel, go to **Email Accounts**
2. Create an email account (e.g., `contact@yourdomain.com`)
3. Note the password you set

Now update `/config/config.php`:
```php
return [
    'smtp_host' => 'mail.yourdomain.com',
    'smtp_port' => 465,
    'smtp_user' => 'contact@yourdomain.com',
    'smtp_pass' => 'YOUR_EMAIL_PASSWORD',
    'smtp_from' => 'contact@yourdomain.com',
    'smtp_to' => 'your-personal-email@example.com',  // Where you receive messages
    'rate_limit' => 5,
];
```

### Finding SMTP Settings in Namecheap
- **Host**: `mail.yourdomain.com` or check cPanel → Email → Email Routing
- **Port**: 465 (SSL) or 587 (TLS)
- **Username**: Your full email address
- **Password**: The password you set when creating the email

---

## Step 4: Install PHPMailer (Recommended)

For reliable email delivery, install PHPMailer:

1. Download PHPMailer: https://github.com/PHPMailer/PHPMailer/releases
2. Extract and upload to: `public_html/server/vendor/PHPMailer/`
3. Your structure should be:
   ```
   server/
   ├── send-contact.php
   └── vendor/
       └── PHPMailer/
           └── src/
               ├── PHPMailer.php
               ├── SMTP.php
               └── Exception.php
   ```

If you don't install PHPMailer, the form will fall back to PHP's `mail()` function.

---

## Step 5: Enable SSL Certificate

1. In cPanel, go to **SSL/TLS Status** or **AutoSSL**
2. Click **Run AutoSSL** if available
3. Wait for the certificate to be issued (usually 5-10 minutes)
4. Test by visiting `https://yourdomain.com`

### Force HTTPS (Recommended)
Add this to `public_html/.htaccess`:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## Step 6: Update Content for Your Business

1. Edit `public_html/content/content.json`
2. Replace all placeholders:
   - `[Business Name]` → Your actual business name
   - `[NP Name]` → Your name
   - `[Credentials]` → Your credentials (e.g., MSN, APRN, FNP-BC)
   - `[Email]` → Your contact email
   - `[Phone]` → Your phone number
   - `[States Served]` → Your service area
3. Save the file

---

## Step 7: Update SEO Files

### robots.txt
Edit `public_html/robots.txt` and update the sitemap URL:
```
Sitemap: https://yourdomain.com/sitemap.xml
```

### sitemap.xml
Edit `public_html/sitemap.xml` and replace all `yourdomain.com` with your actual domain.

### Schema.org
Edit `public_html/index.html` and update the JSON-LD script with your business details.

---

## Step 8: Test Everything

### Contact Form Test
1. Go to `https://yourdomain.com/contact.html`
2. Fill out the form with test data
3. Submit and verify:
   - Success message appears
   - Email arrives at your configured address

### Mobile Test
1. Open your site on a mobile device
2. Check that navigation works
3. Verify text is readable without zooming

### Link Check
- Click all navigation links
- Test all CTA buttons
- Verify footer links work

---

## Troubleshooting

### "Contact form not sending emails"
1. Check SMTP settings in `config.php`
2. Verify email account exists and password is correct
3. Check cPanel → Error Log for PHP errors
4. Try port 587 instead of 465

### "Website shows 500 error"
1. Check file permissions:
   - Folders: 755
   - Files: 644
2. Check cPanel → Error Log

### "CSS/JS not loading"
1. Verify all files were uploaded
2. Check browser console for 404 errors
3. Ensure paths are correct (relative paths like `assets/css/`)

### "Content not updating"
1. Clear browser cache (Ctrl+Shift+R)
2. Verify `content.json` was saved correctly
3. Check for JSON syntax errors

---

## File Permissions Reference

```
public_html/          → 755
├── *.html           → 644
├── assets/          → 755
├── content/         → 755
│   └── content.json → 644
└── server/          → 755
    └── send-contact.php → 644
```

---

## Support

If you encounter issues:
1. Check Namecheap knowledge base: https://www.namecheap.com/support/
2. Contact Namecheap support via live chat
3. Review the QA_CHECKLIST.md for additional testing steps

---

*Last updated: December 2024*
