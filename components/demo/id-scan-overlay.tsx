"use client"

import { ScanLine, Sparkles } from "lucide-react"

type IdScanOverlayProps = {
  scanningLabel: string
}

export function IdScanOverlay({ scanningLabel }: IdScanOverlayProps) {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />
      <div className="id-scan-line absolute right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_2px] shadow-primary/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/25">
        <Sparkles className="size-6 animate-pulse text-white" />
        <p className="text-sm font-medium text-white drop-shadow-sm">
          {scanningLabel}
        </p>
        <ScanLine className="size-5 animate-pulse text-white/80" />
      </div>
    </div>
  )
}
