import React, { useEffect, useState } from 'react';
import Map from '../components/map/map';
import Sidebar from '../components/ui/sidebar';
import { Pin, getPins } from '../services/index';

const MapPage: React.FC = () => {
  const [pins, setPins] = useState<Pin[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const sessionId = localStorage.getItem('sessionId')!;
  useEffect(() => {
    const loadPins = async () => {
      try {
        const data = await getPins(sessionId);
        setPins(data);
      } catch (err) {
        console.error('Error loading pins', err);
      }
    };

    loadPins();
  }, [sessionId]);

  const handleMapClick = (coords: [number, number]) => {
    setCurrentCoords(coords);
    setShowSidebar(true);
  };


  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentCoords(null);
  };

  return (
    <div className="relative flex h-screen">
      <div className="flex-1">
        <Map
          center={[-80.240135, 26.001137]}
          zoom={10}
          onMapClick={handleMapClick}
          pins={pins}
        />
      </div>

      {showSidebar && currentCoords && (
        <Sidebar
          sessionId={sessionId}
          coords={currentCoords}
          onClose={handleCloseSidebar}
        />
      )}
    </div>
  );
};

export default MapPage;
