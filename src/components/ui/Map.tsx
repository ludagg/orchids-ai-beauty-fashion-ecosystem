'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet's default icon path issues with Next.js/Webpack
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

// [Jules - standard Leaflet default icon fix]
if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
    });
}

interface MapProps {
    lat: number;
    lng: number;
    popupText?: string;
    className?: string;
    style?: React.CSSProperties;
    interactive?: boolean;
}

export default function Map({ lat, lng, popupText, className, style, interactive = true }: MapProps) {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            scrollWheelZoom={false}
            dragging={interactive}
            zoomControl={interactive}
            doubleClickZoom={interactive}
            touchZoom={interactive}
            boxZoom={interactive}
            keyboard={interactive}
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
