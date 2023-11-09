export interface IJWTokenService {
  generateToken(userId: number): Promise<string>;
  validateToken(token: string): Promise<any>;
}
