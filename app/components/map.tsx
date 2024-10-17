"use client";
import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const defaultIcon = new L.Icon({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapOverlayProps {
  lat: number;
  lng: number;
  onLocationSelect: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  onClose: () => void;
  saveMap: () => void;
}

const MapOverlay: React.FC<MapOverlayProps> = ({
  lat,
  lng,
  onLocationSelect,
  onClose,
  saveMap,
}) => {
  const [markers, setMarkers] = React.useState<{ lat: number; lng: number }>({
    lat,
    lng,
  });

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers({ lat, lng });
        onLocationSelect({ lat, lng });
      },
    });
    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex flex-col items-center justify-center">
      <button
        className="absolute top-4 right-4 space-y-2 p-10  group h-20 w-30 cursor-pointer items-center rounded-3xl"
        onClick={onClose}
      >
        <span className="block h-1 w-10 origin-center rounded-full bg-slate-950 transition-transform ease-in-out group-hover:translate-y-1.5 group-hover:rotate-45"></span>
        <span className="block h-1 w-8 origin-center rounded-full bg-pink-500 transition-transform ease-in-out group-hover:w-10 group-hover:-translate-y-1.5 group-hover:-rotate-45"></span>
        {/* Title */}
        <span className="block text-m text-center mx-5 text-greenGreeny">
          Close
        </span>
      </button>
      <MapContainer center={[lat, lng]} zoom={18} className="w-4/5 h-4/5">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />

        <Marker position={[markers.lat, markers.lng]} />
      </MapContainer>
      <button
        className="cursor-pointer flex items-end  bg-pink-500 hover:bg-slate-500 active:border  rounded-md duration-100 p-2"
        title="Save"
        onClick={saveMap}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          viewBox="0 -0.5 25 25"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.507 19.853V6.034C18.5116 5.49905 18.3034 4.98422 17.9283 4.60277C17.5532 4.22131 17.042 4.00449 16.507 4H8.50705C7.9721 4.00449 7.46085 4.22131 7.08577 4.60277C6.7107 4.98422 6.50252 5.49905 6.50705 6.034V19.853C6.45951 20.252 6.65541 20.6407 7.00441 20.8399C7.35342 21.039 7.78773 21.0099 8.10705 20.766L11.907 17.485C12.2496 17.1758 12.7705 17.1758 13.113 17.485L16.9071 20.767C17.2265 21.0111 17.6611 21.0402 18.0102 20.8407C18.3593 20.6413 18.5551 20.2522 18.507 19.853Z"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
        <span className="text-sm text-greyGreeny hover:text-greenGreeny font-bold pr-1">Save Localisation</span>
      </button>
    </div>
  );
};

export default MapOverlay;
