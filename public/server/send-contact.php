<?php
/**
 * Contact Form Handler
 * Receives form submissions and sends email via SMTP
 * 
 * Security features:
 * - Honeypot spam trap
 * - Rate limiting by IP
 * - Input sanitization
 * - Header injection prevention
 * - Length limits
 */

// Prevent direct access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Set JSON response headers
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Load configuration
$configPath = __DIR__ . '/../config/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$config = require $configPath;

// ===== SECURITY CHECKS =====

// Check honeypot (bot trap)
if (!empty($_POST['website'])) {
    // Bots fill in hidden fields - silently accept but don't send email
    echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    exit;
}

// Rate limiting by IP
$rateLimitFile = sys_get_temp_dir() . '/contact_rate_' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$rateLimit = $config['rate_limit'] ?? 5;
$ratePeriod = 3600; // 1 hour

if (file_exists($rateLimitFile)) {
    $rateData = json_decode(file_get_contents($rateLimitFile), true);
    $now = time();
    
    // Clean old entries
    $rateData = array_filter($rateData, function($timestamp) use ($now, $ratePeriod) {
        return ($now - $timestamp) < $ratePeriod;
    });
    
    if (count($rateData) >= $rateLimit) {
        http_response_code(429);
        echo json_encode(['success' => false, 'message' => 'Too many requests. Please try again later.']);
        exit;
    }
    
    $rateData[] = $now;
} else {
    $rateData = [time()];
}

file_put_contents($rateLimitFile, json_encode($rateData));

// ===== INPUT VALIDATION =====

// Required fields
$requiredFields = ['name', 'organization', 'role', 'email', 'message', 'consent'];

foreach ($requiredFields as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Check consent checkbox
if ($_POST['consent'] !== 'on' && $_POST['consent'] !== '1' && $_POST['consent'] !== 'true') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'You must acknowledge the B2B-only policy']);
    exit;
}

// Sanitize inputs
function sanitizeInput($input, $maxLength = 1000) {
    $input = trim($input);
    $input = strip_tags($input);
    $input = substr($input, 0, $maxLength);
    // Remove any potential header injection attempts
    $input = preg_replace('/[\r\n]+/', ' ', $input);
    return $input;
}

$name = sanitizeInput($_POST['name'] ?? '', 100);
$organization = sanitizeInput($_POST['organization'] ?? '', 200);
$role = sanitizeInput($_POST['role'] ?? '', 100);
$email = sanitizeInput($_POST['email'] ?? '', 254);
$phone = sanitizeInput($_POST['phone'] ?? '', 20);
$message = sanitizeInput($_POST['message'] ?? '', 2000);

// Validate name length
if (strlen($name) < 2) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Name is too short']);
    exit;
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Validate message length
if (strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Message is too short']);
    exit;
}

// ===== SEND EMAIL =====

// Build email content
$subject = "New Consultation Request from $name - $organization";

$emailBody = <<<EMAIL
New Contact Form Submission
============================

Name: $name
Organization: $organization
Role/Title: $role
Email: $email
Phone: $phone

Message:
---------
$message

---
Submitted: {$_SERVER['REQUEST_TIME']} (Unix timestamp)
IP: {$_SERVER['REMOTE_ADDR']}
User Agent: {$_SERVER['HTTP_USER_AGENT']}
EMAIL;

// Use PHPMailer if available, otherwise fall back to PHP mail()
$phpMailerPath = __DIR__ . '/vendor/PHPMailer/src/PHPMailer.php';

if (file_exists($phpMailerPath)) {
    // PHPMailer method
    require $phpMailerPath;
    require __DIR__ . '/vendor/PHPMailer/src/SMTP.php';
    require __DIR__ . '/vendor/PHPMailer/src/Exception.php';
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = $config['smtp_host'];
        $mail->SMTPAuth = true;
        $mail->Username = $config['smtp_user'];
        $mail->Password = $config['smtp_pass'];
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $config['smtp_port'];
        
        // Recipients
        $mail->setFrom($config['smtp_from'], 'Website Contact Form');
        $mail->addAddress($config['smtp_to']);
        $mail->addReplyTo($email, $name);
        
        // Content
        $mail->isHTML(false);
        $mail->Subject = $subject;
        $mail->Body = $emailBody;
        
        $mail->send();
        
        // Log successful submission (no sensitive data)
        $logEntry = date('Y-m-d H:i:s') . " | SUCCESS | From: $organization\n";
        file_put_contents(__DIR__ . '/contact.log', $logEntry, FILE_APPEND | LOCK_EX);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        
    } catch (Exception $e) {
        error_log("Contact form error: " . $mail->ErrorInfo);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again.']);
    }
    
} else {
    // Fallback: Use PHP's native mail() function
    $headers = [
        'From' => $config['smtp_from'],
        'Reply-To' => $email,
        'X-Mailer' => 'PHP/' . phpversion(),
        'Content-Type' => 'text/plain; charset=UTF-8'
    ];
    
    $success = mail($config['smtp_to'], $subject, $emailBody, $headers);
    
    if ($success) {
        // Log successful submission (no sensitive data)
        $logEntry = date('Y-m-d H:i:s') . " | SUCCESS | From: $organization\n";
        file_put_contents(__DIR__ . '/contact.log', $logEntry, FILE_APPEND | LOCK_EX);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } else {
        error_log("Contact form mail() failed");
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again.']);
    }
}
