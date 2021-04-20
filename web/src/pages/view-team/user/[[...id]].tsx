import { Box } from '@chakra-ui/react'
import gql from 'graphql-tag'
import _ from 'lodash'
import { useRouter } from 'next/router'
import React from 'react'
import { DirectMessage } from '../../../components/DirectMessageContainer'
import { SendMessage } from '../../../components/SendMessage'
import { Sidebar } from '../../../container/Sidebar'
import {
  useCreateDirectMessageMutation,
  useGetUserDirectQuery,
  User,
} from '../../../generated/graphql'
import { isServer } from '../../../utils/isServer'
import { withApollo } from '../../../utils/withApollo'

const ViewTeam = () => {
  let teamId, receiverId
  const router = useRouter()
  if (router.query.id) {
    teamId = parseInt(router.query.id[0]) // in initial render this will be undefined
    receiverId = parseInt(router.query.id[1])
  }
  const [createDirectMessage] = useCreateDirectMessageMutation()
  const { data, loading } = useGetUserDirectQuery({
    fetchPolicy: 'network-only',
    variables: { id: receiverId },
    skip: isServer(),
  })

  if (!data || loading) {
    return <Box>loading</Box>
  }

  const {
    getUser: { team: teams, id: currentUserId },
    User,
  } = data // direct destructing of data cause error

  const Idx = teamId ? teams.indexOf(teams.find((u) => u.id === teamId)) : 0

  const Team = Idx === -1 ? teams[0] : teams[Idx] // Idx is -1 if there is no item in allteam with the given ID.

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
      <Box
        gridColumn="3"
        gridRow="1"
        textAlign="center"
        backgroundColor="#e6e6e6"
      >
        {User.username}
      </Box>
      <DirectMessage teamId={Team.id} receiverId={receiverId} />
      <SendMessage
        name={receiverId}
        onFile={async (file) => {
          await createDirectMessage({
            variables: {
              teamId: Team.id,
              file,
              receiverId,
            },
          })
        }}
        onSubmit={async (text) => {
          await createDirectMessage({
            variables: {
              teamId: Team.id,
              text,
              receiverId,
            },
            optimisticResponse: {
              __typename: 'Mutation',
              createDirectMessages: true,
            },
            update: (cache) => {
              const data = cache.readFragment<{
                directMessageUsers: Pick<
                  User,
                  'id' | 'username' | '__typename'
                >[]
              }>({
                id: 'Team:' + Team.id,
                fragment: gql`
                  fragment _ on Team {
                    directMessageUsers {
                      id
                      username
                    }
                  }
                `,
              })
              const writeData = _.cloneDeep(data)
              if (!writeData?.directMessageUsers) {
                writeData.directMessageUsers = [
                  {
                    __typename: 'User',
                    id: receiverId,
                    username: User.username,
                  },
                ]
              }
              // for some unknown reason username changes perfectly
              const NotAnMember = writeData.directMessageUsers.every(
                (u) => u.id !== receiverId
              )
              //The every() method tests whether all elements in the array pass the test implemented by the provided function.
              if (NotAnMember && writeData.directMessageUsers) {
                // if there is channel
                writeData.directMessageUsers.push({
                  __typename: 'User',
                  id: receiverId,
                  username: User.username,
                })
                // if there is no channel
              }
              console.log(writeData)
              cache.writeFragment({
                id: 'Team:' + Team.id,
                fragment: gql`
                  fragment _ on Team {
                    directMessageUsers {
                      id
                      username
                    }
                  }
                `,
                data: writeData,
              })
            },
          })
        }}
      />
    </Box>
  )
}
export default withApollo({ ssr: false })(ViewTeam)
