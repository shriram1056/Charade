import { Box } from '@chakra-ui/react'
export type WrapperVariant = 'small' | 'regular'

interface WrapperProps {
  variant?: 'small' | 'regular'
}

export const Wrapper: React.FC<WrapperProps> = ({
  children, // children is the component inside wrappper like <Wrapper>children component</Wrapper>
  variant = 'regular',
}) => {
  return (
    <Box // this is a div or base for all chakra component
      maxW={variant === 'regular' ? '800px' : '400px'}
      w="100%"
      mt={8}
      mx="auto"
    >
      {children}
    </Box>
  )
}
