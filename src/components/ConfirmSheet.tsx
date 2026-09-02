'use client'

interface ConfirmSheetProps {
  open: boolean
  title: string
  text?: string
  confirmLabel?: string
  cancelLabel?: string
  /** true = roter Bestätigen-Button (destruktiv), false = gelb (neutral) */
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Einheitliches Bottom-Sheet für Bestätigungen — ersetzt native confirm()-Dialoge.
 * Gleicher Stil wie die Sheets im Aufmaß-Flow (Griff oben, Titel, Text, zwei Buttons).
 */
export function ConfirmSheet({
  open,
  title,
  text,
  confirmLabel = 'Bestätigen',
  cancelLabel = 'Abbrechen',
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-3xl px-5 pt-4 pb-10 md:pb-6 shadow-2xl">
        <div className="flex justify-center mb-4 md:hidden"><div className="w-10 h-1 rounded-full bg-anthracite/20" /></div>
        <h2 className="font-syne font-extrabold text-anthracite text-[20px] mb-2">{title}</h2>
        {text && (
          <p className="text-anthracite/50 font-semibold text-[14px] mb-6 leading-relaxed">{text}</p>
        )}
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full rounded-2xl py-4 font-extrabold text-[16px] active:scale-[0.98] transition-all ${
              destructive ? 'bg-red-500 text-white' : 'bg-yellow text-anthracite'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full border-2 border-anthracite/15 text-anthracite/60 rounded-2xl py-3.5 font-extrabold text-[14px]"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
