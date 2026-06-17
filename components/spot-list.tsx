"use client"

import { Anchor, Search, Star } from "lucide-react"
import { SPOTS, KATEGORI_LABEL, type SpotCategory } from "@/lib/fishing-data"
import { cn } from "@/lib/utils"

const CATEGORY_DOT: Record<SpotCategory, string> = {
  karang: "bg-[#f2b134]",
  "drop-off": "bg-[#4ea8de]",
  tubiran: "bg-[#56cc9d]",
  muara: "bg-[#f2784b]",
  rumpon: "bg-[#e0e0e0]",
}

export default function SpotList({
  selectedId,
  onSelect,
  query,
  onQuery,
  filter,
  onFilter,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
  query: string
  onQuery: (q: string) => void
  filter: SpotCategory | "semua"
  onFilter: (f: SpotCategory | "semua") => void
}) {
  const filtered = SPOTS.filter((s) => {
    const matchQuery = s.nama.toLowerCase().includes(query.toLowerCase())
    const matchFilter = filter === "semua" || s.kategori === filter
    return matchQuery && matchFilter
  })

  const filters: (SpotCategory | "semua")[] = [
    "semua",
    "drop-off",
    "tubiran",
    "karang",
    "rumpon",
    "muara",
  ]

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2 rounded-md border border-input bg-input/40 px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Cari fishing ground..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Cari fishing ground"
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => onFilter(f)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted",
              )}
            >
              {f === "semua" ? "Semua" : KATEGORI_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">Tidak ada spot ditemukan.</li>
        )}
        {filtered.map((spot) => (
          <li key={spot.id}>
            <button
              onClick={() => onSelect(spot.id)}
              className={cn(
                "flex w-full items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors hover:bg-secondary/60",
                selectedId === spot.id && "bg-secondary",
              )}
            >
              <span
                className={cn(
                  "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
                  CATEGORY_DOT[spot.kategori],
                )}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-foreground">
                    {spot.nama}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-primary">
                    <Star className="h-3 w-3 fill-primary" aria-hidden />
                    {spot.rating.toFixed(1)}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Anchor className="h-3 w-3" aria-hidden />
                    {spot.kedalaman} m
                  </span>
                  <span>{KATEGORI_LABEL[spot.kategori]}</span>
                </span>
                <span className="mt-1 block truncate text-xs text-muted-foreground/80">
                  {spot.targetIkan.join(" · ")}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
