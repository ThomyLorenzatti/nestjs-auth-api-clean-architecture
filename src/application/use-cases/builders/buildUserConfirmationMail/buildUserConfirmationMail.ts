import { IMailBuilder } from 'src/application/interfaces/services/IMailBuilder';
import { Mail } from '../../../../domain/entities/Mail';
import { IConfirmationMailBuilder } from 'src/application/interfaces/builders/IConfirmationMailBuilder';

export class ConfirmationUserMailBuilder
  implements IMailBuilder<IConfirmationMailBuilder>
{
  build(from: string, to: string, data: IConfirmationMailBuilder): Mail {
    return {
      from: from,
      to: to,
      subject: 'Confirmation adresse mail inscription',
      mjmlContent: `
            <mjml>
                <mj-body>
                    <mj-section>
                        <mj-column>
                            <mj-text>
                                Bonjour ${data.username},
                            </mj-text>
                            <mj-text>
                                Merci de vous être inscrit. Pour confirmer votre adresse e-mail, veuillez cliquer sur le bouton ci-dessous.
                            </mj-text>
                            <mj-button href="${data.activationLink}">Confirmer l'adresse e-mail</mj-button>
                        </mj-column>
                    </mj-section>
                </mj-body>
            </mjml>
        `,
    };
  }
}
