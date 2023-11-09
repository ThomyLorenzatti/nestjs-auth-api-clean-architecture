import { IMailBuilder } from '../../../interfaces/services/IMailBuilder';
import { IForgotPasswordMailBuilder } from '../../../interfaces/builders/IForgotPasswordMailBuilder';
import { Mail } from '../../../../domain/entities/Mail';

export class ForgotPasswordMailBuilder
  implements IMailBuilder<IForgotPasswordMailBuilder>
{
  build(from: string, to: string, data: IForgotPasswordMailBuilder): Mail {
    return {
      from: from,
      to: to,
      subject: 'Réinitialisation mot de passe',
      mjmlContent: `
                <mjml>
                    <mj-body>
                        <mj-section>
                            <mj-column>
                                <mj-text>
                                    Bonjour ${data.username},
                                </mj-text>
                                <mj-text>
                                    Vous avez demandé la réinitialisation de votre mot de passe. Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous.
                                </mj-text>
                                <mj-button href="${data.resetLink}">Reinitialiser Mot de passe</mj-button>
                            </mj-column>
                        </mj-section>
                    </mj-body>
                </mjml>
            `,
    };
  }
}
