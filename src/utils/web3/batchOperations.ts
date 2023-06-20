import Web3 from 'web3'

// Too many calls to the RPC will get us rate limited
// This allows us to batch multiple calls as a single request to the RPC, which
// not only will have much better performance, but it'll only count as 1 request
// to the RPC

export const executeBatchRequest = (web3: Web3, ...batchRequests: any[]) => {
  const promises: Promise<any>[] = []
  const batch = new web3.eth.BatchRequest()
  batchRequests.forEach((request: any) => {
    const promise = new Promise((resolve, reject) => {
      const previousCallback = request.callback
      request.callback = previousCallback
        ? // Call any callback as it would have normally been called
          // but return the results to the promise array
          (error: Error, data: any) => {
            if (error) reject(previousCallback(error, data))
            else resolve(previousCallback(error, data))
          }
        : // if no callback was provided, we will inject a basic
          // resolve/reject promise as the callback function
          (error: Error, data: any) => {
            if (error) reject(error)
            else resolve(data)
          }

      batch.add(request)
    })
    promises.push(promise)
  })

  batch.execute()

  return Promise.all(promises)
}

export default {
  executeBatchRequest,
}
