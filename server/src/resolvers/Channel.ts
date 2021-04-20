import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Resolver,
  UseMiddleware,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import { Channel } from '../entities/channel'
import { channelMember } from '../entities/channel_member'
import { TeamMember } from '../entities/member'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types/types'
import { FieldError } from '../utils/Errors'
@ObjectType()
export class ChannelResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError
  // ? marks the member as being optional .this lets use create onbject with fields with ? as optional

  @Field(() => Channel, { nullable: true })
  channel?: Channel
}
@Resolver()
export class ChannelResolver {
  @Mutation(() => ChannelResponse, { nullable: true })
  @UseMiddleware(isAuth)
  async createChannel(
    @Arg('name') name: string,
    @Arg('teamId', () => Int) teamId: number,
    @Arg('public') access: boolean, // optional in typegraphql
    @Arg('members', () => [Int]) members: number[],
    @Ctx() { req }: MyContext
  ) {
    console.log(name, members)
    const team = await TeamMember.findOne({
      where: { teamId, userId: req.userId },
    })
    if (!team?.admin) {
      return {
        errors: {
          field: 'channelName',
          message: 'permission denied',
        },
      }
    }
    let channel: any
    try {
      await getConnection().transaction(async () => {
        let results = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Channel)
          .values({
            name: name,
            public: access,
            teamId: teamId,
          })
          .returning('*') // return the sql made
          .execute()
        channel = results.raw[0]
        if (!access) {
          const channelMembers = members.filter((m) => m !== req.userId)
          channelMembers.push(req.userId)
          await channelMember.insert(
            channelMembers.map((m) => ({ userId: m, channelId: channel.id }))
          )
        }
      })
    } catch (err) {
      console.log(err)
    }
    return { channel }
  }
}
