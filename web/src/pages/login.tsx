import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { MessageTypes } from 'subscriptions-transport-ws'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useLoginMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { subscriptionClient, withApollo } from '../utils/withApollo'

const Login: React.FC<{}> = ({}) => {
  const router = useRouter()
  const [login] = useLoginMutation()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: {
              email: values.email,
              password: values.password,
            },
          })
          if (response.data?.Login.errors) {
            console.log(toErrorMap(response.data.Login.errors))
            setErrors(toErrorMap(response.data.Login.errors))
          } else if (response.data?.Login.user) {
            // Close socket connection which will also unregister subscriptions on the server-side.
            subscriptionClient.close()

            // Reconnect to the server.
            //@ts-ignore
            subscriptionClient.connect()

            // Reregister all subscriptions.
            Object.keys(subscriptionClient.operations).forEach((id) => {
              //@ts-ignore
              subscriptionClient.sendMessage(
                id,
                MessageTypes.GQL_START,
                subscriptionClient.operations[id].options
              )
            })
            if (typeof router.query.next === 'string') {
              router.replace(router.query.next)
            }
            router.replace('/view-team')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" placeholder="email" label="email" />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting} // show loading if is still submitting
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}
export default withApollo({ ssr: false })(Login)
