export type SpotCategory = "karang" | "drop-off" | "tubiran" | "muara" | "rumpon"

export interface ForecastPoint {
  jam: string
  arah: string // wind direction label
  kecepatanAngin: number // knots
  tinggiGelombang: number // meters
}

export interface TidePoint {
  jam: string
  tinggi: number // meters
}

export interface FishingSpot {
  id: string
  nama: string
  lat: number
  lng: number
  kategori: SpotCategory
  kedalaman: number // meters
  rating: number // 0-5
  targetIkan: string[]
  catatan: string
  suhuAir: number // celsius
  arusKnot: number
  forecast: ForecastPoint[]
  pasang: TidePoint[]
}

export const KATEGORI_LABEL: Record<SpotCategory, string> = {
  karang: "Karang",
  "drop-off": "Drop-off",
  tubiran: "Tubiran",
  muara: "Muara",
  rumpon: "Rumpon",
}

function buildForecast(base: number, gel: number): ForecastPoint[] {
  const arah = ["TL", "T", "TG", "S", "BD", "B", "BL", "U"]
  return Array.from({ length: 8 }, (_, i) => {
    const jam = `${String((6 + i * 3) % 24).padStart(2, "0")}:00`
    return {
      jam,
      arah: arah[i % arah.length],
      kecepatanAngin: Math.round((base + Math.sin(i / 1.5) * 4) * 10) / 10,
      tinggiGelombang: Math.round((gel + Math.cos(i / 2) * 0.4 + 0.4) * 10) / 10,
    }
  })
}

function buildTide(amp: number, offset: number): TidePoint[] {
  return Array.from({ length: 13 }, (_, i) => {
    const jam = `${String((i * 2) % 24).padStart(2, "0")}:00`
    const tinggi = Math.round((1.4 + Math.sin((i / 12) * Math.PI * 2 + offset) * amp) * 100) / 100
    return { jam, tinggi }
  })
}

export const SPOTS: FishingSpot[] = [
  {
    id: "spot-01",
    nama: "Tubiran Teluk Bongo",
    lat: 0.4795,
    lng: 122.9285,
    kategori: "tubiran",
    kedalaman: 72,
    rating: 4.8,
    targetIkan: ["Giant Trevally", "Tuna Sirip Kuning", "Tenggiri"],
    catatan: "Tubiran lepas pantai Bongo menghadap Teluk Tomini, arus kuat saat pasang. Terbaik subuh.",
    suhuAir: 28.4,
    arusKnot: 2.2,
    forecast: buildForecast(11, 0.8),
    pasang: buildTide(0.8, 0.2),
  },
  {
    id: "spot-02",
    nama: "Karang Pantai Bongo",
    lat: 0.4862,
    lng: 122.9335,
    kategori: "karang",
    kedalaman: 16,
    rating: 4.2,
    targetIkan: ["Kakap Merah", "Kerapu", "Baronang"],
    catatan: "Hamparan karang tepi pantai desa, cocok untuk mancing dasar.",
    suhuAir: 29.1,
    arusKnot: 0.7,
    forecast: buildForecast(7, 0.4),
    pasang: buildTide(0.6, 0.6),
  },
  {
    id: "spot-03",
    nama: "Rumpon Tomini Dalam",
    lat: 0.455,
    lng: 122.945,
    kategori: "rumpon",
    kedalaman: 140,
    rating: 4.7,
    targetIkan: ["Tuna Sirip Kuning", "Lemadang", "Cakalang"],
    catatan: "Rumpon laut dalam Teluk Tomini, ramai ikan pelagis pagi hari.",
    suhuAir: 28.0,
    arusKnot: 1.5,
    forecast: buildForecast(13, 1.2),
    pasang: buildTide(0.9, 0.0),
  },
  {
    id: "spot-04",
    nama: "Muara Sungai Bongo",
    lat: 0.4905,
    lng: 122.921,
    kategori: "muara",
    kedalaman: 5,
    rating: 3.8,
    targetIkan: ["Kakap Putih", "Belanak", "Bandeng Laut"],
    catatan: "Pertemuan air tawar dan laut di muara desa, aktif saat surut.",
    suhuAir: 29.8,
    arusKnot: 0.5,
    forecast: buildForecast(6, 0.3),
    pasang: buildTide(0.6, 1.1),
  },
  {
    id: "spot-05",
    nama: "Drop-off Tanjung Kramat",
    lat: 0.466,
    lng: 122.965,
    kategori: "drop-off",
    kedalaman: 96,
    rating: 4.9,
    targetIkan: ["Dogtooth Tuna", "Wahoo", "GT"],
    catatan: "Drop-off curam dekat tanjung, titik popping favorit nelayan.",
    suhuAir: 27.6,
    arusKnot: 2.9,
    forecast: buildForecast(15, 1.5),
    pasang: buildTide(1.0, 0.3),
  },
  {
    id: "spot-06",
    nama: "Karang Olele",
    lat: 0.452,
    lng: 122.985,
    kategori: "karang",
    kedalaman: 28,
    rating: 4.1,
    targetIkan: ["Kerapu Macan", "Kakap", "Ekor Kuning"],
    catatan: "Karang berundak dengan visibility bagus, dekat kawasan Olele.",
    suhuAir: 28.5,
    arusKnot: 1.0,
    forecast: buildForecast(9, 0.6),
    pasang: buildTide(0.7, 0.5),
  },
]

// Mock bathymetry rings around the chart center (depth contour bands in meters).
export interface DepthBand {
  depth: number
  color: string
  lat: number
  lng: number
  radius: number // meters
}

export const DEPTH_BANDS: DepthBand[] = [
  { depth: 200, color: "#0b3a66", lat: 0.45, lng: 122.95, radius: 26000 },
  { depth: 100, color: "#0f4f86", lat: 0.46, lng: 122.945, radius: 19000 },
  { depth: 50, color: "#1768a8", lat: 0.47, lng: 122.935, radius: 13000 },
  { depth: 20, color: "#2a86c4", lat: 0.479, lng: 122.928, radius: 8000 },
  { depth: 10, color: "#56a9d8", lat: 0.484, lng: 122.93, radius: 4500 },
]

export const CHART_CENTER: [number, number] = [0.472, 122.94]
