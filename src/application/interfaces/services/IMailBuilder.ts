import { Mail } from '../../../domain/entities/Mail';

export interface IMailBuilder<T> {
  build(from: string, to: string, data: T): Mail;
}
