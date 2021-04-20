import DataLoader from 'dataloader'
import { getConnection } from 'typeorm'
import { Channel } from '../entities/channel'
//const channel = await Channel.find({ where: { teamId: In(keys as any) } })
// findbyIds makes an where clause with all primary key and primary column

export const ChannelLoader = () =>
  new DataLoader<{ teamId: number; userId: number }, Channel[] | null>(
    async (keys) => {
      // not all teams will have a channel created. so, channel array will have null

      const teamIds = keys.map((t) => t.teamId)
      const channel = await getConnection() // "" use double quotes for AS syntax
        .query(
          `
    select 
    distinct on (c.id)
    c.*
    from channel c
    left join public.channel_member cm on (cm.channel_id= c.id)
    where c.team_id = any($1) and (c.public=true or (cm.user_id= $2 and cm.channel_id = c.id));
    `,
          [teamIds, keys[0].userId]
        )
      const channelObject: Record<number, Channel[]> = {} // make an object with teamId as key. i repeat a object can have multiple keys
      channel.forEach((u: any) => {
        if (channelObject[u.team_id]) {
          // if property exist push
          channelObject[u.team_id].push(u)
        } else {
          // else make a array with object
          channelObject[u.team_id] = [u]
        }
      })
      // undefined is assignable to null
      return keys.map((key) => channelObject[key.teamId])
    }
  )
