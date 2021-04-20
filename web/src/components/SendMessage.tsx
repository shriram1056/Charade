import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import React from 'react'
import { useAddPictureMutation } from '../generated/graphql'
import { InputField } from './InputField'
interface SendMessageProps {
  name: string
  onSubmit: Function
  onFile?: Function
  DM?: boolean
}

export const SendMessage: React.FC<SendMessageProps> = ({
  name,
  onSubmit,
  onFile,
}) => {
  const [addPicture] = useAddPictureMutation()
  const handlefile = (e) => {
    const picture = e.target.files[0]
    console.log(picture)
    if (!picture) return
    const response = onFile(picture)
    console.log(response)
  }
  return (
    <Box
      gridColumn="3"
      gridRow="3"
      backgroundColor="#e6e6e6"
      display="flex"
      alignItems="center"
    >
      <input type="file" required onChange={handlefile} />
      <Box flex="1 0">
        <Formik
          initialValues={{ message: '' }}
          onSubmit={async (values, { setErrors, setSubmitting, resetForm }) => {
            if (!values.message || !values.message.trim()) {
              //trim to remove the white spaces
              setSubmitting(false)
              return
            }
            const response = onSubmit(values.message)
            resetForm()
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box display="flex" padding="20px" paddingLeft="0">
                <InputField
                  placeholder={`message-${name}`}
                  channel={true}
                  name="message"
                  backgroundColor="#bfbfbf"
                  _placeholder={{ color: 'black' }}
                />
                <Button
                  type="submit"
                  backgroundColor="black"
                  color="white"
                  isLoading={isSubmitting}
                  //     onClick={isSubmitting ? null : toClose}
                >
                  Send
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  )
}
