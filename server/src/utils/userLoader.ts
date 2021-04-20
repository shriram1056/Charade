import DataLoader from 'dataloader'
import { Users as User } from '../entities/user'
export const userLoader = () =>
  new DataLoader<number, User>(async (keys) => {
    const Users = await User.findByIds(keys as number[])
    const object: Record<number, User> = {}
    Users.map((u) => (object[u.id] = u))
    const data = keys.map((k) => object[k])
    return data
  })
