export default function FloatingAIButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-400 hover:from-green-700 hover:to-emerald-500 transition-all duration-200"
      style={{ boxShadow: "0 4px 24px 0 rgba(0,0,0,0.15)" }}
      aria-label="Open Ayursutra AI Chatbot"
    >
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#fff" fillOpacity="0.15" />
        <path
          d="M12 6a6 6 0 100 12 6 6 0 000-12zm0 10.5A4.5 4.5 0 1112 7.5a4.5 4.5 0 010 9z"
          fill="#fff"
        />
        <path d="M12 9.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" fill="#10b981" />
      </svg>
      <span className="text-lg tracking-wide">Ayursutra AI</span>
    </button>
  );
}
