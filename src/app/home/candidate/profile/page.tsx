"use client"

import { useEffect, useState } from 'react';
import { getProfile } from '@/actions';
import { Loading, Profile as ProfileComponent } from '@/components';
import type { Profile } from '@/interfaces';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      if (response) {
        setProfileData(response);
        setError(null);
      } else {
        setError('No se pudo cargar el perfil');
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);



  if (loading) {
    return <Loading />;
  }

  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Error: {error || 'No se pudo cargar el perfil'}</p>
        </div>
      </div>
    );
  }

  return (
    <ProfileComponent profile={profileData} />
  );
} 