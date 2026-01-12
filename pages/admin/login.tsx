/**
 * Admin Login Page
 * 
 * Simple password-protected admin login.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (username === 'admin' && password === 'admin') {
      // Store admin session in localStorage
      sessionStorage.setItem('admin_authenticated', 'true')
      sessionStorage.setItem('admin_login_time', Date.now().toString())
      router.push('/admin')
    } else {
      setError('Identifiants incorrects')
    }
  }

  return (
    <>
      <Head>
        <title>Admin - Connexion</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary to-primary-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center text-primary-700 mb-8">
            Administration
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Utilisateur
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full">
              Se connecter
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
