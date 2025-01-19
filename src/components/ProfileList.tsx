import React, { useEffect, useState } from 'react';
import { useProfileStore } from '../store/profileStore';
import { MapPin, Mail, Phone, X, Search } from 'lucide-react';
import { MapView } from './Map';  // Import MapView

export const ProfileList: React.FC = () => {
  const { profiles, fetchProfiles, setSelectedProfile, loading, selectedProfile } = useProfileStore();
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProfiles, setFilteredProfiles] = useState(profiles);


  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    setFilteredProfiles(
      profiles.filter((profile) =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ), [searchQuery, profiles];
  })


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-blue-500"></div>
        </div>
      </div>

    );
  }

  return (
    <div>
      <div className="relative mb-8 mt-10 mx-auto w-1/2">
        <input
          type="text"
          placeholder="Search profiles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 my-16 justify-center items-center rounded-full border border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2  bg-blue-500 text-white rounded-e-full w-12 h-10 flex items-center justify-center ">
          <Search className="w-4 h-4" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8 justify-center items-center place-items-center ">
        {filterProfiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-60 mb-12 "
          >
            <img
              src={profile.photoUrl || '/placeholder-image.png'}
              alt={profile.name || 'Profile Picture'}
              className="w-full h-29 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{profile.name || 'Unknown Name'}</h3>
              <p className="text-gray-600 mb-4">{profile.description || 'No description available'}</p>

              <div className="space-y-1">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{profile.location?.address || 'Address not available'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{profile.contactInfo?.email || 'Email not available'}</span>
                </div>
                {profile.contactInfo?.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profile.contactInfo.phone}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setSelectedProfile(profile);
                  setIsMapVisible(true);  // Show map when button is clicked
                }}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                View on Map
              </button>
            </div>
          </div>
        ))}

        {/* Popup to display the map */}
        {isMapVisible && selectedProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-3/4 lg:w-1/2 h-1/2">
              <button
                onClick={() => setIsMapVisible(false)} // Hide map when button is clicked
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              >
                <X className="w-6 h-6" />
              </button>
              <MapView />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
