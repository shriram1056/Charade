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
  UseMiddleware,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import { Channel } from '../entities/channel'
import { TeamMember } from '../entities/member'
import { Team } from '../entities/team'
import { Users } from '../entities/user'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types/types'
import { FieldError } from '../utils/Errors'

@ObjectType()
class TeamResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError
  // ? marks the member as being optional .this lets use create onbject with fields with ? as optional

  @Field(() => Team, { nullable: true })
  team?: Team
}

@ObjectType()
export class User {
  @Field()
  id!: number

  @Field()
  username!: string
}

@ObjectType()
class AddUserResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError
}

@Resolver(() => Team)
export class TeamResolver {
  @FieldResolver(() => Channel, { nullable: true }) // return channell or null from array
  async channels(@Root() team: Team, @Ctx() { channelLoader, req }: MyContext) {
    let channel = await channelLoader.load({
      teamId: team.id,
      userId: req.userId,
    }) // undefined turns to null
    return channel
  }

  @FieldResolver(() => User, { nullable: true })
  async directMessageUsers(
    @Root() team: Team,
    @Ctx() { req, DirectMessageLoader }: MyContext
  ) {
    const user = await DirectMessageLoader.load({
      teamId: team.id,
      userId: req.userId,
    })
    return user
  }
  @Query(() => [Team])
  allTeam(): Promise<Team[]> {
    return Team.find()
  }
  @Mutation(() => TeamResponse)
  @UseMiddleware(isAuth) // check if user is logged in
  async createTeam(
    @Arg('name') name: string,
    @Ctx() { req }: MyContext
  ): Promise<TeamResponse> {
    let response
    try {
      //transaction: here we don't want team without channel.
      //If any of the tasks fail, the transaction fails
      //The COMMIT command saves all the transactions to the database since the last COMMIT or ROLLBACK command. ROLLBACK: for error
      response = await getConnection().transaction(async () => {
        const result = await getConnection()
          .createQueryBuilder()
          .insert()
          .into(Team)
          .values({
            name,
          })
          .returning('*')
          .execute()

        let team = result.raw[0]
        getConnection()
          .createQueryBuilder()
          .insert()
          .into(Channel)
          .values({
            name: 'general',
            teamId: team.id,
          })
          .execute()
        await TeamMember.insert({
          teamId: team.id,
          userId: req.userId,
          admin: true,
        })
        return team
      })
    } catch (err) {
      if (err.code === '23505' && err.detail.includes('name')) {
        console.log(err)
        return {
          errors: {
            field: 'name',
            message: 'team already taken',
          },
        }
      }
    }
    return {
      team: response,
    }
  }

  @Mutation(() => AddUserResponse, { nullable: true })
  @UseMiddleware(isAuth) // check if user is logged in
  async addTeamMember(
    @Arg('email') email: string,
    @Arg('teamId', () => Int) teamId: number,
    @Ctx() { req }: MyContext
  ): Promise<AddUserResponse | null> {
    const UserPromise = Users.findOne({ where: { email: email } })
    const teamPromise = TeamMember.findOne({
      where: { teamId, userId: req.userId },
    })
    const [UserToAdd, team] = await Promise.all([UserPromise, teamPromise]) // wait for both the promise to finish   or   run both promise at the same time
    if (!team?.admin) {
      return {
        errors: {
          field: 'email',
          message: 'You cannot add members to the team',
        },
      }
    }
    if (!UserToAdd) {
      return {
        errors: {
          field: 'email',
          message: 'Could not find user with this email',
        },
      }
    }

    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(TeamMember)
        .values({
          userId: UserToAdd.id,
          teamId,
        })
        .returning('*')
        .execute()
    } catch (err) {
      if (
        (err.code === '23505', err.detail.includes('Key (team_id, user_id'))
      ) {
        return {
          errors: {
            field: 'email',
            message: 'user is already a memer',
          },
        }
      }
      return {
        errors: {
          field: 'unknown',
          message: 'something went wrong',
        },
      }
    }
    return null
  }
}
