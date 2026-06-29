export default function About() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto w-full">
      {/* Left Column: Structured Paragraphs */}
      <div className="space-y-6 ui-card rounded-3xl p-6 md:p-8">
        <h2 className="text-4xl md:text-5xl font-bold gradient-text">About Lextamil AI</h2>
        
        <p className="text-slate-300 leading-relaxed text-base md:text-lg">
          Lextamil AI is a pioneering, Tamil-focused legal information platform designed to make legal knowledge accessible, clear, and actionable. We bridge the gap between complex legal terminology and everyday citizens, offering an intelligent assistant that understands conversational queries in Tamil, English, or a mix of both (Tanglish).
        </p>

        <p className="text-slate-300 leading-relaxed text-base md:text-lg">
          Our system features advanced voice-enabled interaction and a highly efficient retrieval-based answering framework. Instead of relying on generative AI guesses, Lextamil AI scans verified legal corpuses to retrieve precise source materials, matching them with user queries to generate reliable, source-backed summaries.
        </p>

        <p className="text-slate-300 leading-relaxed text-base md:text-lg">
          Designed with safety and transparency at its core, the platform automatically flags or refuses ambiguous inputs and highlights exact citation materials. By integrating Tamil speech recognition and lightning-fast local indexing, it delivers legal context and drafts in seconds.
        </p>

        <p className="text-slate-300 leading-relaxed text-base md:text-lg">
          Our mission is to democratize legal information across Tamil Nadu. We strive to be the ultimate companion for users seeking simple, transparent, and responsive legal reference materials, empowering them to make better-informed decisions.
        </p>
      </div>

      {/* Right Column: Premium Glowing Animation */}
      <div className="flex justify-center items-center p-4">
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
          {/* Animated Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Premium Animated SVG scale and AI network */}
          <svg
            className="w-full h-full relative z-10 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Pulsing Neural/Digital Network Background */}
            <g className="animate-pulse">
              <circle cx="100" cy="40" r="3" fill="#2dd4bf" />
              <circle cx="50" cy="100" r="3" fill="#6366f1" />
              <circle cx="150" cy="100" r="3" fill="#6366f1" />
              <circle cx="100" cy="170" r="3" fill="#2dd4bf" />
              
              <line x1="100" y1="40" x2="50" y2="100" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="100" y1="40" x2="150" y2="100" stroke="rgba(99, 102, 241, 0.25)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="50" y1="100" x2="100" y2="170" stroke="rgba(45, 212, 191, 0.25)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="150" y1="100" x2="100" y2="170" stroke="rgba(45, 212, 191, 0.25)" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="50" y1="100" x2="150" y2="100" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" />
            </g>

            {/* Glowing Rings (Rotating slowly) */}
            <circle
              cx="100"
              cy="105"
              r="75"
              stroke="url(#glowGradient)"
              strokeWidth="1.5"
              strokeDasharray="10 30"
              className="origin-center animate-[spin_40s_linear_infinite]"
            />
            <circle
              cx="100"
              cy="105"
              r="65"
              stroke="url(#glowGradientInverse)"
              strokeWidth="1"
              strokeDasharray="5 15"
              className="origin-center animate-[spin_20s_linear_infinite]"
            />

            {/* Justice Scale - Stand */}
            <path
              d="M100 65 V145"
              stroke="url(#metalGradient)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Stand Base */}
            <path
              d="M80 145 H120"
              stroke="url(#metalGradient)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M70 151 H130"
              stroke="url(#metalGradient)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Balance Beam (Swaying gently) */}
            <g className="origin-[100px_70px] animate-[bounce_4s_ease-in-out_infinite] [animation-delay:-2s]">
              {/* Main Beam */}
              <path
                d="M50 75 L150 75"
                stroke="url(#metalGradient)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Center Pivot */}
              <circle cx="100" cy="70" r="6" fill="#6366f1" />
              <circle cx="100" cy="70" r="3" fill="#2dd4bf" />

              {/* Left Pan Chains & Bowl */}
              <g className="origin-[50px_75px] animate-[bounce_3s_ease-in-out_infinite]">
                <line x1="50" y1="75" x2="35" y2="110" stroke="#94a3b8" strokeWidth="1" />
                <line x1="50" y1="75" x2="65" y2="110" stroke="#94a3b8" strokeWidth="1" />
                <path
                  d="M30 110 C30 120 70 120 70 110"
                  fill="url(#goldGradient)"
                  stroke="url(#metalGradient)"
                  strokeWidth="1.5"
                />
              </g>

              {/* Right Pan Chains & Bowl (Slight offset animation) */}
              <g className="origin-[150px_75px] animate-[bounce_3s_ease-in-out_infinite] [animation-delay:-1.5s]">
                <line x1="150" y1="75" x2="135" y2="110" stroke="#94a3b8" strokeWidth="1" />
                <line x1="150" y1="75" x2="165" y2="110" stroke="#94a3b8" strokeWidth="1" />
                <path
                  d="M130 110 C130 120 170 120 170 110"
                  fill="url(#goldGradient)"
                  stroke="url(#metalGradient)"
                  strokeWidth="1.5"
                />
              </g>
            </g>

            {/* Definitions for Gradients */}
            <defs>
              <linearGradient id="glowGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
              <linearGradient id="glowGradientInverse" x1="1" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <linearGradient id="metalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde047" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}