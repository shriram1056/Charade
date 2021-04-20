// didn't handle the case for no team

import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { Message } from '../../components/Messages'
import { SendMessage } from '../../components/SendMessage'
import { Sidebar } from '../../container/Sidebar'
import {
  useCreateMessageMutation,
  useGetUserQuery,
} from '../../generated/graphql'
import { withApollo } from '../../utils/withApollo'

const ViewTeam = () => {
  let teamId, channelId
  const router = useRouter()
  if (router.query.id) {
    teamId = parseInt(router.query.id[0]) // in initial render this will be undefined
    channelId = parseInt(router.query.id[1])
  }

  const [createMessage] = useCreateMessageMutation()
  const { data, loading } = useGetUserQuery({ fetchPolicy: 'network-only' }) // disable caching because we could be invited by other user which don't reflect in cache

  if (loading) {
    return <Box>loading</Box>
  }
  console.log(data)
  const {
    getUser: { team: teams, id: currentUserId },
  } = data // direct destructing of data cause error

  const Idx = teamId ? teams.indexOf(teams.find((u) => u.id === teamId)) : 0

  const Team = Idx === -1 ? teams[0] : teams[Idx] // Idx is -1 if there is no item in allteam with the given ID.
  const channelIdx = channelId
    ? Team.channels.indexOf(Team.channels.find((u) => u.id === channelId))
    : 0
  let Channel = channelIdx === -1 ? Team.channels[0] : Team.channels[channelIdx]

  return (
    <Box
      display="grid"
      height="100vh"
      gridTemplateColumns="100px 250px 1fr"
      gridTemplateRows="auto 1fr auto"
    >
      <Sidebar
        currentUserId={currentUserId}
        username={data.getUser.username}
        Team={Team}
        AllTeams={teams}
      />
      {Channel && (
        <Box
          gridColumn="3"
          gridRow="1"
          textAlign="center"
          backgroundColor="#e6e6e6"
        >
          #{Channel.name}
        </Box>
      )}
      {Channel && <Message channelId={Channel.id} />}
      {Channel && (
        <SendMessage
          name={Channel.name}
          onFile={async (file) =>
            await createMessage({
              variables: { channelId: Channel.id, file },
            })
          }
          onSubmit={async (text) =>
            await createMessage({
              variables: { channelId: Channel.id, text },
            })
          }
        />
      )}
    </Box>
  )
}
export default withApollo({ ssr: false })(ViewTeam)

// [[...test]]  collect everything after base path and turn it into an array
