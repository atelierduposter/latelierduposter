/**
 * Progress Bar Component
 * 
 * Shows the current step in the customization process.
 */

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export default function ProgressBar({ currentStep, totalSteps, steps }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                index + 1 <= currentStep
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1 < currentStep ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <p
              className={`mt-2 text-xs text-center max-w-[100px] ${
                index + 1 <= currentStep ? 'text-primary-700 font-medium' : 'text-gray-500'
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  )
}
