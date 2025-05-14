export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            
          </div>
        </div>
        <p className="mt-4 text-white/70">Loading room...</p>
      </div>
    </div>
  )
}
