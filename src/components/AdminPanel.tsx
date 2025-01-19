import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Profile } from '../types';
import { useProfileStore } from '../store/profileStore';
import { supabase } from '../lib/supabase';

interface ProfileFormData {
  name: string;
  description: string;
  photoUrl: string;
  latitude: number | '';
  longitude: number | '';
  address: string;
  email: string;
  phone?: string;
}

const initialFormData: ProfileFormData = {
  name: '',
  description: '',
  photoUrl: '',
  latitude: '',
  longitude: '',
  address: '',
  email: '',
  phone: '',
};

export const AdminPanel: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const { profiles, setProfiles } = useProfileStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  

  useEffect(() => {
    if (editingProfile) {
      setFormData({
        name: editingProfile.name,
        description: editingProfile.description,
        photoUrl: editingProfile.photoUrl,
        latitude: editingProfile.location.latitude,
        longitude: editingProfile.location.longitude,
        address: editingProfile.location.address,
        email: editingProfile.contactInfo.email,
        phone: editingProfile.contactInfo.phone,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) throw new Error('Please sign in to add profiles');

      // Validate latitude and longitude
      if (formData.latitude === '' || formData.longitude === '') {
        throw new Error('Please enter valid latitude and longitude values');
      }

      const profileData = {
        name: formData.name,
        description: formData.description,
        photo_url: formData.photoUrl,
        latitude: formData.latitude,
        longitude: formData.longitude,
        address: formData.address,
        email: formData.email,
        phone: formData.phone || null,
        user_id: userData.user.id,
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newProfile: Profile = {
          id: data.id,
          name: data.name,
          description: data.description,
          photoUrl: data.photo_url,
          location: {
            latitude: data.latitude,
            longitude: data.longitude,
            address: data.address,
          },
          contactInfo: {
            email: data.email,
            phone: data.phone || undefined,
          },
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };

        setProfiles([...profiles, newProfile]);
        setIsModalOpen(false);
        setFormData(initialFormData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'latitude' | 'longitude'
  ) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      [field]: value === '' ? '' : parseFloat(value),
    });
  };

  const handleDelete = async (profileId: string) => {

    if(!profileToDelete) return;
    setError(null);
    setIsLoading(true);
  
    try {
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);
  
      if (error) throw error;
  
      // Update state to remove the deleted profile
      setProfiles(profiles.filter((profile) => profile.id !== profileId));
      setIsDeleteModalOpen(false);
      setProfileToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={() => {
            setEditingProfile(null);
            setIsModalOpen(true);
          }}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Profile
        </button>
      </div>

      {/* Profile List */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={profile.photoUrl}
                      alt={profile.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{profile.name}</div>
                      <div className="text-sm text-gray-500">{profile.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {profile.location.address}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {profile.contactInfo.email}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingProfile(profile);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setProfileToDelete(profile);
                        setIsDeleteModalOpen(true);
                      }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-semibold mb-4">
              {editingProfile ? 'Edit Profile' : 'Add New Profile'}
            </h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Photo URL</label>
                  <input
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => handleNumberInput(e, 'latitude')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => handleNumberInput(e, 'longitude')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone (optional)</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

         {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && profileToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
                <p className="mb-4">
                  Are you sure you want to delete the profile{' '}
                  <span className="font-bold">{profileToDelete.name}</span>? This action cannot be
                  undone.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(profileToDelete.id)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                  >
                    {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};