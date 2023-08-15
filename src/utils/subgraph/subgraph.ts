import { GraphQLClient } from 'graphql-request'
import { SubgraphError } from '../CustomErrors'

export const getDataByQuery = async ({
  client,
  query,
  variables,
}: {
  client: GraphQLClient
  query: string
  variables: object | undefined
}) => {
  const response = await client.request(query, variables)

  if (response.errors) {
    console.log(response.errors)
    throw new SubgraphError(response.errors.message)
  }

  return response
}

export default {
  getDataByQuery,
}
