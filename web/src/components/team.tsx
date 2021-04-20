import { Box, GridProps, ListItem, UnorderedList } from '@chakra-ui/react'
import { default as NextLink } from 'next/link'
import React from 'react'
import { Team as Teams } from '../generated/graphql'

type TeamProps = GridProps & {
  teams: Pick<Teams, 'id' | 'name'>[]
}
const team = (
  { id, name } // get the id and add it as link
) => (
  <NextLink href={`/view-team/${id}`} key={`team-${id}`}>
    <ListItem
      height="50px"
      width="50px"
      bgColor="#676066"
      color="#fff"
      margin="auto"
      marginBottom="10px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      fontSize="24px"
      borderRadius="11px"
      _hover={{
        borderStyle: 'solid',
        borderWidth: 'thick',
        borderColor: '#767676',
      }}
    >
      {name}
    </ListItem>
  </NextLink>
)

export const Team: React.FC<TeamProps> = ({ teams, ...props }) => {
  return (
    <Box {...props}>
      <UnorderedList
        width="100%"
        listStyleType="none"
        marginLeft="0px"
        marginTop="10px"
      >
        {teams.map(team)}
        <NextLink href={`/create-team`}>
          <ListItem
            height="50px"
            width="50px"
            bgColor="#676066"
            color="#fff"
            margin="auto"
            marginBottom="10px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="24px"
            borderRadius="11px"
            _hover={{
              borderStyle: 'solid',
              borderWidth: 'thick',
              borderColor: '#767676',
            }}
          >
            +
          </ListItem>
        </NextLink>
      </UnorderedList>
    </Box>
  )
}
