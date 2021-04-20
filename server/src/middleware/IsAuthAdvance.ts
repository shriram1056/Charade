//@ts-nocheck
// makes a property in the resolver and returns it
import { Channel } from '../entities/channel'
import { TeamMember } from '../entities/member'
const createResolver = (resolver) => {
  const baseResolver = resolver

  baseResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context, info) => {
      await resolver(parent, args, context, info)
      return childResolver(parent, args, context, info)
    }
    // convert child resolver to run the parent resolver before it's own run
    return createResolver(newResolver)
  }
  return baseResolver
}
//when requiresTeamAccess.createResolver(c) is called, convert c to run after running requiresTeamAccess

export const requiresTeamAccess = createResolver(
  async (parent, { channelId }, { connection }) => {
    console.log(channelId, connection.context)
    let {
      context: { userId },
    } = connection
    if (!userId) {
      throw new Error('Not authenticated')
    }
    // check if part of the team
    const channel = await Channel.findOne({ where: { id: channelId } })
    const member = await TeamMember.findOne({
      where: { teamId: channel.teamId, userId },
    })
    if (!member) {
      throw new Error(
        "You have to be a member of the team to subcribe to it's messages"
      )
    }
  }
)
export const requiresDirectAuth = createResolver(
  async (parent, { receiverId, teamId }, { connection }) => {
    if (!connection?.context?.userId) {
      throw new Error('not authenticated')
    }
    console.log(connection?.context?.userId)
    const member = await TeamMember.find({
      where: [
        { teamId, userId: connection.context.userId },
        { teamId, userId: receiverId },
      ],
    })
    if (member?.length !== 2) {
      throw new Error(
        "You have to be a member of the team to subcribe to it's messages"
      )
    }
  }
)
