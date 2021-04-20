import React from 'react'
import { Wrapper, WrapperVariant } from './Wrapper'

interface LayoutProps {
  variant?: WrapperVariant
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  // children is the component inside wrappper like <Wrapper>children component</Wrapper>
  return (
    <>
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  )
}
