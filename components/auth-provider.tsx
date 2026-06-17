"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type AuthState = {
  username: string | null
  ready: boolean
  login: (name: string) => void
  logout: () => void
}

const STORAGE_KEY = "samudra-chart-user"

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setUsername(stored)
    } catch {
      // ignore storage errors
    }
    setReady(true)
  }, [])

  function login(name: string) {
    const clean = name.trim()
    if (!clean) return
    try {
      localStorage.setItem(STORAGE_KEY, clean)
    } catch {
      // ignore storage errors
    }
    setUsername(clean)
  }

  function logout() {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage errors
    }
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ username, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider")
  return ctx
}
