"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { Compass, Anchor, MapPin, Menu, LogOut, User } from "lucide-react"
import SpotList from "@/components/spot-list"
import SpotDetail from "@/components/spot-detail"
import DepthLegend from "@/components/depth-legend"
import LoginScreen from "@/components/login-screen"
import { useAuth } from "@/components/auth-provider"
import { SPOTS, type SpotCategory } from "@/lib/fishing-data"
import { cn } from "@/lib/utils"

const FishingMap = dynamic(() => import("@/components/fishing-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full w-full place-items-center bg-[#0a1f33]">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Compass className="h-4 w-4 animate-spin" aria-hidden />
        Memuat peta laut...
      </div>
    </div>
  ),
})

export default function Page() {
  const { username, ready, logout } = useAuth()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<SpotCategory | "semua">("semua")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const selectedSpot = useMemo(
    () => SPOTS.find((s) => s.id === selectedId) ?? null,
    [selectedId],
  )

  function handleSelect(id: string) {
    setSelectedId(id)
    setSidebarOpen(false)
  }

  if (!ready) {
    return (
      <div className="grid h-dvh place-items-center bg-[#0a1f33]">
        <Compass className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
      </div>
    )
  }

  if (!username) {
    return <LoginScreen />
  }

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Top bar */}
      <header className="z-[600] flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Anchor className="h-4 w-4" aria-hidden />
          </span>
          <div className="leading-tight">
            <h1 className="text-sm font-bold tracking-tight text-foreground">SAMUDRA CHART</h1>
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Fishing Ground Navigator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-4 font-mono text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
              Desa Bongo, Batudaa Pantai
            </span>
            <span className="flex items-center gap-1.5">
              <Anchor className="h-3.5 w-3.5 text-primary" aria-hidden />
              {SPOTS.length} spot aktif
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border bg-secondary py-1 pl-2 pr-1">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
              <User className="h-3 w-3" aria-hidden />
            </span>
            <span className="max-w-[8rem] truncate text-xs font-medium text-foreground" title={username}>
              {username}
            </span>
            <button
              onClick={logout}
              className="rounded p-1 text-muted-foreground transition-colors hover:bg-card hover:text-destructive"
              aria-label="Keluar"
              title="Keluar"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-md border border-border bg-secondary p-2 text-foreground md:hidden"
            aria-label="Buka daftar spot"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Sidebar: spot list */}
        <aside
          className={cn(
            "absolute inset-y-0 left-0 z-[700] w-80 max-w-[85%] border-r border-border bg-card transition-transform md:relative md:z-0 md:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <SpotList
            selectedId={selectedId}
            onSelect={handleSelect}
            query={query}
            onQuery={setQuery}
            filter={filter}
            onFilter={setFilter}
          />
        </aside>

        {sidebarOpen && (
          <button
            className="absolute inset-0 z-[650] bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Tutup daftar"
          />
        )}

        {/* Map */}
        <main className="relative min-w-0 flex-1">
          <FishingMap selectedId={selectedId} onSelect={setSelectedId} />
          <DepthLegend />
        </main>

        {/* Detail panel */}
        {selectedSpot && (
          <aside className="absolute inset-y-0 right-0 z-[700] w-96 max-w-[90%] border-l border-border bg-card shadow-2xl md:relative md:z-0 md:w-96">
            <SpotDetail spot={selectedSpot} onClose={() => setSelectedId(null)} />
          </aside>
        )}
      </div>
    </div>
  )
}
