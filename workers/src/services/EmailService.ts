import { Resend } from 'resend';
import { env } from '../config/env.js';
import type { IEmailService, SendEmailOptions, SendEmailResult } from './interfaces/IEmailService.js';

export class ResendEmailService implements IEmailService {
  private client: Resend;

  constructor() {
    this.client = new Resend(env.RESEND_API_KEY);
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    const { data, error } = await this.client.emails.send({
      from: env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    if (error) {
      throw new Error(`Email send failed: ${error.message}`);
    }

    return { id: data!.id, success: true };
  }
}
