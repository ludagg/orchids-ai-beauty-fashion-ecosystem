'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet's default icon path issues with Next.js/Webpack
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// Create the icon instance outside component to avoid recreation
let DefaultIcon: L.Icon | null = null;

if (typeof window !== 'undefined') {
    DefaultIcon = L.icon({
        iconUrl,
        iconRetinaUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
    });

    // Apply default icon globally if not already set
    L.Marker.prototype.options.icon = DefaultIcon;
}

interface MapProps {
    lat: number;
    lng: number;
    popupText?: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function Map({ lat, lng, popupText, className, style }: MapProps) {
    useEffect(() => {
        // Ensure icon is set on mount just in case
        if (DefaultIcon) {
             L.Marker.prototype.options.icon = DefaultIcon;
        }
    }, []);

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            className={`h-full w-full z-0 ${className || ''}`}
            style={{ minHeight: '300px', width: '100%', borderRadius: '1rem', ...style }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
                <Popup>
                    {popupText || "Location"}
                </Popup>
            </Marker>
        </MapContainer>
    );
}
