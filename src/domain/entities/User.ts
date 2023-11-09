/* eslint-disable prettier/prettier */
// src/domain/entities/User.ts

export class User {
  private _id: number | null;
  private _name: string;
  private _dateOfBirth: Date;
  private _email: string;
  private _password: string;
  private _email_verified: boolean;
  
  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get dateOfBirth(): Date {
    return this._dateOfBirth;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get emailVerified(): boolean {
    return this._email_verified;
  }

  constructor(name: string, email: string, password: string, dateOfBirth: Date, id?: number, email_verified?: boolean) {
    this._name = name;
    this._email = email;
    this._password = password;
    this._dateOfBirth = dateOfBirth;
    this._id = id || null;
    this._email_verified = email_verified || false;
  }
}
