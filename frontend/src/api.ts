import { AppType } from '../../backend/src'
import { hc } from 'hono/client'

export const api = hc<AppType>(import.meta.env.VITE_API_URL, {
  // headers: {
  //   Authorization: 'Bearer ' + localStorage.getItem('token')
  // }
})
