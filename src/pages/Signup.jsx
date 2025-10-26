import React from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export default function Signup(){
  const [params] = useSearchParams()
  const initialRole = params.get('role') || ''
  const [username, setUsername] = React.useState('')
  const [role, setRole] = React.useState(initialRole)
  const auth = useAuth()
  const nav = useNavigate()

  const submit = (e) =>{
    e.preventDefault()
    auth.login({username, role})
    nav(role === 'seller' ? '/farmer' : '/buyer')
  }

  return (
    <div className="card max-w-md">
      <h2 className="text-xl font-bold">Sign Up</h2>
      <form onSubmit={submit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm">Choose Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="type any name" required className="mt-1 w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block text-sm">Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)} required className="mt-1 w-full p-2 border rounded">
            <option value="seller">Farmer / Seller</option>
            <option value="buyer">Buyer / Processor</option>
          </select>
        </div>

        <div>
          <button className="btn w-full" type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  )
}
