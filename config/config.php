<?php
/**
 * Configuration File for NP Consulting Website
 * 
 * INSTRUCTIONS:
 * 1. Update the SMTP settings below with your email provider details
 * 2. For Namecheap hosting, your SMTP settings are typically:
 *    - Host: mail.yourdomain.com
 *    - Port: 465 (SSL) or 587 (TLS)
 *    - Username: your full email address
 *    - Password: your email password
 * 
 * IMPORTANT: Keep this file secure. It should not be publicly accessible.
 */

return [
    // ===== EMAIL SETTINGS =====

    // SMTP Server (e.g., mail.yourdomain.com)
    'smtp_host' => 'mail.yourdomain.com',

    // SMTP Port (usually 465 for SSL or 587 for TLS)
    'smtp_port' => 465,

    // SMTP Username (usually your full email address)
    'smtp_user' => 'contact@yourdomain.com',

    // SMTP Password
    'smtp_pass' => 'YOUR_EMAIL_PASSWORD_HERE',

    // From Email Address (must match your SMTP account)
    'smtp_from' => 'contact@yourdomain.com',

    // Recipient Email (where contact form submissions are sent)
    'smtp_to' => 'owner@yourdomain.com',

    // ===== SECURITY SETTINGS =====

    // Max contact form submissions per IP per hour
    'rate_limit' => 5,
];
