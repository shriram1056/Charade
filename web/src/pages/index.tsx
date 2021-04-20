import { useAllUserQuery } from '../generated/graphql'
import { withApollo } from '../utils/withApollo'

const Index: React.FC<{}> = ({}) => {
  const { data, loading } = useAllUserQuery()
  return (
    <div>
      {loading
        ? 'fuck'
        : data.allUser.map((u) => <h1 key={u.id}> {u.email}</h1>)}
    </div>
  )
}
export default withApollo({ ssr: false })(Index)

//the mosst important thing never forget to diable apollo's cors
