import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { apiRoute } from '@/routes/api'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(
  '/*',
  cors({
    origin: '*'
  })
)

const indexRouter = new Hono()

indexRouter.get('/', (c) => {
  return c.json({ message: 'Hello, World!' })
})

const router = app.route('/', indexRouter).route('/api', apiRoute)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

export type AppType = typeof router
