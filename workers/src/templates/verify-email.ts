import type { VerifyEmailPayload } from '@logmydose/shared/queues';
import type { EmailContent } from './welcome.js';

export function renderVerifyEmail(payload: VerifyEmailPayload): EmailContent {
  const name = payload.firstName || 'there';

  return {
    subject: 'Verify your LogMyDose email',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">LogMyDose</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">Verify your email address</h2>

              <p style="margin: 0 0 20px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Hi ${name},
              </p>

              <p style="margin: 0 0 30px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Please click the button below to verify your email address and complete your account setup:
              </p>

              <!-- Button -->
              <table role="presentation" style="margin: 0 auto 30px;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);">
                    <a href="${payload.verificationUrl}" target="_blank" style="display: inline-block; padding: 14px 30px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 20px; color: #71717a; font-size: 14px; line-height: 1.6;">
                Or copy and paste this link into your browser:
              </p>

              <p style="margin: 0 0 30px; color: #7c3aed; font-size: 14px; word-break: break-all;">
                ${payload.verificationUrl}
              </p>

              <p style="margin: 0 0 20px; color: #71717a; font-size: 14px; line-height: 1.6;">
                This link expires in 24 hours.
              </p>

              <p style="margin: 0; color: #71717a; font-size: 14px; line-height: 1.6;">
                If you didn't create an account with LogMyDose, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f4f4f5; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 14px;">
                &copy; ${new Date().getFullYear()} LogMyDose. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
    text: `Verify your email address

Hi ${name},

Please click the link below to verify your email address and complete your account setup:

${payload.verificationUrl}

This link expires in 24 hours.

If you didn't create an account with LogMyDose, you can safely ignore this email.

- The LogMyDose Team`,
  };
}
