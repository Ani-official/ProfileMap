import { create } from 'zustand';
import { Profile } from '../types';
import { supabase } from '../lib/supabase';

interface ProfileState {
  profiles: Profile[];
  selectedProfile: Profile | null;
  loading: boolean;
  error: string | null;
  setProfiles: (profiles: Profile[]) => void;
  setSelectedProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchProfiles: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profiles: [],
  selectedProfile: null,
  loading: false,
  error: null,
  setProfiles: (profiles) => set({ profiles }),
  setSelectedProfile: (profile) => set({ selectedProfile: profile }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchProfiles: async () => {
    set({ loading: true, error: null });
    console.log('Fetching profiles...');
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
  
      console.log('Profiles fetched:', data);
  
      // Map the data to the correct field names
      const mappedProfiles = data?.map((profile: any) => ({
        ...profile,
        photoUrl: profile.photo_url, // Fix for field name
        location: {
          latitude: profile.latitude,
          longitude: profile.longitude,
          address: profile.address, // Add more fields as necessary
        },
        contactInfo: {
          email: profile.email,
          phone: profile.phone,
        },
      }));
  
      set({ profiles: mappedProfiles || [], loading: false });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching profiles:', error.message);
        set({ error: error.message, loading: false });
      } else {
        set({ error: 'An unexpected error occurred.', loading: false });
      }
    }
  },
  
  
}));
