import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { InputField } from '../components/InputField'
import { Wrapper } from '../components/Wrapper'
import { useCreateTeamMutation } from '../generated/graphql'
import { toErrorMap } from '../utils/toErrorMap'
import { useIsAuth } from '../utils/useIsAuth'
import { withApollo } from '../utils/withApollo'

const CreateTeam: React.FC<{}> = ({}) => {
  const router = useRouter()
  useIsAuth() // if not aunthenticated push to login
  const [createTeam] = useCreateTeamMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ name: '' }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const response = await createTeam({
              variables: {
                name: values.name,
              },
            })
            if (response.data?.createTeam.errors) {
              console.log(toErrorMap(response.data.createTeam.errors))
              setErrors(toErrorMap(response.data.createTeam.errors))
            } else if (response.data?.createTeam.team) {
              router.push('/view-team')
            }
          } catch (err) {
            router.replace('/login')
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mt={4}>
              <InputField name="name" placeholder="name" label="name" />
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting} // show loading if is still submitting
            >
              create team
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  )
}
export default withApollo({ ssr: false })(CreateTeam)
