import { SmallAddIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  GridProps,
  Heading,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react'
import { default as NextLink } from 'next/link'
import React, { MouseEventHandler } from 'react'
import { Channel as Channels, User } from '../generated/graphql'

// interface ChannelProps extends GridProps {
//   teamName: string
//   channels: Channels[]
//   users: Users[]
//   username: string
// }

type ChannelProps = GridProps & {
  teamName: string
  channels: Channels[]
  users: User[]
  username: string
  toOpen: MouseEventHandler<SVGElement>
  teamId: number
  onInvite: MouseEventHandler<HTMLAnchorElement>
  isOwner: boolean
  toDirectMessage: MouseEventHandler<SVGElement>
}
const channel = ({ id, name }, teamId) => (
  <NextLink href={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
    <ListItem padding="2px" _hover={{ bgColor: '#3e313c' }} paddingLeft="10px">
      # {name}
    </ListItem>
  </NextLink>
)

const Bubble = (on: boolean) =>
  on ? (
    <Box display="inline" color="#38978d">
      ●
    </Box>
  ) : (
    '○'
  )

const user = ({ id, username }, teamId: number) => (
  <NextLink href={`/view-team/user/${teamId}/${id}`} key={`user-${id}`}>
    <ListItem
      padding="2px"
      marginLeft="0px"
      paddingLeft="0px"
      _hover={{ bgColor: '#3e313c' }}
    >
      {Bubble(false)}
      {username}
    </ListItem>
  </NextLink>
)
export const Channel: React.FC<ChannelProps> = ({
  teamName,
  channels,
  users,
  username,
  teamId,
  toOpen,
  onInvite,
  isOwner,
  toDirectMessage,
  ...props
}) => {
  return (
    <Box {...props}>
      <Box paddingLeft="10px">
        <Heading color="#fff" fontSize="20px">
          {teamName}
        </Heading>
        {username}
      </Box>
      <Box marginTop="10px">
        <UnorderedList
          width="100%"
          listStyleType="none"
          marginLeft="0px"
          paddingLeft="0px"
        >
          <Flex alignItems="center">
            <ListItem paddingLeft="10px" marginRight="10px">
              Channels
            </ListItem>
            {isOwner && (
              <SmallAddIcon
                onClick={toOpen} // on click needs callback and not run toOpen()
                borderRadius="50%"
                bgColor="#958993"
                color="#4e3a4c"
              />
            )}
          </Flex>
          {channels ? channels.map((c) => channel(c, teamId)) : null}
        </UnorderedList>
      </Box>
      <Box>
        <UnorderedList
          width="100%"
          listStyleType="none"
          marginLeft="0px"
          paddingLeft="10px"
          marginTop="10px"
        >
          <ListItem>
            Direct Message
            <SmallAddIcon
              ml={2}
              onClick={toDirectMessage} // on click needs callback and not run toOpen()
              borderRadius="50%"
              bgColor="#958993"
              color="#4e3a4c"
            />
          </ListItem>
          {users ? users.map((u) => user(u, teamId)) : null}
        </UnorderedList>
      </Box>
      {isOwner && (
        <Box mt={4}>
          <a href="#invite-people" onClick={onInvite}>
            + Invite People
          </a>
        </Box>
      )}
    </Box>
  )
}
