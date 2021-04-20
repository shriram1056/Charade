import { MiddlewareFn } from 'type-graphql'
import { Channel } from '../entities/channel'
import { TeamMember } from '../entities/member'
import { MyContext } from '../types/types'

// context is not user defined, it's type is defined in resolver.d.ts
export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  if (!context.req.userId) {
    throw new Error('not authenticated')
  }

  return next()
}
export const isSubscriptionAuth: MiddlewareFn<MyContext> = async (
  { context: { connection }, args: { channelId } },
  next
) => {
  console.log('adadsdasdas', connection?.context)
  if (!connection?.context?.userId) {
    throw new Error('not authenticated')
  }
  const channel = await Channel.findOne({ where: { id: channelId } })
  const member = await TeamMember.findOne({
    // @ts-ignore
    where: { teamId: channel.teamId, userId: connection.context.userId },
  })
  console.log(member)
  if (!member) {
    throw new Error(
      "You have to be a member of the team to subcribe to it's messages"
    )
  }
  return next()
}

/*useMiddleWare.d.ts

export declare function UseMiddleware(middlewares: Array<Middleware<any>>): MethodAndPropDecorator;
this is array of middleware


export declare function UseMiddleware(...middlewares: Array<Middleware<any>>): MethodAndPropDecorator;
this uses rest operator to make an array from function

*/

/*middleware.d.ts: we can pass function or class middleware


function middleware

export declare type NextFn = () => Promise<any>;
export declare type MiddlewareFn<TContext = {}> = (action: ResolverData<TContext>, next: NextFn) => Promise<any>;


class middleware is complex don't use

export declare type Middleware<TContext = {}> = MiddlewareFn<TContext> | MiddlewareClass<TContext>;
*/

/*ResolverData.d.ts

export interface ResolverData<ContextType = {}> {
    root: any;
    args: ArgsDictionary;
    context: ContextType;
    info: GraphQLResolveInfo;
}

*/
