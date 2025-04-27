import React, {useEffect, useRef } from 'react';
import mapboxgl, { Marker} from 'mapbox-gl';
import { Pin } from '../../services/api/pins';
import { deletePin } from '../../services/api/pins';
import 'mapbox-gl/dist/mapbox-gl.css'; 



interface MapProps{
    center: [number, number];
    zoom: number;
    pins: Pin[];
    sessionId: string,
    onMapClick: (coords: [number, number]) => void;
    onPinSelect: (pin: Pin) => void;
    onPinDelete: (pinId: string) => void;
    showSidebar?: boolean;
}

const Map: React.FC<MapProps> = ({ center, zoom, sessionId,onPinSelect, onMapClick, onPinDelete,pins, showSidebar }) => {

    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<Marker[]>([]);
    const tempMarkerRef = useRef<Marker|null>(null);

    useEffect(() => {

        if (!mapContainer.current) return;
        if (mapRef.current) return;  

        mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_PK!;

        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/standard-satellite',
            center,
            zoom,
        });
        

        const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
            if (tempMarkerRef.current) {
                tempMarkerRef.current.remove();
                tempMarkerRef.current = null;
            }
            tempMarkerRef.current = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([e.lngLat.lng, e.lngLat.lat])
            .addTo(map);
            onMapClick([e.lngLat.lng, e.lngLat.lat]);
        };

        map.on('click', handleMapClick);
        mapRef.current = map;

        return () => {
            map.off('click', handleMapClick);
            map.remove();
            mapRef.current = null;
        };

    }, []);

      
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        markersRef.current.forEach((m) => m.remove());
        markersRef.current = [];

        pins.forEach((p) => {

            const marker = new mapboxgl.Marker()
            .setLngLat([p.longitude, p.latitude])
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>${p.pinName}</h3><p>${p.pinDescription}</p>`
                )
            )
            .addTo(map);

            marker.getElement().addEventListener('click', (e) => {
                e.stopPropagation();
                onPinSelect(p);
            });

            marker.getElement().addEventListener('dblclick', async (e) => {
                e.stopPropagation();
                
                let rawId: string;
                if (typeof p.id === 'string') {
                    rawId = p.id;
                } else if (
                    p.id != null &&
                    typeof p.id === 'object' &&
                    'id' in p.id &&
                    typeof (p.id as any).id === 'string'
                ) {
                    rawId = (p.id as any).id;
                } else {
                    console.error('Unexpected p.id shape:', p.id);
                    rawId = JSON.stringify(p.id);
                }
               console.log('testing delete marker: ', p.id, " rawId: ", rawId); 
               console.log("test: ", p.id)
                try{
                    const test = await deletePin(sessionId, rawId);
                    if(!test){
                        console.error("Failed to delete pin");
                    }
                    marker.remove();
                    onPinDelete(p.id);
                }catch(e){
                    console.error("Error deleting pin: ", e);
                    alert("Error deleting pin");
                }
            })
            markersRef.current.push(marker);
        });
    }, [pins, onPinSelect, onPinDelete, sessionId]);

    useEffect(() => {
        if (!showSidebar && tempMarkerRef.current) {
          tempMarkerRef.current.remove();
          tempMarkerRef.current = null;
        }
      }, [showSidebar]);

    return (
       
    <div 
        ref={mapContainer} 
        style={{ 
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '100%'
        }} 
        />
    );
}

export default Map;

