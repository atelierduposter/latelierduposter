/**
 * How It Works Component
 * 
 * Section displaying 3 steps with icons/placeholders and short text.
 * Explains the process of creating a custom poster.
 */

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Choisissez votre image',
      description: 'Sélectionnez une image dans notre galerie ou uploadez votre propre photo.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Personnalisez',
      description: 'Ajoutez du texte personnalisé et choisissez votre police de caractères préférée.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'Commandez et recevez',
      description: 'Passez commande, notre équipe transforme votre image et vous la livre à votre adresse sous 5-7 jours.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ]

  return (
    <section className="py-16 bg-secondary">
      <div className="container-custom">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-700 mb-12">
          Comment ça marche ?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-primary-700 mb-3">
                {step.number}. {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
