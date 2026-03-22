const generateVerificationHTMLTemplate = (verificationLink) => {
  return `<!DOCTYPE html>
<html lang="en" style="color-scheme:light !important;">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Nexora — Verify your email</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  :root { color-scheme: light only; }
  * { color-scheme: light only !important; }
  @media (prefers-color-scheme: dark) {
    body, table, td, div, p, a, h1, span {
      background-color: inherit !important;
      color: inherit !important;
    }
  }
</style>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#f0f4ff !important;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  -webkit-text-size-adjust:100%;
  -ms-text-size-adjust:100%;
  color-scheme:light only;
">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  One click away from joining Nexora.
</div>

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4ff !important;min-height:100vh;">
<tr>
<td align="center" style="padding:48px 16px;">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="
      max-width:520px;
      background-color:#ffffff !important;
      border-radius:24px;
      border:2px solid #e0e7ff;
      overflow:hidden;
      box-shadow:0 8px 40px rgba(99,102,241,0.10);
    ">

    <!-- Rainbow top bar -->
    <tr>
      <td style="height:6px;background:linear-gradient(90deg,#f97316,#ec4899,#8b5cf6,#3b82f6,#06b6d4);"></td>
    </tr>

    <!-- Logo -->
    <tr>
      <td align="center" style="padding:36px 48px 0;background-color:#ffffff !important;">
        <div style="
          background-color:#ede9fe !important;
          border:2px solid #c4b5fd;
          border-radius:50px;
          padding:8px 24px;
          display:inline-block;
          font-weight:900;
          font-size:16px;
          letter-spacing:0.06em;
          color:#7c3aed !important;
        ">
          ✦ NEXORA
        </div>
      </td>
    </tr>

    <!-- Heading -->
    <tr>
      <td align="center" style="padding:28px 48px 0;background-color:#ffffff !important;">
        <h1 style="
          margin:0;
          font-size:28px;
          font-weight:900;
          letter-spacing:-0.03em;
          color:#1e1b4b !important;
          text-align:center;
        ">
          Verify your email
        </h1>
        <p style="
          margin:10px 0 0;
          font-size:15px;
          color:#6b7280 !important;
          line-height:1.7;
          text-align:center;
        ">
          You're one step away from starting your search journey on Nexora.
        </p>
      </td>
    </tr>

    <!-- CTA Button -->
    <tr>
      <td align="center" style="padding:32px 48px 0;background-color:#ffffff !important;">
        <a href="${verificationLink}"
          target="_blank"
          style="
            display:inline-block;
            background-color:#7c3aed !important;
            background:linear-gradient(135deg,#7c3aed,#4f46e5);
            color:#ffffff !important;
            font-size:15px;
            font-weight:800;
            text-decoration:none;
            padding:15px 44px;
            border-radius:50px;
            letter-spacing:0.02em;
            box-shadow:0 4px 20px rgba(124,58,237,0.35);
            text-align:center;
          "
        >
          Verify my email &rarr;
        </a>
      </td>
    </tr>

    <!-- Expiry -->
    <tr>
      <td align="center" style="padding:14px 48px 0;background-color:#ffffff !important;">
        <p style="margin:0;font-size:12px;color:#9ca3af !important;text-align:center;">
          Link expires in <span style="color:#7c3aed !important;font-weight:700;">24 hours</span>
        </p>
      </td>
    </tr>

    <!-- OR divider — fully centered -->
    <tr>
      <td align="center" style="padding:24px 48px 0;background-color:#ffffff !important;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="45%" style="height:1px;background-color:#e0e7ff !important;vertical-align:middle;"></td>
            <td width="10%" align="center" style="font-size:11px;color:#a5b4fc !important;font-weight:700;padding:0 8px;white-space:nowrap;text-align:center;">OR</td>
            <td width="45%" style="height:1px;background-color:#e0e7ff !important;vertical-align:middle;"></td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Fallback link -->
    <tr>
      <td align="center" style="padding:16px 48px 0;background-color:#ffffff !important;">
        <div style="background-color:#f5f3ff !important;border:1.5px dashed #c4b5fd;border-radius:12px;padding:14px 18px;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;color:#8b5cf6 !important;letter-spacing:0.06em;text-transform:uppercase;font-weight:700;text-align:center;">
            Button not working? Paste this in your browser
          </p>
          <p style="
            margin:0;
            font-size:11px;
            color:#4f46e5 !important;
            word-break:break-all;
            line-height:1.6;
            text-align:center;
          ">
            ${verificationLink}
          </p>
        </div>
      </td>
    </tr>

    <!-- Security note -->
    <tr>
      <td align="center" style="padding:16px 48px 0;background-color:#ffffff !important;">
        <div style="background-color:#fff7ed !important;border:1.5px solid #fed7aa;border-radius:12px;padding:12px 16px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#92400e !important;line-height:1.6;text-align:center;">
            <strong>Never share this link.</strong> Nexora will never ask for it via phone or chat.
          </p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding:24px 48px 36px;background-color:#ffffff !important;">
        <p style="margin:0 0 4px;font-size:12px;color:#9ca3af !important;text-align:center;">
          You received this because an account was created with this email.
        </p>
        <p style="margin:0;font-size:12px;color:#c4b5fd !important;text-align:center;">
          &copy; ${new Date().getFullYear()} Nexora &nbsp;&middot;&nbsp; Made with &hearts;
        </p>
      </td>
    </tr>

  </table>

</td>
</tr>
</table>

</body>
</html>`;
};

