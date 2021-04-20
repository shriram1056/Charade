import { Box, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Waypoint } from 'react-waypoint'
import {
  NewDirectMessageDocument,
  useDirectMessageQuery,
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
  teamId: number
  receiverId: number
}

export const DirectMessage: React.FC<MessageProps> = ({
  teamId,
  receiverId,
}) => {
  const { data, loading, subscribeToMore, fetchMore } = useDirectMessageQuery({
    variables: {
      receiverId,
      teamId,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    // this starts the subscription
    let unsubscribe = subscribeToMore({
      document: NewDirectMessageDocument,
      variables: { receiverId, teamId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev
        }
        //@ts-ignore
        const { newDirectMessage } = subscriptionData.data
        // prev is a data with __typename and Message
        let newData = {
          ...prev,
          Messages: {
            ...prev.DirectMessages,
            Messages: [newDirectMessage, ...prev.DirectMessages.Messages],
          },
          //FUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUCK!!!!!!!!!!!!!!!!!!!!!!!!!!!!1. DON'T FORGET TO CHANGE THE DirectMessages FIELD NAME ACCORDING TO YOUR NEEDS
        }
        return newData
      },
    })
    if (unsubscribe) {
      return () => unsubscribe() // this function will execute when the component gets disassociated.
    }
  }, [subscribeToMore, receiverId, teamId])
  if (loading) {
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
      <Box display="flex" flexDirection="column">
        {' '}
        {/* column-reverse: to have new messages in the front
        overFlowY: for scroll bar */}
        {data?.DirectMessages
          ? data.DirectMessages.Messages.slice()
              .reverse()
              .map((u, i) => (
                <Box mb={4} key={`directMessage-${u.id}`}>
                  <Box
                    fontSize="19px"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                  >
                    {u.sender.username}
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
                  {i === 10 && data.DirectMessages.hasMore ? (
                    <Waypoint
                      onEnter={() => {
                        console.log(i)
                        return fetchMore({
                          variables: {
                            receiverId,
                            teamId,
                            cursor:
                              data.DirectMessages.Messages[
                                data.DirectMessages.Messages.length - 1
                              ].createdAt,
                          },
                        })
                      }}
                    />
                  ) : null}
                </Box>
              ))
          : null}
      </Box>
    </Box>
  )
}
