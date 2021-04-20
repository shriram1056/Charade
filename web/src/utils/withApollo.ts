import { ApolloClient, InMemoryCache, split } from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import cookieCutter from 'js-cookie'
import { NextPageContext } from 'next'
// this import is for forwarding the cookie
import { withApollo as createWithApollo } from 'next-apollo'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { PaginatedMessages } from '../generated/graphql'

// subscription connect as soon as i load the page.so, lazy true only reconnect it on subscription trigger
//but we also reconnect on login
export const subscriptionClient =
  typeof window !== 'undefined'
    ? new SubscriptionClient('ws://localhost:4001/subscriptions', {
        // automatic reconnect in case of connection error
        reconnect: true,
        // THE MOST IMPORTANT THING, DON'T EVER CHANGE THE VALUE OF CONNECTION PARAMS TO PLAIN OBJECT, USE FUNCTION
        //FUNCTION FETCH VALUES EVERYTIME INSTEAD OF READING NOT UPDATED COOKIE VALUE IN VARIABLES
        connectionParams: () => ({
          //object that will be available as first argument of onConnect (in server side), if passed a function - it will call it and send the return value
          authToken: {
            Rtoken: cookieCutter.get('refresh-token'),
            Atoken: cookieCutter.get('access-token'),
          },
        }),
        lazy: true,
      })
    : null

// ctx can be undefined in ssr:false, so we need optional
const createClient = (
  ctx?: NextPageContext // ctx for forwarding cookie in ssr
) => {
  const httpLink = new createUploadLink({
    uri: 'http://localhost:4001/graphql',
    credentials: 'include', //Apollo Client can include user credentials (basic auth, cookies, etc.) in the HTTP requests it makes to a GraphQL server. By default, credentials are included only if the server is hosted at the same origin as the application using Apollo Client.also, set credentials to true in cors package in express
    headers: {
      cookie:
        (typeof window === 'undefined'
          ? ctx?.req?.headers.cookie
          : undefined) || '',
    },
  })

  //WebSocket is a property that exists only in the browser
  const wsLink =
    typeof window !== 'undefined' ? new WebSocketLink(subscriptionClient) : null
  const splitLink =
    typeof window !== 'undefined'
      ? split(
          ({ query }) => {
            const definition = getMainDefinition(query)
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            )
          },
          wsLink,
          httpLink
        )
      : httpLink // this should be http link becuase in server, we use http and in client we use both http and sockets

  return new ApolloClient({
    link: splitLink, //link option, it takes precedence over the uri option (uri sets up a default HTTP link chain using the provided URL).
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            DirectMessages: {
              keyArgs: [], //// cache based on args of query
              merge(existing: any | undefined, incoming: any): any[] | null {
                if (!existing) {
                  //there won't be any cache on the first query
                  return incoming
                }
                console.log('fuck', existing, 'ddf', incoming)
                if (
                  existing.Messages[0]?.__ref === incoming.Messages[0]?.__ref
                ) {
                  return incoming
                  // when the useMessagesQuery make an another request due to fetch-policy
                  // fetch policy make sure we don't read from cache
                }
                if (
                  existing.Messages[0]?.__ref === incoming.Messages[1]?.__ref
                ) {
                  return incoming
                  // when subscription updates cache.incoming updated cache
                }
                return {
                  ...incoming,
                  Messages: [...existing.Messages, ...incoming.Messages],
                }
                //in the first query existing will be empty
              },
            },
            Messages: {
              keyArgs: [], //// cache based on args of query
              merge(
                existing: any | undefined,
                incoming: any
              ): PaginatedMessages | null {
                if (!existing) {
                  //there won't be any cache on the first query
                  return incoming
                }
                if (
                  existing.Messages[0]?.__ref === incoming.Messages[0]?.__ref
                ) {
                  return incoming
                  // when the useMessagesQuery make an another request due to fetch-policy
                  // fetch policy make sure we don't read from cache
                }
                if (
                  existing.Messages[0]?.__ref === incoming.Messages[1]?.__ref
                ) {
                  return incoming
                  // when subscription updates cache.incoming updated cache
                }
                //  console.log('fuck', existing, 'ddf', incoming)
                return {
                  ...incoming,
                  Messages: [...existing.Messages, ...incoming.Messages],
                }
                //in the first query existing will be empty
              },
            },
          },
        },
      },
    }),
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
  })
}
export const withApollo = createWithApollo(createClient)

//createWithApollo takes a ApolloClient<NormalizedCacheObject> | ((ctx?: NextPageContext) => ApolloClient<NormalizedCacheObject>); your createClient is of type (ctx: NextPageContext) => ApolloClient<NormalizedCacheObject>
