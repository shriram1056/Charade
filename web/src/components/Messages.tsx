import { Box, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Waypoint } from 'react-waypoint'
import {
  NewChannelMessageDocument,
  useMessagesQuery,
} from '../generated/graphql'

const Chats = ({ message }) => {
  const { url, text, fileType } = message
  if (url) {
    if (fileType.startsWith('image/')) {
      return <img src={url} alt="" />
    } else if (fileType === 'text/plain') {
      //@ts-ignore
      return <RenderText url={url} />
    } else if (fileType.startsWith('audio/')) {
      return (
        <div>
          <audio controls>
            <source src={url} type={fileType} />
          </audio>
        </div>
      )
    }
  }
  return <Box>{text}</Box>
}

interface MessageProps {
  channelId: number
}
// the message are received in desc order, so we slice the array to make a new copy and reverse() it. desc is because we need the latest message
export const Message: React.FC<MessageProps> = ({ channelId }) => {
  const { data, subscribeToMore, fetchMore } = useMessagesQuery({
    variables: { channelId },
    fetchPolicy: 'network-only', // instead of reading from catch. this makes a new request. this can be when user ask for Message due to re-render or page navigation.
    //when A makes a message in channel TEST and B is not in that channel. then cache won't be updated because B is not subscribed until he is in that page. that is why we make new request
    notifyOnNetworkStatusChange: true, // to update loading after the initial fetch
  })

  useEffect(() => {
    // this starts the subscription

    let unsubscribe = subscribeToMore({
      document: NewChannelMessageDocument,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        // @ts-ignore
        const { newChannelMessage } = subscriptionData.data

        // prev is a data with hasMore, incoming dont have that
        let newData = {
          ...prev,
          Messages: {
            ...prev.Messages,
            Messages: [newChannelMessage, ...prev.Messages.Messages],
          },
        }
        return newData
      },
    })
    if (unsubscribe) {
      return () => unsubscribe() // this function will execute when the component gets disassociated.
    }
  }, [subscribeToMore, channelId]) // make new subscription if channelId is changed

  if (!data) {
    return <Box>loading</Box>
  }

  return (
    <Box
      gridColumn="3"
      gridRow="2"
      backgroundColor="#e6e6e6"
      overflowY="auto"
      display="flex"
      flexDirection="column-reverse"
      pl={3}
      pt={4}
    >
      {/* column-reverse: to have new messages in the front
        overFlowY: for scroll bar */}
      <Box display="flex" flexDirection="column">
        {data.Messages.Messages.slice() // message is immuatble. so we slice
          .reverse()
          .map((u, i) => (
            <Box mb={4} key={`message-${u.id}`}>
              <Box fontSize="19px" fontFamily="sans-serif" fontWeight="bold">
                {u.user.username}
                <Text
                  ml={2}
                  display="inline"
                  fontSize="13px"
                  fontFamily="sans-serif"
                  color="#958993"
                >
                  {u.createdAt}
                </Text>
              </Box>
              <Chats message={u} />
              {i === 10 && data.Messages.hasMore ? (
                <Waypoint
                  onEnter={() => {
                    console.log(i)
                    return fetchMore({
                      variables: {
                        channelId,
                        cursor:
                          data.Messages.Messages[
                            data.Messages.Messages.length - 1
                          ].createdAt,
                      },
                    })
                  }}
                />
              ) : null}
            </Box>
          ))}
      </Box>
    </Box>
  )
}
