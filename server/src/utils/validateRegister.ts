import { UserCredentials } from '../utils/regsiterTyps'

export const validateRegister = (options: UserCredentials) => {
  if (options.username.length <= 2) {
    return { field: 'username', message: 'username is too short' }
  }
  if (!options.email.includes('@') && !options.email.includes('.com')) {
    return { field: 'email', message: 'invalid email' }
  }
  if (options.username.includes('@')) {
    return { field: 'username', message: 'cannot include @ sign' }
  }

  if (options.password.length <= 3) {
    return { field: 'password', message: 'password is too short' }
  }
  return null
}
