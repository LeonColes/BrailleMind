import Redis from "ioredis"

const config = useRuntimeConfig()

const redis = new Redis({
  host: config.redis.host,
  port: Number(config.redis.port),
  password: config.redis.password,
})

export default redis