import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useCreateUserMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { withApollo } from '../utils/withApollo'

const Register: React.FC<{}> = ({}) => {
  const [register] = useCreateUserMutation()
  const router = useRouter()

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '', username: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: {
              options: values,
            },
          })
          if (response.data?.createUser.errors) {
            console.log(toErrorMap(response.data.createUser.errors))
            setErrors(toErrorMap(response.data.createUser.errors))
          } else if (response.data?.createUser.user) {
            router.replace('/login')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="username"
            />
            <Box mt={4}>
              <InputField name="email" placeholder="email" label="email" />
            </Box>
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
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}
export default withApollo({ ssr: false })(Register)
