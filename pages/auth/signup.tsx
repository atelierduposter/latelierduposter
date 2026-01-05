/**
 * Sign Up Page
 * 
 * Displays the registration form for new users.
 */

import Head from 'next/head'
import SignUpForm from '@/components/auth/SignUpForm'
import Layout from '@/components/layout/Layout'

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Créer un compte - La fabrique à poster</title>
        <meta name="description" content="Créez votre compte pour commander vos posters" />
      </Head>
      
      <Layout>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <SignUpForm />
        </div>
      </Layout>
    </>
  )
}
