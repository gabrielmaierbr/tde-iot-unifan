import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';

export function useDevices() {
  const [devices, setDevices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(database, 'devices');
    const unsubscribe = onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      setDevices(data || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { devices, loading };
}
