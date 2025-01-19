import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useProfileStore } from '../store/profileStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center and zoom
const MapUpdater: React.FC = () => {
  const map = useMap();
  const { selectedProfile } = useProfileStore();

  useEffect(() => {
    if (selectedProfile?.location) {
      const { latitude, longitude } = selectedProfile.location;
      map.setView([latitude, longitude], 12);
    }
  }, [selectedProfile, map]);

  return null;
};

export const MapView: React.FC = () => {
  const { profiles, selectedProfile, setSelectedProfile } = useProfileStore();
  const popupRef = useRef<L.Popup>(null);

  const isValidLocation = (location: any) =>
    location && typeof location.latitude === 'number' && typeof location.longitude === 'number';

  return (
    
    <MapContainer
      center={[40, -100]} // Default map center
      zoom={4}
      style={{ width: '100%', height: '100%'}}
      className="z-0"
    >
      <MapUpdater />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render markers for valid profiles */}
      {profiles.map((profile) => {
        if (!isValidLocation(profile.location)) {
          console.warn(`Skipping profile with invalid location:`, profile);
          console.log('Location:', profile.location);
          return null;
        }

        const { latitude, longitude, address } = profile.location;

        return (
          <Marker
            key={profile.id}
            position={[latitude, longitude]}
            eventHandlers={{
              click: () => setSelectedProfile(profile),
            }}
          >
            {profile.id === selectedProfile?.id && (
              <Popup ref={popupRef} autoPan>
                <div className="p-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <h3 className="font-semibold">{profile.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{profile.description}</p>
                  <p className="text-sm text-gray-600">{profile.location.address}</p>
                  <p className="text-sm text-gray-600">{address || 'Address not available'}</p>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}
    </MapContainer>
    
  );
};
