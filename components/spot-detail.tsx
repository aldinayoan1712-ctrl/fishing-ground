"use client"

import { X, Waves, Wind, Thermometer, Navigation, Gauge, Star, Fish } from "lucide-react"
import { KATEGORI_LABEL, type FishingSpot } from "@/lib/fishing-data"

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border border-border bg-background/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-mono text-lg font-semibold text-foreground">{value}</div>
    </div>
  )
}

function TideChart({ data }: { data: FishingSpot["pasang"] }) {
  const w = 300
  const h = 90
  const pad = 4
  const max = Math.max(...data.map((d) => d.tinggi))
  const min = Math.min(...data.map((d) => d.tinggi))
  const range = max - min || 1
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((d.tinggi - min) / range) * (h - pad * 2)
    return [x, y]
  })
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ")
  const area = `${line} L${points[points.length - 1][0]},${h} L${points[0][0]},${h} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" role="img" aria-label="Grafik pasang surut">
      <defs>
        <linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#tideFill)" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2" />
    </svg>
  )
}

export default function SpotDetail({
  spot,
  onClose,
}: {
  spot: FishingSpot
  onClose: () => void
}) {
  const tideMax = Math.max(...spot.pasang.map((p) => p.tinggi))
  const tideMin = Math.min(...spot.pasang.map((p) => p.tinggi))

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-3 border-b border-border p-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {KATEGORI_LABEL[spot.kategori]}
            </span>
            <span className="flex items-center gap-1 text-xs text-primary">
              <Star className="h-3 w-3 fill-primary" aria-hidden />
              {spot.rating.toFixed(1)}
            </span>
          </div>
          <h2 className="mt-1.5 text-balance text-lg font-bold leading-tight text-foreground">
            {spot.nama}
          </h2>
          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
            {spot.lat.toFixed(4)}, {spot.lng.toFixed(4)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Tutup detail"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{spot.catatan}</p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Stat
            icon={<Gauge className="h-3.5 w-3.5" aria-hidden />}
            label="Kedalaman"
            value={`${spot.kedalaman} m`}
          />
          <Stat
            icon={<Thermometer className="h-3.5 w-3.5" aria-hidden />}
            label="Suhu air"
            value={`${spot.suhuAir.toFixed(1)}°C`}
          />
          <Stat
            icon={<Navigation className="h-3.5 w-3.5" aria-hidden />}
            label="Arus"
            value={`${spot.arusKnot.toFixed(1)} kn`}
          />
          <Stat
            icon={<Waves className="h-3.5 w-3.5" aria-hidden />}
            label="Gelombang"
            value={`${spot.forecast[0].tinggiGelombang.toFixed(1)} m`}
          />
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Fish className="h-4 w-4 text-primary" aria-hidden />
            Target Ikan
          </h3>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {spot.targetIkan.map((ikan) => (
              <span
                key={ikan}
                className="rounded-full border border-border bg-background/40 px-2.5 py-1 text-xs text-foreground"
              >
                {ikan}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Waves className="h-4 w-4 text-accent" aria-hidden />
              Pasang Surut (24 jam)
            </h3>
            <span className="font-mono text-xs text-muted-foreground">
              {tideMin.toFixed(1)}–{tideMax.toFixed(1)} m
            </span>
          </div>
          <div className="mt-2 rounded-md border border-border bg-background/40 p-2">
            <TideChart data={spot.pasang} />
            <div className="flex justify-between px-1 font-mono text-[10px] text-muted-foreground">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Wind className="h-4 w-4 text-accent" aria-hidden />
            Prakiraan Angin &amp; Gelombang
          </h3>
          <div className="mt-2 overflow-hidden rounded-md border border-border">
            <table className="w-full text-left">
              <thead className="bg-secondary/60 text-xs text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Jam</th>
                  <th className="px-3 py-2 font-medium">Arah</th>
                  <th className="px-3 py-2 text-right font-medium">Angin</th>
                  <th className="px-3 py-2 text-right font-medium">Gelombang</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs">
                {spot.forecast.map((f, i) => (
                  <tr key={f.jam} className={i % 2 ? "bg-background/30" : ""}>
                    <td className="px-3 py-1.5 text-foreground">{f.jam}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{f.arah}</td>
                    <td className="px-3 py-1.5 text-right text-foreground">
                      {f.kecepatanAngin.toFixed(1)} kn
                    </td>
                    <td className="px-3 py-1.5 text-right text-foreground">
                      {f.tinggiGelombang.toFixed(1)} m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
