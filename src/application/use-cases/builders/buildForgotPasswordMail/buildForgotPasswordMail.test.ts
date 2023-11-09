import { ForgotPasswordMailBuilder } from './buildForgotPasswordMail';

describe('ForgotPasswordMailBuilder', () => {
  let forgotPasswordMailBuilder: ForgotPasswordMailBuilder;

  beforeEach(() => {
    forgotPasswordMailBuilder = new ForgotPasswordMailBuilder();
  });

  it('should return the correct Mail object', () => {
    const from = 'test@example.com';
    const to = 'user@example.com';
    const username = 'John';
    const resetLink = 'http://example.com/reset/123';

    const expectedMailContent = `
                <mjml>
                    <mj-body>
                        <mj-section>
                            <mj-column>
                                <mj-text>
                                    Bonjour ${username},
                                </mj-text>
                                <mj-text>
                                    Vous avez demandé la réinitialisation de votre mot de passe. Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous.
                                </mj-text>
                                <mj-button href="${resetLink}">Reinitialiser Mot de passe</mj-button>
                            </mj-column>
                        </mj-section>
                    </mj-body>
                </mjml>
            `;

    const expectedMail = {
      from: from,
      to: to,
      subject: 'Réinitialisation mot de passe',
      mjmlContent: expectedMailContent,
    };

    const actualMail = forgotPasswordMailBuilder.build(from, to, {
      username: username,
      resetLink: resetLink,
    });

    expect(actualMail).toEqual(expectedMail);
  });
});
