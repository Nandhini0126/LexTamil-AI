export default function LoadingDots() {
  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce" />
      <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:120ms]" />
      <span className="h-2 w-2 rounded-full bg-violet-600 animate-bounce [animation-delay:240ms]" />
      <span className="ml-2">Thinking...</span>
    </div>
  )
}