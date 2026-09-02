export function OnboardingProgress({ step }: { step: number }) {
  const filled = step - 1
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${index < filled ? 'bg-yellow' : 'bg-anthracite/12'}`}
        />
      ))}
    </div>
  )
}
