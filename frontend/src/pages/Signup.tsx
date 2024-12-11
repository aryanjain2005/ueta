import React, { useState } from 'react'
import axios from 'axios'

const Signup: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [img, setImg] = useState('')
  const [role, setRole] = useState('user')
  const [type, setType] = useState('standard')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post('/api/auth/signup', {
        name,
        email,
        password,
        img,
        role,
        type
      })
      console.log(response.data) // Handle success
      // Reset form fields after successful submission
      setName('')
      setEmail('')
      setPassword('')
      setImg('')
      setRole('user')
      setType('standard')
    } catch (error) {
      console.error(error) // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Image URL:</label>
        <input
          type="text"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="dealer">Dealer</option>
          <option value="distributor">Distributor</option>
        </select>
      </div>
      <div>
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="standard">Standard</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  )
}

export default Signup
