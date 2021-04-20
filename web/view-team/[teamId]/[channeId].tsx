import { Box, Input, ListItem, UnorderedList } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { Sidebar } from '../../src/container/Sidebar'
import { withApollo } from '../../src/utils/withApollo'

const ViewTeam = () => {
  const router = useRouter()
  return (
    <Box
      display="grid"
      height="100vh"
      gridTemplateColumns="100px 250px 1fr"
      gridTemplateRows="auto 1fr auto"
    >
      <Sidebar currentTeamId={router.query.teamId as string} />
      <Box gridColumn="3" gridRow="1" textAlign="center">
        #general
      </Box>
      <Box gridColumn="3" gridRow="2">
        <UnorderedList>
          <ListItem>Lorem ipsum dolor sit amet</ListItem>
          <ListItem>Consectetur adipiscing elit</ListItem>
        </UnorderedList>
      </Box>
      <Box gridColumn="3" gridRow="3" margin="20px">
        <Input type="text" placeholder={`Message `} />
      </Box>
    </Box>
  )
}
export default withApollo({ ssr: false })(ViewTeam)
