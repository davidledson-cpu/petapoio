'use client'
// Minimal toast implementation — replace with shadcn/ui toaster in production

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Toast = { id: number; message: string; type?: 'success' | 'error' | 'info' }

const ToastContext = createContext<{ toast: (msg: string, type?: Toast['type']) => void }>({
  toast: () => {},
})

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])
  let counter = 0

  const dismiss = (id: number) => setToasts(t => t.filter(x => x.id !== id))

  return (
    <ToastContext.Provider value={{
      toast: (message, type = 'info') => {
        const id = ++counter
        setToasts(t => [...t, { id, message, type }])
        setTimeout(() => dismiss(id), 4000)
      },
    }}>
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium min-w-[280px] max-w-sm animate-fade-up',
            t.type === 'success' ? 'bg-petgreen-500' : t.type === 'error' ? 'bg-red-500' : 'bg-petblue-500'
          )}>
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="flex-shrink-0 opacity-80 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
