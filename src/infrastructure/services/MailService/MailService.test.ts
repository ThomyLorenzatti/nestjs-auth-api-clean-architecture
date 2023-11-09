import { MailService } from './MailService';
import { Mail } from '../../../domain/entities/Mail';
import * as nodemailer from 'nodemailer';
import * as mjml2html from 'mjml';
import * as dotenv from 'dotenv';

dotenv.config();

jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(true),
    }),
  };
});

jest.mock('mjml', () => {
  return jest.fn().mockReturnValue({ html: '<html>Converted</html>' });
});

describe('MailService', () => {
  let mailService: MailService;
  const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
  const mockedMjml2Html = mjml2html as jest.MockedFunction<typeof mjml2html>;

  beforeEach(() => {
    mailService = new MailService();
  });

  it('should send an email', async () => {
    const mail: Mail = {
      from: `"${dotenv.config().parsed.SMTP_FROM_NAME}" <${
        dotenv.config().parsed.SMTP_FROM_EMAIL
      }>`,
      to: dotenv.config().parsed.SMTP_FROM_EMAIL,
      subject: 'Test Email',
      mjmlContent: '<mjml>Test MJML content</mjml>',
    };

    await mailService.sendMail(mail);

    expect(mockedNodemailer.createTransport().sendMail).toHaveBeenCalledWith({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      html: '<html>Converted</html>',
    });
  });

  it('should throw an error with invalid MJML', async () => {
    mockedMjml2Html.mockImplementationOnce(() => {
      throw new Error('MJML Error');
    });

    const mail: Mail = {
      from: `"${dotenv.config().parsed.SMTP_FROM_NAME}" <${
        dotenv.config().parsed.SMTP_FROM_EMAIL
      }>`,
      to: dotenv.config().parsed.SMTP_FROM_EMAIL,
      subject: 'Test Email',
      mjmlContent: 'Invalid MJML',
    };

    await expect(mailService.sendMail(mail)).rejects.toThrow(
      'Invalid MJML template: MJML Error',
    );
  });
});
