import redis from 'redis'

let redisClient: redis.RedisClient

if (!process.env.TS_NODE_ENV) {
  redisClient = redis.createClient(6379, 'redis') // this is for the docker version.
} else {
  redisClient = redis.createClient(6379, 'localhost') // make sure that you have installed redis locally!
}

export const getOrSetCache = (
  key: string,
  cb: () => Promise<any>,
  cache: boolean = true,
  cacheTime: number = 15,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, data) => {
      if (err) return reject(err)
      if (data != null) {
        // console.log(`Cache hit. cacheTime: ${cacheTime}`)
        return resolve(JSON.parse(data))
      }
      // console.log(`Cache miss.`)

      try {
        const newData = await cb()

        // Redis throws errors if storing undefined
        if (cache && typeof newData !== 'undefined') {
          redisClient.setex(key, cacheTime, JSON.stringify(newData), (err, reply) => {
            if (err) console.log(err)
          })
        }

        resolve(newData)
      } catch (err: any) {
        // forward errors in user callback code ;)
        reject(err)
      }
    })
  })
}
