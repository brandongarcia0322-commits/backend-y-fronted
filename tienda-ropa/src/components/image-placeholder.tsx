import { ImagePlus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  label?: string
  tone?: 'light' | 'dark'
  className?: string
  hint?: boolean
}

/**
 * Empty image drop zone. Intentionally renders NO image so the owner can drop
 * their own artwork in. Matches the brief: "el recuadro tiene que ser para yo
 * agregar la imagen".
 */
export function ImagePlaceholder({
  label = 'Agrega tu imagen',
  tone = 'light',
  className,
  hint = true,
}: Props) {
  return (
    <div
      className={cn(
        'relative flex h-full w-full items-center justify-center overflow-hidden',
        tone === 'dark' ? 'ph-texture-dark' : 'ph-texture',
        className,
      )}
      aria-label={label}
      role="img"
    >
      {hint && (
        <div
          className={cn(
            'pointer-events-none flex flex-col items-center gap-2 text-center',
            tone === 'dark' ? 'text-white/45' : 'text-ink/35',
          )}
        >
          <span
            className={cn(
              'flex size-10 items-center justify-center rounded-full border',
              tone === 'dark'
                ? 'border-white/20 bg-white/5'
                : 'border-ink/15 bg-white/50',
            )}
          >
            <ImagePlus className="size-4" />
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
            {label}
          </span>
        </div>
      )}
    </div>
  )
}
