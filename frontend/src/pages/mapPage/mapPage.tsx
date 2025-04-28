import React, { useEffect, useState } from 'react';
import Map from '../../components/map/map';
import Sidebar from '../../components/ui/sidebar/sidebar';
import { Pin, getPins } from '../../services/api/pins';
import { getSID } from '../../services/session';
import './mapPage.css';



const MapPage: React.FC = () => {
    
  const [sessionId, setSessionId] = useState<string | null>(null);  
  const [pins, setPins] = useState<Pin[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<[number, number] | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
 
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
            if(!data){
                console.error("No data returned from server");
                return;
            }
            
            setPins(Array.isArray(data) ? data : []);
        }catch{
            console.error("Error fetching pins, loading no pins");
            setPins([])
        }

      } catch (err) {
        console.error('Initialization error:', err);
      }
    })();
  }, []);
 

  const handleMapClick = (coords: [number, number]) => {
    setSelectedPin(null);
    setCurrentCoords(coords);
    setShowSidebar(true);
  };
  
  const handlePinSelect = (pin: Pin) => {
    setSelectedPin(pin);
    setCurrentCoords([pin.longitude, pin.latitude]);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentCoords(null);
  };

  const handlePinSave = (savedPin: Pin) => {
    setPins((prev) => {
      
      const idx = prev.findIndex(p => p.id === savedPin.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = savedPin;
        return next;
      } else {
        return [...prev, savedPin];
      }
    });
  
    setShowSidebar(false);
    setNotification('✅ Pin saved successfully!');
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePinDelete = (pinId: string) => {
    setPins((prevPins) => prevPins.filter(pin => pin.id !== pinId));
    setShowSidebar(false);
    setNotification('Pin deleted successfully!');
    setTimeout(() => { 
      setNotification(null);
    }
    , 3000);
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
        
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}

        <Map
          center={[-80.240135, 26.001137]}
          zoom={10}
          sessionId= {sessionId}
          onMapClick={handleMapClick}
          onPinSelect={handlePinSelect}
          onPinDelete={handlePinDelete}
          showSidebar={showSidebar}
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
            existingPin={selectedPin ?? undefined}
            onClose={handleCloseSidebar}
            onSave={handlePinSave}
          />
        </div>
      )}
    </div>
  );
};

export default MapPage;
