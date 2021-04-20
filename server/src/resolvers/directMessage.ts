import { withFilter } from 'apollo-server-express'
import { createWriteStream } from 'fs'
import { GraphQLUpload } from 'graphql-upload'
import path from 'path'
import { Upload } from 'src/types/Upload'
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
import { DirectMessage } from '../entities/direct_message'
import { Users } from '../entities/user'
import { isAuth } from '../middleware/isAuth'
import { requiresDirectAuth } from '../middleware/IsAuthAdvance'
import { MyContext } from '../types/types'
@ObjectType()
class PaginatedDirectMessages {
  @Field(() => [DirectMessage])
  Messages: DirectMessage[]

  @Field()
  hasMore: boolean
}

const DIRECTMESSAGE = 'DIRECT_MESSAGE'
@Resolver(DirectMessage)
export class directMessage {
  @FieldResolver(() => Users)
  async sender(
    @Root() message: DirectMessage,
    @Ctx() { userLoader }: MyContext
  ) {
    const user = userLoader.load(message.senderId)
    return user
  }
  @FieldResolver()
  async url(@Root() message: DirectMessage) {
    if (message.url) {
      return `http://localhost:4001/files/${message.url}`
    }
    return null
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async createDirectMessages(
    @Arg('receiverId', () => Int) receiverId: number,
    @Arg('text', { nullable: true }) text: string,
    @Arg('teamId', () => Int) teamId: number,
    @Ctx() { req, pubsub }: MyContext,
    @Arg('file', () => GraphQLUpload, { nullable: true }) file: Upload
  ) {
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
            .into(DirectMessage)
            .values({
              receiverId,
              teamId,
              senderId: req.userId,
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
          .into(DirectMessage)
          .values({
            text,
            receiverId,
            teamId,
            senderId: req.userId,
          })
          .returning('*')
          .execute()
        //FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK!!!!!!!!!!!!!!!!!!!!!!!. DON'T FORGET AWAIT
      }
    } catch (err) {
      console.log(err)
      return false
    }
    const message = (result as any).generatedMaps[0]
    console.log(message)
    await pubsub.publish(DIRECTMESSAGE, message)
    return true
  }

  //we get the user info by looking at the sender field
  @UseMiddleware(isAuth)
  @Query(() => PaginatedDirectMessages)
  async DirectMessages(
    @Arg('teamId', () => Int) teamId: number,
    @Arg('receiverId', () => Int) receiverId: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string,
    @Ctx() { req }: MyContext
  ) {
    let options: any = [
      { teamId, receiverId, senderId: req.userId },
      { receiverId: req.userId, senderId: receiverId, teamId },
    ]
    if (cursor) {
      options = [
        {
          teamId,
          receiverId,
          senderId: req.userId,
          createdAt: LessThan(new Date(cursor)),
        },
        {
          receiverId: req.userId,
          senderId: receiverId,
          teamId,
          createdAt: LessThan(new Date(cursor)),
        },
      ]
    }
    const message = await DirectMessage.find({
      take: 35,
      where: options,
      order: {
        createdAt: 'DESC',
      },
    })
    console.log(message.length)
    let pagiantedMessages = {
      hasMore: message.length === 35 ? true : false,
      Messages: message,
    }
    return pagiantedMessages
  }

  @UseMiddleware(isAuth)
  @Query(() => [Users])
  async getTeamMembers(@Arg('teamId', () => Int) teamId: number) {
    const member = await getConnection() // "" use double quotes for AS syntax
      .query(
        `
    select 
 u.id,
 u.username,
u.email,
u.created_at "createdAt"
    from team_member tm
    inner join public.users u on u.id= tm.user_id
    where tm.team_id= $1;
    `,
        [teamId]
      )

    return member
  }

  //there is no issue with connection params, it is just when the middleware is in top level authenticates for all the users.
  //MIDDLEWARE IN SUBSCRIBE FUNCTION IS DIFFERENT SINCE EACH CONNECTIONPARAM IS STORED SEPERATELY IN ITS OWN SUBSCRIPTION
  @Subscription(() => DirectMessage, {
    // this is where subscription get registered.
    subscribe: requiresDirectAuth.createResolver(
      withFilter(
        (_, __, { pubsub }) => pubsub.asyncIterator(DIRECTMESSAGE),
        (payload, { receiverId, teamId }, { connection: { context } }) => {
          console.log(receiverId)
          return (
            payload.teamId === teamId &&
            ((payload.senderId === context.userId &&
              payload.receiverId === receiverId) ||
              (payload.senderId === receiverId &&
                payload.receiverId === context.userId))
          )
        }
      )
    ),
  })
  async newDirectMessage(
    @Root() payload: DirectMessage,
    //@ts-ignore
    @Arg('teamId', () => Int) teamId: number,
    //@ts-ignore
    @Arg('receiverId', () => Int) receiverId: number,
    //@ts-ignore
    @Ctx() { connection: { context } }: MyContext
  ) {
    console.log(context)
    const { username } = context
    payload.createdAt = new Date(payload.createdAt) // date don't get formated in redis
    // @ts-ignore
    payload.sender = { username }
    return payload
  }
}

// "name = :name OR lastName = :lastName", {
//   name: "john",
//   lastName: "doe"
// }
