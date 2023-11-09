import { ConfirmationUserMailBuilder } from './buildUserConfirmationMail';
import { IConfirmationMailBuilder } from '../../../interfaces/builders/IConfirmationMailBuilder';

describe('ConfirmationUserMailBuilder', () => {
  let builder: ConfirmationUserMailBuilder;
  const from = 'sender@example.com';
  const to = 'recipient@example.com';
  const confirmationData: IConfirmationMailBuilder = {
    username: 'John',
    activationLink: 'https://example.com/activate',
  };

  beforeEach(() => {
    builder = new ConfirmationUserMailBuilder();
  });

  it('should correctly set from, to, and confirmation data', () => {
    const mail = builder.build(from, to, confirmationData);

    expect(mail.from).toBe(from);
    expect(mail.to).toBe(to);
    expect(mail.subject).toBe('Confirmation adresse mail inscription');
    expect(mail.mjmlContent).toContain(confirmationData.username);
    expect(mail.mjmlContent).toContain(confirmationData.activationLink);
  });

  it('should contain specific greetings and messages', () => {
    const mail = builder.build(from, to, confirmationData);

    expect(mail.mjmlContent).toContain(`Bonjour ${confirmationData.username},`);
    expect(mail.mjmlContent).toContain(
      'Merci de vous être inscrit. Pour confirmer votre adresse e-mail, veuillez cliquer sur le bouton ci-dessous.',
    );
  });
});
