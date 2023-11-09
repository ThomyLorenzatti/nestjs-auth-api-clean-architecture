import { Mail } from '../../../domain/entities/Mail';

export interface IMailService {
  sendMail(mail: Mail): Promise<void>;
}
