import React, {useEffect, useState, useRef } from 'react';
import mapboxgl, {Marker} from 'mapbox-gl';
import {Pin} from '../../services/index';
import 'mapbox-gl/dist/mapbox-gl.css'; 



interface MapProps{
    center: [number, number];
    zoom: number;
    onMapClick: (coords: [number, number]) => void;
    pins: Pin[];
}


const Map: React.FC<MapProps> = ({ center, zoom, onMapClick, pins }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<Marker[]>([]);

    useEffect(() => {
        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PK!

        if (!mapContainer.current) return;
        if (map.current) return;
        
        map.current = new mapboxgl.Map({
            container: mapContainer.current as unknown as string,
            style: 'mapbox://styles/mapbox/satellite-streets-v12',
            center: [-80.240135, 26.001137],
            zoom: 10,
        });

        const handleClick = (e: mapboxgl.MapMouseEvent) => {
            onMapClick([e.lngLat.lng, e.lngLat.lat]);
          };
      
          map.current.on('click', handleClick);
      
          return () => {
            map.current?.off('click', handleClick);
            map.current?.remove();
          };

        
    }, [center, zoom, onMapClick]);

    useEffect(() => {
        markersRef.current.forEach((marker) => marker.remove())
        markersRef.current = [];

        pins.forEach(({pinName,pinDescription, latitude, longitude}) => {
            const marker = new mapboxgl.Marker()
                .setLngLat([longitude, latitude])
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setHTML(
                            `<h3>${pinName}</h3><p>${pinDescription}</p>`
                        )
                )
                .addTo(map.current!)
            markersRef.current.push(marker);
        })
    }, [pins])
    return (
        <div>
            <div ref={mapContainer} style={{ width: '100%', height: '100vh' }} />
        </div>
    );
}

export default Map;