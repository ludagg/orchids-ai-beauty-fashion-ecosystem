'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

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

    L.Marker.prototype.options.icon = DefaultIcon;
}

interface MapProps {
    lat?: number;
    lng?: number;
    popupText?: string;
    className?: string;
    style?: React.CSSProperties;
    interactive?: boolean;
    useUserLocation?: boolean;
}

const DEFAULT_LAT = 48.8566;
const DEFAULT_LNG = 2.3522;

export default function Map({ 
    lat: propLat, 
    lng: propLng, 
    popupText, 
    className, 
    style, 
    interactive = true,
    useUserLocation = false 
}: MapProps) {
    const [position, setPosition] = useState<[number, number]>(
        propLat !== undefined && propLng !== undefined 
            ? [propLat, propLng] 
            : [DEFAULT_LAT, DEFAULT_LNG]
    );
    const [isLoading, setIsLoading] = useState(useUserLocation);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (DefaultIcon) {
            L.Marker.prototype.options.icon = DefaultIcon;
        }
    }, []);

    useEffect(() => {
        if (useUserLocation && propLat === undefined && propLng === undefined) {
            if (!navigator.geolocation) {
                setError('Geolocation is not supported by your browser');
                setIsLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                    setIsLoading(false);
                },
                (err) => {
                    setError(`Could not get your location: ${err.message}`);
                    setIsLoading(false);
                },
                { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
            );
        }
    }, [useUserLocation, propLat, propLng]);

    if (isLoading) {
        return (
            <div 
                className={`flex items-center justify-center bg-muted/50 rounded-2xl ${className || ''}`}
                style={{ minHeight: '300px', ...style }}
            >
                <span className="text-muted-foreground text-sm">Getting your location...</span>
            </div>
        );
    }

    return (
        <MapContainer
            center={position}
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
            <Marker position={position}>
                <Popup>
                    {popupText || "Location"}
                </Popup>
            </Marker>
        </MapContainer>
    );
}
