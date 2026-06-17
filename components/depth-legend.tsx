import { DEPTH_BANDS } from "@/lib/fishing-data"

export default function DepthLegend() {
  return (
    <div className="pointer-events-none absolute bottom-6 left-4 z-[500] rounded-md border border-border bg-card/90 p-3 backdrop-blur md:left-6">
      <p className="text-xs font-semibold text-foreground">Kontur Kedalaman</p>
      <div className="mt-2 flex items-center gap-0">
        {[...DEPTH_BANDS]
          .sort((a, b) => a.depth - b.depth)
          .map((band) => (
            <div key={band.depth} className="flex flex-col items-center">
              <span
                className="h-3 w-9"
                style={{ background: band.color }}
                aria-hidden
              />
              <span className="mt-1 font-mono text-[10px] text-muted-foreground">
                {band.depth}
              </span>
            </div>
          ))}
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">meter</p>
    </div>
  )
}
