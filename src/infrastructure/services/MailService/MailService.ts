import { IMailService } from '../../../application/interfaces/services/IMailService';
import { Mail } from 'src/domain/entities/Mail';
import * as mjml2html from 'mjml';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

export class MailService implements IMailService {
  private transporter;
  private htmlOutput;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: dotenv.config().parsed.SMTP_PROVIDER,
      port: dotenv.config().parsed.SMTP_PORT,
      auth: {
        user: dotenv.config().parsed.SMTP_USER,
        pass: dotenv.config().parsed.SMTP_PASSWORD,
      },
    });
  }

  async sendMail(mail: Mail): Promise<void> {
    await this.convertToHtml(mail.mjmlContent);

    await this.transporter.sendMail({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: this.htmlOutput,
    });
  }

  private async convertToHtml(mjmlContent: string): Promise<void> {
    try {
      const result = mjml2html(mjmlContent);
      this.htmlOutput = result.html;
    } catch (error) {
      throw new Error('Invalid MJML template: ' + error.message);
    }
  }
}
