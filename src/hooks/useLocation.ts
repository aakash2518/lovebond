import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
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

// Get current position using Capacitor or Web API
const getCurrentPosition = async (): Promise<GeolocationPosition> => {
  if (Capacitor.isNativePlatform()) {
    try {
      const { Geolocation } = await import('@capacitor/geolocation');
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      });
      
      // Convert Capacitor format to Web API format
      return {
        coords: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
        },
        timestamp: position.timestamp,
      } as GeolocationPosition;
    } catch (error) {
      console.error('Capacitor Geolocation error:', error);
      throw error;
    }
  } else {
    // Web API fallback
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      });
    });
  }
};

// Watch position using Capacitor or Web API
const watchPosition = (
  successCallback: (position: GeolocationPosition) => void,
  errorCallback: (error: GeolocationPositionError) => void
): Promise<string | number> => {
  if (Capacitor.isNativePlatform()) {
    return import('@capacitor/geolocation').then(({ Geolocation }) => {
      return Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 30000
      }, (position, err) => {
        if (err) {
          errorCallback(err as GeolocationPositionError);
        } else if (position) {
          // Convert Capacitor format to Web API format
          const webPosition = {
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            },
            timestamp: position.timestamp,
          } as GeolocationPosition;
          successCallback(webPosition);
        }
      });
    });
  } else {
    // Web API fallback
    const watchId = navigator.geolocation.watchPosition(
      successCallback,
      errorCallback,
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
      }
    );
    return Promise.resolve(watchId);
  }
};

// Clear watch using Capacitor or Web API
const clearWatch = async (watchId: string | number): Promise<void> => {
  if (Capacitor.isNativePlatform()) {
    const { Geolocation } = await import('@capacitor/geolocation');
    await Geolocation.clearWatch({ id: watchId as string });
  } else {
    navigator.geolocation.clearWatch(watchId as number);
  }
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
  const [watchId, setWatchId] = useState<string | number | null>(null);

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
