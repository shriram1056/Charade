import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React from 'react'
import { useAddTeamMemberMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { InputField } from './InputField'

interface InviteProps {
  open: boolean
  toClose: any
  teamId: number
}
export const InvitePeople: React.FC<InviteProps> = ({
  open,
  toClose,
  teamId,
}) => {
  const [AddUser] = useAddTeamMemberMutation()
  return (
    <Modal onClose={toClose} isOpen={open}>
      {/*  on Close needs callback and not run toOpen() */}
      <ModalOverlay opacity="0.2" />
      <ModalContent pb={5}>
        <ModalHeader> Add People to your Team</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ email: '' }}
            onSubmit={async (values, { setErrors, setSubmitting }) => {
              const response = await AddUser({
                variables: { teamId, email: values.email },
              })
              if (response.data?.addTeamMember?.errors) {
                setErrors(toErrorMap(response.data.addTeamMember.errors))
                setSubmitting(false)
              } else if (response.data?.addTeamMember === null) {
                toClose()
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField placeholder="email" channel={true} name="email" />
                <Button
                  type="submit"
                  margin="10px auto 0 auto"
                  display="block"
                  backgroundColor="teal.300"
                  isLoading={isSubmitting}
                  // onClick={isSubmitting ? null : toClose} other teccchnique in channelForm
                >
                  add User
                </Button>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
