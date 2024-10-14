import * as bcrypt from 'bcrypt';

export function hashString(str: string) {
  return bcrypt.hash(str, 10);
}
