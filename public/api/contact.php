<?php
header("Content-Type: application/json");

// Configuration
$target_email = "bodlizstudio@gmail.com";
$subject = "L BODI - New Ecosystem Inquiry";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect and sanitize input
    $company = filter_var($_POST['field_0'] ?? 'Unknown', FILTER_SANITIZE_STRING);
    $budget  = filter_var($_POST['field_1'] ?? 'Not specified', FILTER_SANITIZE_STRING);
    $vision  = filter_var($_POST['field_2'] ?? 'Not provided', FILTER_SANITIZE_STRING);
    $contact = filter_var($_POST['field_3'] ?? 'Not provided', FILTER_SANITIZE_STRING);

    // HTML Email Template
    $htmlContent = "
    <html>
    <body style='background-color: #050505; color: #ffffff; font-family: sans-serif; padding: 40px;'>
        <div style='max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a1a; padding: 40px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);'>
            <h1 style='color: #39FF14; font-size: 24px; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 10px;'>New Ecosystem Inquiry</h1>
            
            <div style='margin-bottom: 25px;'>
                <p style='color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;'>Company</p>
                <p style='font-size: 18px; margin: 0;'>$company</p>
            </div>

            <div style='margin-bottom: 25px;'>
                <p style='color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;'>Intended Investment</p>
                <p style='font-size: 18px; margin: 0; color: #39FF14;'>$budget</p>
            </div>

            <div style='margin-bottom: 25px;'>
                <p style='color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;'>Project Vision</p>
                <p style='font-size: 16px; line-height: 1.6; margin: 0; color: #ccc;'>$vision</p>
            </div>

            <div style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;'>
                <p style='color: #666; text-transform: uppercase; font-size: 10px; letter-spacing: 2px; margin-bottom: 5px;'>Contact Transmission</p>
                <p style='font-size: 16px; margin: 0;'>$contact</p>
            </div>
            
            <p style='margin-top: 50px; color: #444; font-size: 10px; text-align: center; letter-spacing: 1px;'>TRANSMITTED VIA L BODI BIO-DIGITAL ENGINE</p>
        </div>
    </body>
    </html>";

    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: noreply@l-bodi.com" . "\r\n";
    $headers .= "Reply-To: " . (filter_var($contact, FILTER_VALIDATE_EMAIL) ? $contact : $target_email) . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // Send email
    if (mail($target_email, $subject, $htmlContent, $headers)) {
        echo json_encode(["status" => "success", "message" => "Evolution request transmitted."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Transmission failed."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method not allowed."]);
}
?>
