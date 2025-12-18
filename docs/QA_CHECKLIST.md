# QA Checklist

Use this checklist before launching your website. Check off each item as you verify it.

---

## Pre-Launch Checklist

### Content Updates
- [ ] Business name updated in `content.json`
- [ ] NP name and credentials updated
- [ ] Contact email and phone updated
- [ ] States served updated
- [ ] All placeholder text `[...]` has been replaced
- [ ] Services list reflects actual offerings
- [ ] FAQ answers are accurate
- [ ] Privacy policy reviewed

### Contact Form
- [ ] SMTP settings configured in `config/config.php`
- [ ] Form submits successfully
- [ ] Email received at configured address
- [ ] Success message displays after submission
- [ ] Error message displays on failed submission
- [ ] Required field validation works
- [ ] Invalid email format shows error
- [ ] Consent checkbox is required
- [ ] Honeypot spam protection is working (test by filling hidden field)

### Mobile Responsiveness
- [ ] Homepage loads correctly on mobile
- [ ] Mobile menu opens and closes
- [ ] All navigation links work on mobile
- [ ] Text is readable without zooming
- [ ] Buttons are large enough to tap
- [ ] Forms are usable on mobile
- [ ] No horizontal scrolling
- [ ] Images are not cut off

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iPhone)
- [ ] Chrome Mobile (Android)

### Accessibility
- [ ] Skip link works (Tab key from top of page)
- [ ] All pages are keyboard navigable
- [ ] Focus states are visible
- [ ] Form labels are properly associated
- [ ] Images have alt text (if any)
- [ ] Color contrast is sufficient
- [ ] Headings are in logical order (H1 → H2 → H3)

### Performance
- [ ] Pages load within 3 seconds
- [ ] No console errors in browser DevTools
- [ ] Lighthouse Performance score > 80
- [ ] Lighthouse Accessibility score > 90
- [ ] All CSS/JS files load correctly
- [ ] Content.json loads without errors

### SEO
- [ ] Each page has unique `<title>`
- [ ] Each page has meta description
- [ ] `robots.txt` has correct domain
- [ ] `sitemap.xml` has correct URLs
- [ ] Schema.org JSON-LD updated with business info
- [ ] OpenGraph tags have correct information

### Security
- [ ] SSL certificate installed and working
- [ ] Site redirects HTTP to HTTPS
- [ ] `config/` directory is not publicly accessible
- [ ] Config file path is correct in PHP
- [ ] Rate limiting is active on contact form

### Links & Navigation
- [ ] Header logo links to homepage
- [ ] All navigation links work
- [ ] All CTA buttons link to correct pages
- [ ] Footer links work
- [ ] Privacy policy link in footer works
- [ ] External links open in new tab (if any)

### Visual Quality
- [ ] No broken images
- [ ] Consistent spacing throughout
- [ ] Fonts loading correctly (Inter)
- [ ] Colors match design system
- [ ] Cards and buttons have proper shadows
- [ ] Animations trigger on scroll

---

## Testing the Contact Form

### Successful Submission Test
1. Go to `/contact.html`
2. Fill in all required fields:
   - Full Name: Test User
   - Organization: Test Agency
   - Role: Director
   - Email: test@example.com
   - Message: This is a test submission
3. Check the consent checkbox
4. Click Submit
5. **Expected**: Success message appears, email arrives

### Validation Test
1. Try submitting with each field empty
2. **Expected**: Error message for each required field

### Spam Protection Test
1. Open browser DevTools → Elements
2. Find the hidden `website` field
3. Fill it with any value
4. Submit the form
5. **Expected**: Form appears to succeed but no email is sent

---

## Performance Testing with Lighthouse

1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Click "Analyze page load"
5. Review scores and fix any issues

### Target Scores
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

---

## Final Review

- [ ] Client/owner has reviewed content
- [ ] Backup of all files created
- [ ] Domain DNS configured correctly
- [ ] SSL certificate active
- [ ] Contact form email tested with real recipient
- [ ] Analytics installed (if applicable)
- [ ] All documentation reviewed with client

---

## Post-Launch Monitoring

After going live:
- [ ] Test contact form again from production URL
- [ ] Verify SSL certificate shows as valid
- [ ] Check Google Search Console for indexing (after 24-48 hours)
- [ ] Monitor email for form submissions
- [ ] Check cPanel error logs for any PHP errors

---

*Last updated: December 2024*
