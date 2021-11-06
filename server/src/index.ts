import { ApolloServer } from 'apollo-server-express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { graphqlUploadExpress } from 'graphql-upload'
import http from 'http'
import { verify } from 'jsonwebtoken'
// verfiy method is for authenticating whether the token is made by us. it decoded as well as verifies
import path from 'path'
import 'reflect-metadata' // this is used by type-graphql
import { buildSchema } from 'type-graphql'
import { createConnection } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { MyContext } from '../src/types/types'
import { createTokens } from './auth'
import { SECRET, SECRET2 } from './constant'
import { Channel } from './entities/channel'
import { channelMember } from './entities/channel_member'
import { DirectMessage } from './entities/direct_message'
import { TeamMember } from './entities/member'
import { Message } from './entities/message'
import { Team } from './entities/team'
import { Users } from './entities/user'
import { ChannelResolver } from './resolvers/Channel'
import { directMessage } from './resolvers/directMessage'
import { MessageResolver } from './resolvers/Message'
import { TeamResolver } from './resolvers/Team'
import { UserResolver } from './resolvers/User'
import { ChannelLoader } from './utils/channelLoader'
import { DirectMessageLoader } from './utils/DirectMessageLoader'
import { userLoader } from './utils/userLoader'

const main = async () => {
  await createConnection({
    type: 'postgres',
    database: 'slack',
    host: 'localhost',
    port: 5432,
    username: 'shriram',
    password: 'shriram1056',
    logging: true,
    synchronize: true, //  Indicates if database schema should be auto created on every application launch.
    //A database schema is the structure of table
    migrations: [path.join(__dirname, './migrations/*')], // current dir + /migrations/*
    entities: [
      Users,
      Team,
      Channel,
      Message,
      TeamMember,
      channelMember,
      DirectMessage,
    ],
    namingStrategy: new SnakeNamingStrategy(),
  })
  const app = express()
  const pubsub = new RedisPubSub()
  app.use(cookieParser()) //Parse Cookie header and populate req.cookies with an object keyed by the cookie names.

  app.use(graphqlUploadExpress({ maxFileSize: 52428800, maxFiles: 10 })) // this is in bytes. THIS IS NECESSARY FOR FILE UPLOADS

  console.log(path.join(__dirname, 'images')) // path for files
  app.use('/files', express.static(path.join(__dirname, 'images')))

  app.use(async (req: any, res, next) => {
    const refreshToken = req.cookies['refresh-token'] // this use cookie parser
    const accessToken = req.cookies['access-token']

    if (!refreshToken && !accessToken) {
      console.log('refresh and access cookie expired')
      return next() // In this case you just want to exit the function and step further on your middleware chain.
    }

    try {
      const data = verify(accessToken, SECRET2) as any // if this fail due to undefined or expired go the catch
      req.userId = data.userId
      req.username = data.username
      return next()
    } catch {
      console.log('access token or cookie has expired')
    }

    if (!refreshToken) {
      console.log('refresh cookie expired')
      return next()
    }

    let data

    try {
      data = verify(refreshToken, SECRET) as any
    } catch {
      console.log('refresh token expired')
      return next()
    }

    const user = await Users.findOne(data.userId)

    if (!user || user.count !== data.count) {
      console.log('token is invalidated') // this mean something has changed and the user should login again to get cookie
      return next()
    }

    const tokens = await createTokens(user) // make access token and refresh token with data from refresh token

    res.cookie('refresh-token', tokens.refreshToken, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // ms x s x min x hr x days
    })
    res.cookie('access-token', tokens.accessToken, {
      maxAge: 1000 * 60 * 15, // ms x s x min x hr x days
    })
    req.userId = user.id
    req.username = user.username

    next()
  })

  const server = new ApolloServer({
    uploads: false, // do this for using uploads in node above 14
    subscriptions: {
      path: '/subscriptions', // path for listening for subscription requests

      onConnect: async (connectionParams: any) => {
        // we have lazy set to true, this helps us avoid connection

        //@ts-ignore
        const { authToken } = connectionParams
        let user: Record<string, number | string>
        console.log(connectionParams)
        if (connectionParams.authToken) {
          try {
            const payload = verify(authToken.Atoken, SECRET2) as any
            user = { userId: payload.userId, username: payload.username }
            return { ...user } //IMPORTANT:don't return values in onConnect as variables but as a object
          } catch (err) {
            try {
              const payload = verify(authToken.Rtoken, SECRET) as any
              user = { userId: payload.userId, username: payload.username }
              return { ...user } //IMPORTANT
            } catch (err) {
              throw new Error('not authenticated')
            }
          }
        }
        return null
      },
      onDisconnect: () => console.log('disconnect'),
    },
    schema: await buildSchema({
      resolvers: [
        UserResolver,
        TeamResolver,
        ChannelResolver,
        MessageResolver,
        directMessage,
      ],
      validate: false,
    }),
    context: ({ req, res, connection }): MyContext => ({
      pubsub,
      req,
      res,
      SECRET,
      connection,
      DirectMessageLoader: DirectMessageLoader(),
      SECRET2,
      channelLoader: ChannelLoader(), // run the channel loader to return the dataloader
      userLoader: userLoader(),
    }),
  })
  app.use(cors({ origin: 'http://localhost:3000', credentials: true }))

  server.applyMiddleware({ app, cors: false })

  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)

  // Make sure to call listen on httpServer, NOT on app.
  httpServer.listen({ port: 4001 }, () =>
    console.log(`Server ready ${server.subscriptionsPath}`)
  )
}

main().catch((err) => {
  console.log(err)
})
