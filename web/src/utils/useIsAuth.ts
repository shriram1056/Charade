import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMeQuery } from '../generated/graphql'

export const useIsAuth = () => {
  const { data, loading } = useMeQuery()
  //after loading is set to false both data or error is retrieved
  console.log(data)
  const router = useRouter()
  useEffect(() => {
    if (!data?.me && !loading) {
      router.push('/login?next=' + router.pathname) // give current path name. '?' is the symbol for query, can be accessed by router.query.next
    }
  }, [data, loading])
  //runs after the data or loading are assigned.but both data and loading are assigned at the same time
}
