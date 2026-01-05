/**
 * Contact Page
 * 
 * Contact page with contact form and information.
 */

import Head from 'next/head'
import Layout from '@/components/layout/Layout'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', message: '' })
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <Head>
        <title>Contact - La fabrique à poster</title>
        <meta
          name="description"
          content="Contactez-nous pour toute question sur nos posters personnalisés."
        />
      </Head>

      <Layout>
        <section className="py-16 bg-secondary">
          <div className="container-custom max-w-3xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Contactez-nous
              </h1>
              <p className="text-lg text-gray-600">
                Une question ? Une demande particulière ? N'hésitez pas à nous écrire.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="card">
                <h2 className="text-2xl font-semibold text-primary mb-4">Informations de contact</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Email</h3>
                    <a
                      href="mailto:contact@lafabriqueaposter.fr"
                      className="text-accent hover:underline"
                    >
                      contact@lafabriqueaposter.fr
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-2xl font-semibold text-primary mb-4">Horaires</h2>
                <div className="space-y-2 text-gray-600">
                  <p>Lundi - Vendredi : 9h - 18h</p>
                  <p>Samedi : 10h - 16h</p>
                  <p>Dimanche : Fermé</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold text-primary mb-6">Envoyez-nous un message</h2>
              
              {submitted ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primary mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-primary mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input"
                      placeholder="Votre message..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full md:w-auto">
                    Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
