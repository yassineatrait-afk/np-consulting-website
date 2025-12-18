# How to Edit Your Website Content

This guide explains how to update the text on your website. **No coding knowledge required!**

---

## Quick Start

1. Open the file `/public/content/content.json` in any text editor (Notepad, TextEdit, VS Code, etc.)
2. Change any text inside the quotes `" "`
3. Save the file
4. Refresh your website to see changes

**That's it!** All your website text lives in this one file.

---

## Understanding the File Structure

The `content.json` file is organized by section. Here's what each part controls:

### Business Information
```json
"business": {
  "name": "Your Business Name",        // Appears in header, footer, everywhere
  "tagline": "Your Business Tagline",  // Short description
  "npName": "Jane Doe",                // Your name
  "credentials": "MSN, APRN, FNP-BC",  // Your credentials
  "email": "contact@yourdomain.com",   // Contact email (shown on site)
  "phone": "(555) 123-4567",           // Phone number
  "statesServed": "New York, New Jersey" // States you serve
}
```

### Homepage Hero Section
```json
"hero": {
  "headline": "Your Main Headline",      // Big text at top of homepage
  "subheadline": "Supporting text...",   // Smaller text below headline
  "ctaPrimary": "Request a Consultation", // Main button text
  "ctaSecondary": "View Services"         // Second button text
}
```

### Services
```json
"services": {
  "items": [
    {
      "icon": "clipboard-check",          // Icon name (don't change unless needed)
      "title": "Clinical Workflow Support", // Service title
      "description": "Description here..." // Service description
    }
    // Add more services by copying this pattern
  ]
}
```

### Engagement Packages
```json
"packages": {
  "items": [
    {
      "name": "Advisory",                  // Package name
      "description": "Package description",
      "whoFor": "Who this is for",
      "includes": [                        // List of what's included
        "Item 1",
        "Item 2"
      ],
      "timeline": "2-4 weeks",
      "featured": false                    // Set to true for "Most Popular" badge
    }
  ]
}
```

### FAQ Section
```json
"faqs": {
  "items": [
    {
      "question": "Is this patient-facing?",
      "answer": "No. We work exclusively with agencies..."
    }
  ]
}
```

### Meta Tags (SEO)
```json
"meta": {
  "home": {
    "title": "Page Title - shown in browser tab",
    "description": "Description for search engines"
  }
}
```

---

## Common Edits

### Change Your Business Name
Find this in the file:
```json
"name": "[Your Business Name]"
```
Replace `[Your Business Name]` with your actual business name.

### Change Contact Email
Find this:
```json
"email": "[contact@yourdomain.com]"
```
Replace with your email.

### Add a New Service
Find the `"services"` section and add a new item:
```json
{
  "icon": "clipboard-check",
  "title": "Your New Service",
  "description": "Description of what this service includes."
}
```

### Add a New FAQ
Find the `"faqs"` section and add:
```json
{
  "question": "Your new question?",
  "answer": "Your answer here."
}
```

---

## Important Rules

1. **Keep the quotes**: Always keep text inside `" "` quotes
2. **Keep the commas**: Each item needs a comma after it (except the last one)
3. **Don't change field names**: Only change the text values, not the labels like `"name":` or `"email":`
4. **Make a backup**: Before editing, copy the file somewhere safe

### Example of Correct Edit:
```json
// Before
"name": "[Business Name]"

// After  
"name": "Care Coordination Consulting"
```

---

## Changing the Contact Form Email Recipient

The email where contact form submissions are sent is set in a different file:

1. Open `/config/config.php`
2. Find this line:
   ```php
   'smtp_to' => 'owner@yourdomain.com'
   ```
3. Change `owner@yourdomain.com` to your email address
4. Save the file

---

## Troubleshooting

### "My changes aren't showing"
- Make sure you saved the file
- Hard refresh your browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
- Clear your browser cache

### "The website looks broken"
- You may have a syntax error in the JSON file
- Check for:
  - Missing quotes around text
  - Missing commas between items
  - Extra commas at the end of lists
- Restore your backup and try again carefully

### "I need help"
- Keep a copy of the original file to compare against
- Use an online JSON validator to check for errors: https://jsonlint.com/

---

## Visual Content Editor (Optional)

If you prefer a form-based editing experience:

1. Open `edit-content.html` in your browser (locally, not on the live site)
2. Fill in the form fields
3. Click "Download Updated Content"
4. Upload the new `content.json` to replace the old one

---

*Last updated: December 2024*
