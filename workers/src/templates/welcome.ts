import type { WelcomeEmailPayload } from '@logmydose/shared/queues';

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

export function renderWelcomeEmail(payload: WelcomeEmailPayload): EmailContent {
  const name = payload.firstName || 'there';

  return {
    subject: 'Welcome to LogMyDose!',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to LogMyDose</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #9b2341 0%, #BE3455 100%);">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">LogMyDose</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">Welcome, ${name}!</h2>

              <p style="margin: 0 0 20px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                We're excited to have you on board. LogMyDose helps you track your peptide therapy with ease, giving you insights into your health journey.
              </p>

              <p style="margin: 0 0 20px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                <strong>Get started by:</strong>
              </p>

              <ul style="margin: 0 0 30px; padding-left: 20px; color: #3f3f46; font-size: 16px; line-height: 1.8;">
                <li>Setting up your first protocol</li>
                <li>Logging your doses</li>
                <li>Tracking your progress over time</li>
              </ul>

              <p style="margin: 0 0 30px; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                If you have any questions, our support team is here to help.
              </p>

              <p style="margin: 0; color: #3f3f46; font-size: 16px; line-height: 1.6;">
                Best,<br>
                <strong>The LogMyDose Team</strong>
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
    text: `Welcome to LogMyDose, ${name}!

We're excited to have you on board. LogMyDose helps you track your peptide therapy with ease, giving you insights into your health journey.

Get started by:
- Setting up your first protocol
- Logging your doses
- Tracking your progress over time

If you have any questions, our support team is here to help.

Best,
The LogMyDose Team`,
  };
}
