"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Circle, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import {
  SPOTS,
  DEPTH_BANDS,
  CHART_CENTER,
  KATEGORI_LABEL,
  type FishingSpot,
} from "@/lib/fishing-data"

const CATEGORY_COLOR: Record<string, string> = {
  karang: "#f2b134",
  "drop-off": "#4ea8de",
  tubiran: "#56cc9d",
  muara: "#f2784b",
  rumpon: "#e0e0e0",
}

function makeIcon(spot: FishingSpot, active: boolean) {
  const color = CATEGORY_COLOR[spot.kategori] ?? "#f2b134"
  const size = active ? 38 : 30
  return L.divIcon({
    className: "",
    html: `<div class="spot-marker" style="width:${size}px;height:${size}px;background:${color};font-size:${
      active ? 13 : 11
    }px;${active ? "box-shadow:0 0 0 4px rgba(242,177,52,0.35);" : ""}">${Math.round(
      spot.kedalaman,
    )}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

function FlyTo({ spot }: { spot: FishingSpot | null }) {
  const map = useMap()
  useEffect(() => {
    if (spot) {
      map.flyTo([spot.lat, spot.lng], 11, { duration: 0.8 })
    }
  }, [spot, map])
  return null
}

export default function FishingMap({
  selectedId,
  onSelect,
}: {
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const selectedSpot = SPOTS.find((s) => s.id === selectedId) ?? null

  return (
    <MapContainer
      center={CHART_CENTER}
      zoom={10}
      zoomControl={false}
      className="h-full w-full"
      attributionControl
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      {/* Depth contour bands (bathymetry) */}
      {DEPTH_BANDS.map((band) => (
        <Circle
          key={band.depth}
          center={[band.lat, band.lng]}
          radius={band.radius}
          pathOptions={{
            color: band.color,
            weight: 1,
            fillColor: band.color,
            fillOpacity: 0.45,
          }}
        />
      ))}

      {SPOTS.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={makeIcon(spot, spot.id === selectedId)}
          eventHandlers={{ click: () => onSelect(spot.id) }}
          title={`${spot.nama} — ${KATEGORI_LABEL[spot.kategori]}`}
        />
      ))}

      <FlyTo spot={selectedSpot} />
    </MapContainer>
  )
}
