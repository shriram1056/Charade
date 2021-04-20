import { useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { Channel } from '../components/channel'
import { ChannelForm } from '../components/channelForm'
import { DirectMessageForm } from '../components/DirectMessageForm'
import { InvitePeople } from '../components/InvitePeople'
import { Team as Teams } from '../components/team'
import { Team as team, useGetTeamMembersQuery } from '../generated/graphql'

interface SidebarProps {
  AllTeams: team[]
  Team: team
  username: string
  currentUserId
}
export const Sidebar: React.FC<SidebarProps> = ({
  AllTeams,
  Team,
  username,
  currentUserId,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure() // open and close modal
  const { isOpen: Open, onOpen: toOpen, onClose: Close } = useDisclosure()
  const {
    isOpen: DirectOpen,
    onOpen: toDirectOpen,
    onClose: DirectClose,
  } = useDisclosure()
  const { data, loading } = useGetTeamMembersQuery({
    variables: {
      teamId: Team.id,
    },
  })
  let isOwner = Team.admin //data.me.id === Team.ownerId
  return (
    <>
      <Teams
        gridColumn="1"
        gridRow="1 / 4"
        bg="#362234"
        color="#958993"
        teams={AllTeams.map((t) => ({
          id: t.id,
          name: t.name.charAt(0).toUpperCase(),
        }))} // map return a new array
      />

      <Channel
        onInvite={toOpen}
        gridColumn="2"
        gridRow="1 / 4"
        bg="#4e3a4c"
        color="#958993"
        teamName={Team.name}
        username={username}
        channels={Team.channels}
        teamId={Team.id}
        users={Team.directMessageUsers}
        toOpen={onOpen}
        isOwner={isOwner}
        toDirectMessage={toDirectOpen}
      />
      <ChannelForm
        currentUserId={currentUserId}
        open={isOpen}
        toClose={onClose}
        teamId={Team.id}
        data={data}
        loading={loading}
      />
      <InvitePeople open={Open} toClose={Close} teamId={Team.id} />
      <DirectMessageForm
        open={DirectOpen}
        toClose={DirectClose}
        teamId={Team.id}
        data={data}
        loading={loading}
      />
    </>
  )
}
