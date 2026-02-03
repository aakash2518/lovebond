import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { 
  updateUserLocation, 
  getUserLocation, 
  subscribeToPartnerLocation,
  calculateDistance as calcDist,
  UserLocation as FirestoreLocation 
} from '@/lib/firestore/locations';

interface Location {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;
  updated_at: string;
}

const toAppLocation = (firestoreLocation: FirestoreLocation | null): Location | null => {
  if (!firestoreLocation) return null;
  
  return {
    id: firestoreLocation.uid,
    user_id: firestoreLocation.uid,
    latitude: firestoreLocation.latitude,
    longitude: firestoreLocation.longitude,
    accuracy: firestoreLocation.accuracy,
    updated_at: firestoreLocation.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
};

// Get current position using Web Geolocation API
const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    });
  });
};

// Watch position using Web Geolocation API
const watchPosition = (
  successCallback: (position: GeolocationPosition) => void,
  errorCallback: (error: GeolocationPositionError) => void
): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      }
    );
    resolve(watchId);
  });
};

// Clear watch using Web Geolocation API
const clearWatch = async (watchId: number): Promise<void> => {
  navigator.geolocation.clearWatch(watchId);
};

// Get my location from DB
export const useMyLocation = () => {
  const { user } = useFirebaseAuth();
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLocation(null);
      setIsLoading(false);
      return;
    }

    const fetchLocation = async () => {
      try {
        const loc = await getUserLocation(user.uid);
        setLocation(toAppLocation(loc));
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [user]);

  return { data: location, isLoading };
};

// Get partner's location with realtime updates
export const usePartnerLocation = () => {
  const { user } = useFirebaseAuth();
  const [partnerLocation, setPartnerLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeToPartnerLocation(user.uid, (location) => {
      setPartnerLocation(toAppLocation(location));
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  return { data: partnerLocation, isLoading };
};

// Update my location
export const useUpdateLocation = () => {
  const { user } = useFirebaseAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coords: { latitude: number; longitude: number; accuracy?: number }) => {
      if (!user) throw new Error('Not authenticated');

      await updateUserLocation(user.uid, coords.latitude, coords.longitude, coords.accuracy);
      return coords;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-location'] });
    },
  });
};

// Hook to get current location once
export const useGetCurrentLocation = () => {
  const updateLocation = useUpdateLocation();

  return useMutation({
    mutationFn: async () => {
      const position = await getCurrentPosition();
      const coords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      
      await updateLocation.mutateAsync(coords);
      return coords;
    },
  });
};

// Hook to watch and update location continuously
export const useLocationWatcher = () => {
  const updateLocation = useUpdateLocation();
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const startWatching = async () => {
    try {
      const id = await watchPosition(
        (position) => {
          updateLocation.mutate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setIsWatching(false);
          setWatchId(null);
        }
      );
      
      setWatchId(id);
      setIsWatching(true);
    } catch (error) {
      console.error('Failed to start location watching:', error);
    }
  };

  const stopWatching = async () => {
    if (watchId !== null) {
      await clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  };

  return { isWatching, startWatching, stopWatching };
};

// Calculate distance between two points in km
export const calculateDistance = calcDist;