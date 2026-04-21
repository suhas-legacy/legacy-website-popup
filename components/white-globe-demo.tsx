"use client"

import { WhiteGlobe } from "@/components/ui/white-globe"

const markers = [
  { id: "sf", location: [37.7595, -122.4367] as [number, number], label: "San Francisco" },
  { id: "nyc", location: [40.7128, -74.006] as [number, number], label: "New York" },
  { id: "tokyo", location: [35.6762, 139.6503] as [number, number], label: "Tokyo" },
  { id: "london", location: [51.5074, -0.1278] as [number, number], label: "London" },
  { id: "sydney", location: [-33.8688, 151.2093] as [number, number], label: "Sydney" },
  { id: "capetown", location: [-33.9249, 18.4241] as [number, number], label: "Cape Town" },
  { id: "dubai", location: [25.2048, 55.2708] as [number, number], label: "Dubai" },
  { id: "paris", location: [48.8566, 2.3522] as [number, number], label: "Paris" },
  { id: "saopaulo", location: [-23.5505, -46.6333] as [number, number], label: "São Paulo" },
]

const arcs = [
  {
    id: "sf-tokyo",
    from: [37.7595, -122.4367] as [number, number],
    to: [35.6762, 139.6503] as [number, number],
    label: "SF → Tokyo",
  },
  {
    id: "nyc-london",
    from: [40.7128, -74.006] as [number, number],
    to: [51.5074, -0.1278] as [number, number],
    label: "NYC → London",
  },
]

export default function WhiteGlobeDemo() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-50 p-8 overflow-hidden">
      <div className="w-full max-w-lg">
        <WhiteGlobe
          markers={markers}
          arcs={arcs}
          markerColor={[0.2, 0.3, 0.6]}
          baseColor={[0.95, 0.95, 0.95]}
          arcColor={[0.2, 0.3, 0.6]}
          glowColor={[1, 1, 1]}
          dark={0}
          mapBrightness={8}
          markerSize={0.025}
          markerElevation={0.01}
        />
      </div>
    </div>
  )
}
