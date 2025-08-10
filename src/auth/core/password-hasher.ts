import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, SALT_ROUNDS)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}
