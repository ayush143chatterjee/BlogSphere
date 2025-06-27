import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Chatbot" : "Open Chatbot"}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-300 transform
          ${
            isOpen
              ? "bg-red-500 hover:bg-red-600 rotate-90"
              : "bg-cyan-500 hover:bg-cyan-600 hover:scale-110"
          }
          text-white z-50 focus:outline-none`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chatbot Container */}
      <div
        className={`fixed bottom-24 right-6 w-[90vw] max-w-[400px] h-[70vh] max-h-[600px] 
        transition-all duration-300 transform
        ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        } z-40 bg-white rounded-2xl shadow-2xl border border-cyan-500/20 overflow-hidden`}
      >
        {/* Chatbot Iframe */}
        {isOpen && (
          <iframe
            src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2025/03/07/09/20250307090901-BVG2RHOJ.json"
            className="w-full h-full"
            title="Chatbot"
            allow="microphone;"
          />
        )}
      </div>
    </>
  );
}

export default Chatbot;