const generateVerificationTextTemplate = (verificationLink) => {
  return `
Nexora — Verify your email

You're one step away from starting your search journey on Nexora.

Verify here: ${verificationLink}

This link expires in 24 hours.
Never share this link with anyone.

If you didn't request this, you can safely ignore this email.

© ${new Date().getFullYear()} Nexora
`.trim();
};

// ── Sent after user successfully verifies ──

const generateVerifiedHTMLTemplate = (loginLink) => {
  return `<!DOCTYPE html>
<html lang="en" style="color-scheme:light !important;">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>Nexora — You're in!</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  :root { color-scheme: light only; }
  * { color-scheme: light only !important; }
  @media (prefers-color-scheme: dark) {
    body, table, td, div, p, a, h1, span {
      background-color: inherit !important;
      color: inherit !important;
    }
  }
</style>
</head>

<body style="
  margin:0;
  padding:0;
  background-color:#f0fdf4 !important;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  -webkit-text-size-adjust:100%;
  -ms-text-size-adjust:100%;
  color-scheme:light only;
">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
  You're verified! Welcome to Nexora.
</div>

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4 !important;min-height:100vh;">
<tr>
<td align="center" style="padding:48px 16px;">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="
      max-width:520px;
      background-color:#ffffff !important;
      border-radius:24px;
      border:2px solid #bbf7d0;
      overflow:hidden;
      box-shadow:0 8px 40px rgba(16,185,129,0.10);
    ">

    <!-- Rainbow top bar -->
    <tr>
      <td style="height:6px;background:linear-gradient(90deg,#34d399,#10b981,#f59e0b,#84cc16,#06b6d4);"></td>
    </tr>

    <!-- Logo -->
    <tr>
      <td align="center" style="padding:36px 48px 0;background-color:#ffffff !important;">
        <div style="
          background-color:#ede9fe !important;
          border:2px solid #c4b5fd;
          border-radius:50px;
          padding:8px 24px;
          display:inline-block;
          font-weight:900;
          font-size:16px;
          letter-spacing:0.06em;
          color:#7c3aed !important;
        ">
          ✦ NEXORA
        </div>
      </td>
    </tr>

    <!-- Success badge -->
    <tr>
      <td align="center" style="padding:28px 48px 0;background-color:#ffffff !important;">
        <div style="
          width:64px;
          height:64px;
          background-color:#dcfce7 !important;
          border:2px solid #86efac;
          border-radius:50%;
          font-size:28px;
          line-height:64px;
          text-align:center;
          display:inline-block;
          color:#16a34a !important;
          font-weight:900;
        ">&#10003;</div>
      </td>
    </tr>

    <!-- Heading -->
    <tr>
      <td align="center" style="padding:20px 48px 0;background-color:#ffffff !important;">
        <h1 style="
          margin:0;
          font-size:28px;
          font-weight:900;
          letter-spacing:-0.03em;
          color:#064e3b !important;
          text-align:center;
        ">
          Email verified!
        </h1>
        <p style="
          margin:10px 0 0;
          font-size:15px;
          color:#6b7280 !important;
          line-height:1.7;
          text-align:center;
        ">
          Your Nexora account is all set. Start searching smarter today.
        </p>
      </td>
    </tr>

    <!-- Login CTA -->
    <tr>
      <td align="center" style="padding:32px 48px 0;background-color:#ffffff !important;">
        <a href="${loginLink}"
          target="_blank"
          style="
            display:inline-block;
            background-color:#059669 !important;
            background:linear-gradient(135deg,#059669,#10b981);
            color:#ffffff !important;
            font-size:15px;
            font-weight:800;
            text-decoration:none;
            padding:15px 44px;
            border-radius:50px;
            letter-spacing:0.02em;
            box-shadow:0 4px 20px rgba(16,185,129,0.35);
            text-align:center;
          "
        >
          Go to login &rarr;
        </a>
      </td>
    </tr>

    <!-- Divider -->
    <tr>
      <td align="center" style="padding:28px 48px 0;background-color:#ffffff !important;">
        <div style="height:1px;background-color:#f0fdf4 !important;border-top:1.5px dashed #bbf7d0;"></div>
      </td>
    </tr>

    <!-- Security note -->
    <tr>
      <td align="center" style="padding:0 48px 0;background-color:#ffffff !important;">
        <div style="background-color:#f0fdf4 !important;border:1.5px solid #bbf7d0;border-radius:12px;padding:12px 16px;text-align:center;">
          <p style="margin:0;font-size:12px;color:#065f46 !important;line-height:1.6;text-align:center;">
            If you didn't create a Nexora account, please ignore this email or contact our support team.
          </p>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding:24px 48px 36px;background-color:#ffffff !important;">
        <p style="margin:0 0 4px;font-size:12px;color:#9ca3af !important;text-align:center;">
          You received this because your email was just verified on Nexora.
        </p>
        <p style="margin:0;font-size:12px;color:#c4b5fd !important;text-align:center;">
          &copy; ${new Date().getFullYear()} Nexora &nbsp;&middot;&nbsp; Made with &hearts;
        </p>
      </td>
    </tr>

  </table>

</td>
</tr>
</table>

</body>
</html>`;
};

const generateVerifiedTextTemplate = (loginLink) => {
  return `
Nexora — Email verified!

Your Nexora account is all set. Start searching smarter today.

Log in here: ${loginLink}

If you didn't create a Nexora account, please ignore this email.

© ${new Date().getFullYear()} Nexora
`.trim();
};

export {
  generateVerificationHTMLTemplate,
  generateVerificationTextTemplate,
  generateVerifiedHTMLTemplate,
  generateVerifiedTextTemplate,
};
