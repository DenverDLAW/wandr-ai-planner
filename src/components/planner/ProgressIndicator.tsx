'use client'

interface Props {
  currentStep: number
  totalSteps: number
}

export function ProgressIndicator({ currentStep, totalSteps }: Props) {
  return (
    <div className="hidden sm:flex fixed right-6 top-1/2 -translate-y-1/2 z-20 flex-col gap-2.5">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === currentStep
              ? 'w-2 h-6 bg-blue-600'
              : i < currentStep
              ? 'w-1.5 h-1.5 bg-blue-300'
              : 'w-1.5 h-1.5 bg-gray-300'
          }`}
        />
      ))}
    </div>
  )
}
