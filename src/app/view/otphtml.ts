export const optgenerateHtmlSendForUser = (otp: string) => {
  return `
        <html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Arvion Mart - Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI',
        Roboto, Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      border-radius: 8px;
      background: #faf5fd;
    }
    .header {
      padding: 30px 40px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .logo-img {
      width: 180px;
      height: auto;
    }
    .date {
      color: #858b96;
      font-size: 14px;
      font-weight: 700;
    }
    .content {
      padding: 40px;
    }
    .title {
      font-size: 32px;
      font-weight: 700;
      color: #1e3a8a;
      text-align: center;
      margin-bottom: 40px;
    }
    .greeting {
      font-size: 16px;
      color: #374151;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #374151;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .code-container {
      text-align: center;
      margin: 40px 0;
    }
    .code {
      font-size: 30px;
      font-weight: 800;
      color: #1e3a8a;
      font-family: 'Montserrat', sans-serif;
      letter-spacing: 8px;
      margin-bottom: 15px;
    }
    .code-note {
      font-size: 14px;
      color: #6b7280;
    }
    .warning {
      font-size: 14px;
      color: #374151;
      margin: 30px 0;
      line-height: 1.5;
    }
    .footer-message {
      font-size: 16px;
      color: #374151;
      margin-bottom: 40px;
    }
    .signature {
      font-size: 16px;
      color: #374151;
    }
    .footer {
      border-top: 0.5px dashed #858b96;
      padding: 25px 40px;
      text-align: center;
    }
    .footer-logo {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .footer-text {
      font-size: 14px;
      margin-bottom: 15px;
    }
    .footer-links {
      margin-top: 15px;
    }
    .footer-links a {
      text-decoration: none;
      margin: 0 10px;
      font-size: 14px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media (max-width: 640px) {
      body {
        padding: 10px;
      }
      .content,
      .header,
      .footer {
        padding-left: 20px;
        padding-right: 20px;
      }
      .title {
        font-size: 28px;
      }
      .code {
        font-size: 36px;
        letter-spacing: 4px;
      }
      .logo-img {
        width: 140px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo-section">
        <img
          src="https://res.cloudinary.com/dq95fwkeq/image/upload/v1755460733/Logo_Animated_h2lzin.gif"
          alt="Arvion Mart Logo"
          class="logo-img"
        />
      </div>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <h1 class="title">Your One-Time Password</h1>
      <div class="greeting">Dear <strong>Customer</strong>,</div>
      <div class="message">
        Here is your One-Time Password to securely log in to your Arvion Mart
        account:
      </div>
      <div class="code-container">
        <div class="code">${otp}</div>
        <div class="code-note">Note: This OTP is valid for 5 minutes.</div>
      </div>
      <div class="warning">
        If you did not request this OTP, please disregard this email or
        contact our support team.
      </div>
      <div class="footer-message">
        Thank you for shopping with Arvion Mart!
      </div>
      <div class="signature">Team Arvion Mart</div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">Arvion Mart</div>
      <div class="footer-text">Your trusted online shopping destination</div>
      <div class="footer-links">
        <a href="#">Support</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
      </div>
    </div>
  </div>
</body>
</html>

    `
}
