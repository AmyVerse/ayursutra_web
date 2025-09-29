import dynamic from "next/dynamic";
import { useState } from "react";
import FloatingAIButton from "./FloatingAIButton";

const ChatBot = dynamic(() => import("./ChatBot"), { ssr: false });
const MedicineSearch = dynamic(() => import("./MedicineSearch"), {
  ssr: false,
});

type Tab = "chat" | "search";

export default function AyursutraAIFloat() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("chat");

  return (
    <>
      <FloatingAIButton onClick={() => setOpen((v) => !v)} />
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[500px] max-w-[95vw] h-[650px] bg-white rounded-2xl shadow-2xl border border-emerald-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-400 text-white font-semibold">
            <span className="text-lg">Ayursutra AI</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="text-xl font-bold hover:bg-white/20 rounded px-2 py-1 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-emerald-100">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === "search"
                  ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              🔍 Medicine Search
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" && <ChatBot />}
            {activeTab === "search" && (
              <div className="h-full overflow-y-auto p-4 bg-emerald-50">
                <MedicineSearch />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
