import { withFilter } from 'apollo-server-express'
import { createWriteStream } from 'fs'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { GraphQLUpload } from 'graphql-upload'
import path from 'path'
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  Subscription,
  UseMiddleware,
} from 'type-graphql'
import { getConnection, LessThan } from 'typeorm'
import { Channel } from '../entities/channel'
import { channelMember } from '../entities/channel_member'
import { Message } from '../entities/message'
import { Users } from '../entities/user'
import { isAuth } from '../middleware/isAuth'
import { requiresTeamAccess } from '../middleware/IsAuthAdvance'
import { MyContext } from '../types/types'
import { Upload } from '../types/Upload'

const pubsub = new RedisPubSub()

@ObjectType()
class PaginatedMessages {
  @Field(() => [Message])
  Messages: Message[]

  @Field()
  hasMore: boolean
}

const CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE'
@Resolver(Message)
export class MessageResolver {
  @FieldResolver(() => Users)
  async user(@Root() message: Message, @Ctx() { userLoader }: MyContext) {
    const user = userLoader.load(message.userId)
    return user
  }

  @FieldResolver()
  async url(@Root() message: Message) {
    if (message.url) {
      return `http://localhost:4001/files/${message.url}`
    }
    return null
  }

  @Mutation(() => Message)
  @UseMiddleware(isAuth)
  async createMessage(
    @Arg('text', { nullable: true }) text: string,
    //@ts-ignore
    @Arg('file', () => GraphQLUpload, { nullable: true }) file: Upload,
    @Arg('channelId', () => Int) channelId: number,
    @Ctx() { req: { userId } }: MyContext
  ): Promise<Message> {
    let result
    try {
      if (file) {
        const { createReadStream, mimetype, filename } = await file // DON'T FORGET TO AWAIT THE FILES
        const realPath = path.join(__dirname, `../images/${filename}`)
        const fileUpload = createReadStream()
          .pipe(createWriteStream(realPath))
          .on('finish', () => {
            console.log('finish')
            return true
          })
          .on('error', (err) => {
            console.log(err)
            return false // reject throws a error.
          })
        if (fileUpload) {
          console.log(mimetype)
          //INSERT DOESN'T RETURN NULL COLUMNS
          result = await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Message)
            .values({
              channelId,
              userId,
              fileType: mimetype,
              url: filename,
            })
            .returning('*') // return the sql made
            .execute()
        }
      } else {
        result = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Message)
          .values({
            text,
            channelId,
            userId,
          })
          .returning('*') // return the sql made
          .execute()
        //FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK!!!!!!!!!!!!!!!!!!!!!!!. DON'T FORGET AWAIT
      }
    } catch (err) {
      console.log(err)
    }
    let message: any = (result as any).generatedMaps[0] // raw sql return channel_id instead of channelId
    await pubsub.publish(CHANNEL_MESSAGE, message)
    return message
  }

  @Query(() => PaginatedMessages)
  @UseMiddleware(isAuth)
  async Messages(
    @Arg('channelId', () => Int) channelId: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string,
    @Ctx() { req }: MyContext
  ): Promise<PaginatedMessages> {
    const channel = await Channel.findOne({
      where: {
        id: channelId,
      },
    })
    if (!channel?.public) {
      const member = await channelMember.findOne({
        where: {
          userId: req.userId,
        },
      })
      if (!member) {
        throw new Error('not authorized')
      }
    }
    let options: any = { channelId }
    if (cursor) {
      console.log(cursor, new Date(cursor))
      options = {
        channelId,
        createdAt: LessThan(new Date(cursor)),
      }
    }
    let message = await Message.find({
      take: 35,
      where: options,
      order: {
        createdAt: 'DESC',
      },
    })

    let pagiantedMessages = {
      hasMore: message.length === 35 ? true : false,
      Messages: message,
    }
    return pagiantedMessages
  }

  //top level resolver runs every time. so use the below resolver
  @Subscription(() => Message, {
    subscribe: requiresTeamAccess.createResolver(
      withFilter(
        () => pubsub.asyncIterator(CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId
      )
      // args is for subscription's argument
    ),
  })
  async newChannelMessage(
    @Root() payload: Message,
    //@ts-ignore
    @Arg('channelId', () => Int) args: number,
    @Ctx() { userLoader }: MyContext
  ) {
    const user = await userLoader.load(payload.userId)
    payload.user = user // users can't be fetched with field resolver
    payload.createdAt = new Date(payload.createdAt) // date don't get formated in redis
    return payload
  }
}

/*
topics and filter don't work with 
  */
