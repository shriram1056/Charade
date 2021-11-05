import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMeQuery } from '../generated/graphql'

export const useIsAuth = () => {
  const [{ data, fetching }] = useMeQuery() // urql caching, so this wont make another request
  const router = useRouter()
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace('/login?next=' + router.pathname)
    }
  }, [fetching, data, router])
}
