import { Hono } from 'hono'
import { prisma } from '@/db'
import { zValidator } from '@hono/zod-validator'
import z from 'zod'
const api = new Hono()

export const apiRoute = api
  .post(
    '/hello',
    zValidator(
      'json',
      z.object({
        name: z.string()
      })
    ),
    async (c) => {
      const validated = c.req.valid('json')
      // const query = c.req.query()
      // const params = c.req.param('ok)
      // const headers = c.req.header('content-type')
      // const users = prisma.user.findMany()
      // const user = prisma.user.findUnique({ where: { id: '1' } })
      // prisma.user.create({
      //   data: {
      //     email: ''
      //   }
      // })
      c.header('content-type', 'application/json')
      return c.json({ message: `Hello from the API! ${validated.name}` })
    }
  )
  .get('/hello', async (c) => {
    return c.json({ message: 'Hello from the API!' })
  })
