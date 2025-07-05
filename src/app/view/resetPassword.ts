export const resetHtmlBody = (userName: string, resetLink: string) => {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password | [Company Name]</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
        }
        .header {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            padding: 30px;
            text-align: center;
            color: white;
        }
        .logo {
            height: 32px;
            margin-bottom: 15px;
        }
        h1 {
            font-size: 22px;
            font-weight: 600;
            margin: 0;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 32px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 24px;
        }
        .message {
            margin-bottom: 24px;
            font-size: 15px;
            color: #4b5563;
        }
        .button-container {
            text-align: center;
            margin: 32px 0;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 500;
            font-size: 15px;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
            transition: all 0.3s ease;
        }
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
        }
        .link-fallback {
            background: #f9fafb;
            border-radius: 6px;
            padding: 12px;
            font-size: 14px;
            word-break: break-all;
            margin: 20px 0;
            color: #4b5563;
        }
        .security-note {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 12px 16px;
            font-size: 14px;
            margin: 28px 0;
            border-radius: 0 6px 6px 0;
        }
        .footer {
            padding: 24px;
            text-align: center;
            font-size: 13px;
            color: #9ca3af;
            border-top: 1px solid #e5e7eb;
        }
        .footer-links {
            margin-top: 12px;
        }
        .footer-links a {
            color: #6b7280;
            text-decoration: none;
            margin: 0 8px;
        }
        .footer-links a:hover {
            color: #4f46e5;
        }
        .signature {
            margin-top: 24px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Prime Shoes</h1>
            <h1>Reset Your Password</h1>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${userName},</div>
            
            <div class="message">
                We received a request to reset your password for your Prime Shoes account. 
                If you didn't make this request, you can safely ignore this email.
            </div>
            
            <div class="button-container">
                <a href=${resetLink} class="reset-button">Reset Password</a>
            </div>
            
            <div class="message">
                If the button above doesn't work, copy and paste this link into your browser:
            </div>
            
            <div class="link-fallback">${resetLink}</div>
            
            <div class="security-note">
                <strong>Security notice:</strong> This password reset link will expire in 24 hours 
                and can only be used once. For your security, never share this link with anyone.
            </div>
            
            <div class="message">
                Need help? Contact our support team at <a href="mailto:arviontech@gmail.com">arviontech@gmail.com</a> 
                or visit our <a href="https://arviontech.online">Help Center</a>.
            </div>
            
            <div class="signature">
                Best regards,<br>
                The Prime Shoes Team
            </div>
        </div>
        
        <div class="footer">
            <div>© ${new Date().getFullYear()} [Prime Shoes]. All rights reserved.</div>
            <div class="footer-links">
                <a href="[Privacy Policy URL]">Privacy Policy</a>
                <a href="[Terms of Service URL]">Terms of Service</a>
                <a href="[Unsubscribe URL]">Unsubscribe</a>
            </div>
            <div style="margin-top: 12px;">
                [Company Address]<br>
                123 Business Rd, City, State 10001
            </div>
        </div>
    </div>
</body>
</html>
    `
}
