"use client"

import { useState, type FormEvent } from "react"
import { Anchor, Compass, MapPin, Waves, ArrowRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function LoginScreen() {
  const { login } = useAuth()
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const clean = name.trim()
    if (clean.length < 2) {
      setError("Masukkan nama pengguna minimal 2 karakter.")
      return
    }
    setError("")
    login(clean)
  }

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#0a1f33] px-4">
      {/* beach background */}
      <img
        src="/images/beach-bg.png"
        alt="Pemandangan pantai Desa Bongo saat senja"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* readability overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#0a1f33]/70 via-[#0a1f33]/55 to-[#0a1f33]/85"
      />

      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Anchor className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="text-xl font-bold tracking-tight text-foreground">SAMUDRA CHART</h1>
          <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden />
            Desa Bongo, Batudaa Pantai
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-md"
        >
          <h2 className="text-sm font-semibold text-card-foreground">Masuk ke Navigator</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Cukup masukkan nama pengguna untuk mulai menjelajahi fishing ground.
          </p>

          <label htmlFor="username" className="mt-5 block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Nama Pengguna
          </label>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-secondary px-3 focus-within:ring-2 focus-within:ring-ring">
            <Compass className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Kapten Bongo"
              className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            Mulai Menjelajah
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <Waves className="h-3.5 w-3.5 text-accent" aria-hidden />
            Teluk Tomini, Gorontalo
          </p>
        </form>
      </div>
    </div>
  )
}
