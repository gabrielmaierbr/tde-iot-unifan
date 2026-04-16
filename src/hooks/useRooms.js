import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/config';

export function useRooms() {
  const [rooms, setRooms] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomsRef = ref(database, 'rooms');
    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      setRooms(data || {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { rooms, loading };
}
