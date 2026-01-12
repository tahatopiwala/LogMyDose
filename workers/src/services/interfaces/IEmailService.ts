export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  id: string;
  success: boolean;
}

export interface IEmailService {
  send(options: SendEmailOptions): Promise<SendEmailResult>;
}
