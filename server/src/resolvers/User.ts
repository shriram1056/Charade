import argon2 from 'argon2'
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
  UseMiddleware,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import { createTokens } from '../auth'
import { Team } from '../entities/team'
import { Users } from '../entities/user'
import { isAuth } from '../middleware/isAuth'
import { MyContext } from '../types/types'
import { FieldError } from '../utils/Errors'
import { UserCredentials } from '../utils/regsiterTyps'
import { validateRegister } from '../utils/validateRegister'
// Promise<sth> is for sending data without awaiting like return Users.findOne({ where: { id } })
@ObjectType()
export class UserResponse {
  @Field(() => FieldError, { nullable: true })
  errors?: FieldError
  // ? marks the member as being optional .this lets use create onbject with fields with ? as optional

  @Field(() => Users, { nullable: true })
  user?: Users
}

@Resolver(Users)
export class UserResolver {
  @UseMiddleware(isAuth)
  @FieldResolver(() => [Team], { nullable: true })
  async team(@Ctx() { req }: MyContext): Promise<Team[] | null> {
    /* const teams = await TeamMember.find({
      select: ['team', 'userId'],
      where: { userId: req.userId },
      relations: ['team'],
    })*/

    const teams = await getConnection() // "" use double quotes for AS syntax
      .query(
        `
    select 
    t.created_at "createdAt",
    t.updated_at "updatedAt",
    t.name,
    t.id,
    tm.admin "admin"
    from team_member tm
    inner join public.team t on t.id= tm.team_id
    where tm.user_id= $1;
    `,
        [req.userId]
      )
    return teams
  }
  /*select json_build_object(
      'id',t.id,
      'name',t.name,
      'ownerId', t.owner_id,
      'updatedAt', t.updated_at,
      'createdAt', t.created_at
    ) team    
    
    tm.team doesn't exists it is only a typeorm trick*/
  @Query(() => [Users])
  allUser(): Promise<Users[]> {
    return Users.find()
  }
  @Query(() => Users)
  User(@Arg('id', () => Int) id: number): Promise<Users | undefined> {
    return Users.findOne(id)
  }

  @Mutation(() => UserResponse)
  async createUser(
    @Arg('options') options: UserCredentials
  ): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors) {
      console.log(errors)
      return { errors }
    }
    const hashedPassword = await argon2.hash(options.password)
    let user
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Users)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning('*')
        .execute()
      user = result.raw[0]
    } catch (err) {
      if (err.code === '23505' && err.detail.includes('username')) {
        console.log(err)
        return {
          errors: {
            field: 'username',
            message: 'username already taken',
          },
        }
      } else if (err.code === '23505' && err.detail.includes('email')) {
        return {
          errors: {
            field: 'email',
            message: 'email already used',
          },
        }
      }

      console.log('message, ', err.message)
    }
    return {
      user,
    }
  }

  @Mutation(() => UserResponse)
  async Login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { res }: MyContext
  ): Promise<UserResponse> {
    const user = await Users.findOne({ where: { email: email } }) // don't forget await
    if (!user) {
      return {
        errors: {
          field: 'email',
          message: 'you have not registered',
        },
      }
    }

    let verify = await argon2.verify(user.password, password) // never forget await for promise
    if (!verify) {
      return {
        errors: {
          field: 'password',
          message: 'incorrect password',
        },
      }
    }
    const { accessToken, refreshToken } = await createTokens(user)
    // cookie setting on browser
    res.cookie('refresh-token', refreshToken)
    res.cookie('access-token', accessToken)

    return {
      user,
    }
  }

  @Query(() => Users, { nullable: true })
  getUser(@Ctx() { req }: MyContext) {
    if (!req.userId) {
      // this is fetched accurately because browser sends a cookie with a secret key to the server at every request and the cookie details come from redis using this secret key. and cookie are unique
      return null
    }
    let user = Users.findOne(req.userId) // User.findOne(data.userId) and data.userId is undefined.then typeorm return random user
    return user
  }

  @Query(() => Users, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.userId) {
      // this is fetched accurately because browser sends a cookie with a secret key to the server at every request and the cookie details come from redis using this secret key. and cookie are unique
      return null
    }
    return {
      id: req.userId,
    }
  }
}
