import {
  Box,
  Button,
  Input,
  InputProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import Downshift from 'downshift'
import { useRouter } from 'next/router'
import React, { Ref } from 'react'

interface Channelform {
  open: boolean
  toClose: any
  data: any
  loading: boolean
  teamId: number
}
interface GetInputPropsOptionsRef extends InputProps {
  ref?: Ref<HTMLInputElement>
}

export const DirectMessageForm: React.FC<Channelform> = ({
  open,
  toClose,
  loading,
  data,
  teamId,
}) => {
  const router = useRouter()
  if (loading) {
    return null
  }
  const { getTeamMembers } = data
  return (
    <Modal onClose={toClose} isOpen={open}>
      {/*  on Close needs callback and not run toOpen() */}
      <ModalOverlay opacity="0.2" />
      <ModalContent pb={5}>
        <ModalHeader>Search Users</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!loading && (
            <Downshift
              onChange={(selectedUser) => {
                router.push(`/view-team/user/${teamId}/${selectedUser.id}`)
                toClose()
              }}
            >
              {({
                getInputProps,
                getItemProps,
                getLabelProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
                getRootProps,
              }) => (
                <Box {...getRootProps()}>
                  {/* IMPORTANT DON'T REMOVE GET ROOT PROPS */}
                  <Input
                    {...(getInputProps() as GetInputPropsOptionsRef)}
                    name="DirectMessage"
                    id="DirectMessage"
                    type="text"
                    placeholder="search user"
                  />
                  {isOpen ? (
                    <Box style={{ border: '1px solid #ccc' }}>
                      {getTeamMembers
                        .filter(
                          (i) =>
                            !inputValue ||
                            i.username
                              .toLowerCase()
                              .includes(inputValue.toLowerCase())
                        )
                        .map((item, index) => (
                          <Box
                            {...getItemProps({ item: item })}
                            //this is the item data that will be selected when the user selects a particular item.
                            key={item.id}
                            style={{
                              backgroundColor:
                                highlightedIndex === index ? 'gray' : 'white',
                              fontWeight:
                                selectedItem === item ? 'bold' : 'normal',
                            }}
                          >
                            {item.username}
                          </Box>
                        ))}
                    </Box>
                  ) : null}
                </Box>
              )}
            </Downshift>
          )}
          <Button
            type="submit"
            margin="10px auto 0 auto"
            display="block"
            backgroundColor="teal.300"
            onClick={toClose}
          >
            close
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

{
  /* <Downshift
    onChange={selection =>
      alert(selection ? `You selected ${selection.value}` : 'Selection Cleared')
    }
    itemToString={item => (item ? item.value : '')}
  >
    {({
      getInputProps,
      getItemProps,
      getLabelProps,
      getMenuProps,
      isOpen,
      inputValue,
      highlightedIndex,
      selectedItem,
      getRootProps,
    }) => (
      <div>
        <label {...getLabelProps()}>Enter a fruit</label>
        <div
          style={{display: 'inline-block'}}
          {...getRootProps({}, )}
        >
          <input {...getInputProps()} />
        </div>
        
      </div>
    )}
  </Downshift> */
}
