import { sign } from 'jsonwebtoken'
import { SECRET, SECRET2 } from './constant'
import { Users } from './entities/user'
export const createTokens = async (user: Users) => {
  const refreshToken = sign(
    { userId: user.id, username: user.username, count: user.count },
    SECRET,
    {
      expiresIn: '7d',
    }
  )
  const accessToken = sign(
    { userId: user.id, username: user.username },
    SECRET2,
    {
      expiresIn: '15min',
    }
  )

  return { refreshToken, accessToken }
}
