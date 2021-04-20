import { Request, Response } from 'express'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { ExecutionParams } from 'subscriptions-transport-ws'
import { ChannelLoader } from '../utils/channelLoader'
import { DirectMessageLoader } from '../utils/DirectMessageLoader'
import { userLoader } from '../utils/userLoader'

export type MyContext = {
  req: Request & { userId: number }
  res: Response
  SECRET: string
  SECRET2: string
  channelLoader: ReturnType<typeof ChannelLoader>
  DirectMessageLoader: ReturnType<typeof DirectMessageLoader>
  userLoader: ReturnType<typeof userLoader>
  connection: ExecutionParams<any> | undefined
  pubsub: RedisPubSub
}
