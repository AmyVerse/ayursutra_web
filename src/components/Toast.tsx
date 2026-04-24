"use client";

import React from "react";
import { X, Bell, Calendar, CheckCircle, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { ToastData, ToastType } from "@/context/ToastContext";

interface ToastContainerProps {
  toasts: ToastData[];
  onHide: (id: string) => void;
}

export const ToastContainer = ({ toasts, onHide }: ToastContainerProps) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col space-y-4 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={() => onHide(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, onHide }: { toast: ToastData; onHide: () => void }) => {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-6 h-6 text-teal-600" />;
      case "success":
        return <CheckCircle className="w-6 h-6 text-emerald-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "info":
      default:
        return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case "appointment":
        return "bg-teal-50 border-teal-200";
      case "success":
        return "bg-emerald-50 border-emerald-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-start p-4 rounded-2xl shadow-2xl border ${getBgColor(
        toast.type
      )} animate-in slide-in-from-right fade-in duration-300 transform transition-all group hover:scale-[1.02] active:scale-[0.98]`}
      role="alert"
    >
      <div className="flex-shrink-0 pt-0.5">{getIcon(toast.type)}</div>
      
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-bold text-gray-900 font-montserrat tracking-tight">
          {toast.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 font-inter leading-relaxed">
          {toast.message}
        </p>
        
        {toast.type === "appointment" && toast.data && (
          <div className="mt-3 flex items-center space-x-3">
             <button 
                onClick={() => window.location.href = '/dashboard/doctor/appointments'}
                className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-sm"
             >
                View Details
             </button>
             <button 
                onClick={onHide}
                className="text-xs text-gray-500 font-bold hover:text-gray-700 transition-colors"
             >
                Dismiss
             </button>
          </div>
        )}
      </div>

      <button
        onClick={onHide}
        className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};
