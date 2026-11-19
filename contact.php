<?php
// Sends contact form enquiries to the address below.
$to = 'info@bemarketing.uk.net';
$from = 'website@bemarketing.uk.net';

header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo '{"ok":false}'; exit; }
if (!empty($_POST['_gotcha'])) { echo '{"ok":true}'; exit; } // spam bot

$clean = fn($v) => trim(str_replace(["\r", "\n"], ' ', (string)($v ?? '')));
$name = $clean($_POST['name'] ?? '');
$email = $clean($_POST['email'] ?? '');
$phone = $clean($_POST['phone'] ?? '');
$service = $clean($_POST['service'] ?? '');
$message = trim((string)($_POST['message'] ?? ''));

if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($_POST['consent'])) {
  http_response_code(422); echo '{"ok":false}'; exit;
}

$body = "New enquiry from the website\n\nName: $name\nEmail: $email\nPhone: $phone\nNeeds: $service\n\nMessage:\n$message\n";
$headers = "From: B&E Marketing website <$from>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";
$ok = mail($to, "Website enquiry from $name", $body, $headers);
http_response_code($ok ? 200 : 500);
echo json_encode(['ok' => $ok]);
