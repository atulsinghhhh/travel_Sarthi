import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ItineraryMap = ({ itinerary = [] }) => {
  const points = itinerary.filter(day => day.lat && day.lng).map(day => [day.lat, day.lng]);
  
  if (points.length === 0) return null;

  const center = points[0];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden border border-gray-200 relative z-0 mt-6 shadow-sm">
      <MapContainer center={center} zoom={9} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {itinerary.map((day, idx) => {
          if (!day.lat || !day.lng) return null;
          return (
            <Marker key={idx} position={[day.lat, day.lng]}>
              <Popup>
                <div className="text-center w-48">
                  <h4 className="font-bold text-blue-600">Day {day.day}: {day.location_name}</h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{day.description}</p>
                </div>
              </Popup>
            </Marker>
          )
        })}
        {points.length > 1 && <Polyline positions={points} color="#3B82F6" weight={4} opacity={0.8} dashArray="10, 10" />}
      </MapContainer>
    </div>
  );
};

export default ItineraryMap;
