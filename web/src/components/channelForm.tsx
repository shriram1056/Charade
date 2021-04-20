import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import gql from 'graphql-tag'
import _ from 'lodash'
import React from 'react'
import { Channel, useCreateChannelMutation } from '../generated/graphql'
import { InputField } from './InputField'
import { MultipleUser } from './multipleUser'

interface Channelform {
  open: boolean
  toClose: any
  teamId: number
  data: any
  loading: boolean
  currentUserId: number
}
export const ChannelForm: React.FC<Channelform> = ({
  open,
  toClose,
  teamId,
  data,
  currentUserId,
  loading,
}) => {
  const [createChannel] = useCreateChannelMutation()
  return (
    <Modal onClose={() => toClose()} isOpen={open}>
      {/*  on Close needs callback and not run toOpen() */}
      <ModalOverlay opacity="0.2" />
      <ModalContent pb={5}>
        <ModalHeader>Add Channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          <Formik
            initialValues={{ channelName: '', public: true, members: [] }}
            onSubmit={async (values, { setErrors }) => {
              const usernames = values.members.map((u) => u.value)
              const response = await createChannel({
                variables: {
                  teamId: teamId,
                  name: values.channelName,
                  public: values.public,
                  members: usernames,
                },
                optimisticResponse: {
                  // this mimics the response object
                  __typename: 'Mutation',
                  createChannel: {
                    __typename: 'ChannelResponse',
                    channel: {
                      __typename: 'Channel',
                      id: -1,
                      name: values.channelName,
                      public: true,
                    },
                  },
                },
                update: (cache, { data: { createChannel } }) => {
                  // double destructure: You can destructure and assign the default value in a single statement.
                  // here the data is channelResponse
                  //data is the result of query/mutation.

                  const data = cache.readFragment<{
                    channels: Channel[]
                  }>({
                    id: 'Team:' + teamId,
                    fragment: gql`
                      fragment _ on Team {
                        channels {
                          id
                          name
                          public
                        }
                      }
                    `,
                  })
                  const writeData = _.cloneDeep(data)
                  if (writeData.channels) {
                    // if there is channel
                    writeData.channels.push(createChannel.channel)
                  } else {
                    // if there is no channel
                    writeData.channels = [createChannel.channel]
                  }
                  console.log(writeData)
                  toClose()
                  cache.writeFragment({
                    id: 'Team:' + teamId,
                    fragment: gql`
                      fragment _ on Team {
                        channels {
                          id
                          name
                          public
                        }
                      }
                    `,
                    data: writeData,
                  })
                },
              })
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <InputField
                  placeholder="channel"
                  channel={true}
                  name="channelName"
                />
                <Checkbox
                  label="private"
                  mt={2}
                  onChange={(e) => {
                    console.log(e.target.checked)
                    setFieldValue(
                      'public',
                      e.target.checked === true ? false : true
                    )
                  }}
                  mb={2}
                >
                  private
                </Checkbox>
                {!values.public ? (
                  <MultipleUser
                    currentUserId={currentUserId}
                    data={data}
                    loading={loading}
                    values={setFieldValue}
                  />
                ) : null}
                <Button
                  type="submit"
                  margin="10px auto 0 auto"
                  display="block"
                  backgroundColor="teal.300"
                  isLoading={isSubmitting}
                >
                  Create Channel
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

//Default identifier generation
// By default, the InMemoryCache generates a unique identifier for any object that includes a __typename field. To do so, it combines the object's __typename with its id or _id field (whichever is defined). These two values are separated by a colon (:).

// For example, an object with a __typename of Task and an id of 14 is assigned a default identifier of Task:14.

/*addTypename:this is enabled by default
If true, the cache automatically adds __typename fields to all outgoing queries, removing the need to add them manually. */
