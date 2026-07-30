import { useEffect } from "react";
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import "./LocationPicker.css";

// Vite doesn't resolve Leaflet's default marker image paths automatically;
// point them at the bundled asset URLs instead.
const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export interface LatLng {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  position: LatLng;
  radiusKm: number;
  onPositionChange: (position: LatLng) => void;
}

function RecenterOnPositionChange({ position }: { position: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(position);
  }, [map, position]);
  return null;
}

function ClickToMovePin({ onPositionChange }: { onPositionChange: (position: LatLng) => void }) {
  useMapEvents({
    click(event) {
      onPositionChange(event.latlng);
    },
  });
  return null;
}

export function LocationPicker({ position, radiusKm, onPositionChange }: LocationPickerProps) {
  return (
    <div className="location-picker">
      <MapContainer center={position} zoom={11} className="location-picker__map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={position}
          icon={pinIcon}
          draggable
          eventHandlers={{
            dragend: (event) => onPositionChange(event.target.getLatLng()),
          }}
        />
        <Circle center={position} radius={radiusKm * 1000} pathOptions={{ color: "#ff4d6d" }} />
        <ClickToMovePin onPositionChange={onPositionChange} />
        <RecenterOnPositionChange position={position} />
      </MapContainer>
      <p className="location-picker__hint">Drag the pin or click the map to change where you're exploring.</p>
    </div>
  );
}
