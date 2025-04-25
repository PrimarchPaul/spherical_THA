import React, { useEffect, useState } from 'react';
import Map from '../components/map/map';
import Sidebar from '../components/ui/sidebar';
import { Pin, getPins } from '../services/index';
import { getSID } from '../services/session';


const MapPage: React.FC = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);  
  const [pins, setPins] = useState<Pin[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  

  useEffect(() => {
    (async () => {
      try {
        const sid = await getSID();
        if (!sid) {
            console.error('Session ID is not set');
            return;
        }
        setSessionId(sid);

        try{
            const data = await getPins(sid);
            setPins(Array.isArray(data) ? data : []);
        }catch{
            setPins([]);
        }

      } catch (err) {
        console.error('Initialization error:', err);
      }
    })();
  }, []);
  /*
  useEffect(() => {
    const init = async () => {
      try {
        const sid = await getSID();
        
        if (!sid) {
          console.error('Session ID is not set');
          return;
        }
        
        const allPins = await getPins(sid);
        setPins(allPins);
      } catch (err) {
        console.error('Error fetching session ID', err);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const loadPins = async () => {
      try {
        
        if (!sessionId) {
          console.error('Session ID is not set');
          return;
        }
        const data = await getPins(sessionId);
        setPins(data);
      } catch (err) {
        console.error('Error loading pins', err);
      }
    };

    loadPins();
  }, [sessionId]);
  */

  const handleMapClick = (coords: [number, number]) => {
    setCurrentCoords(coords);
    setShowSidebar(true);
  };


  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentCoords(null);
  };

  if (!sessionId) {
    return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}>
          <span>Loading session and pins…</span>
        </div>
      );
    
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      
      <div style={{ width: '100%', height: '100%' }}>
        <Map
          center={[-80.240135, 26.001137]}
          zoom={10}
          onMapClick={handleMapClick}
          pins={pins}
        />
      </div>

      {showSidebar && currentCoords && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '100%',
          backgroundColor: '#fff',
          boxShadow: '-2px 0 4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <Sidebar
            sessionId={sessionId}
            coords={currentCoords}
            onClose={handleCloseSidebar}
          />
        </div>
      )}
    </div>
  );
};

export default MapPage;
