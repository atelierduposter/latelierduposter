/**
 * Login Page
 * 
 * Displays the login form for user authentication.
 */

import Head from 'next/head'
import LoginForm from '@/components/auth/LoginForm'
import Layout from '@/components/layout/Layout'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Connexion - Mon Petit Poster</title>
        <meta name="description" content="Connectez-vous à votre compte" />
      </Head>
      
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      </Layout>
    </>
  )
}
