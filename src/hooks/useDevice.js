import { ref, update, remove, push, get, query, orderByChild, equalTo, set } from 'firebase/database';
import { database } from '../firebase/config';

export function useDevice() {
  const updateDeviceState = async (deviceId, newState) => {
    try {
      const deviceRef = ref(database, `devices/${deviceId}/state`);
      await update(deviceRef, newState);
      return { success: true };
    } catch (error) {
      console.error('Error updating device state:', error);
      return { success: false, error };
    }
  };

  const addDevice = async (deviceData) => {
    try {
      const devicesRef = ref(database, 'devices');
      const newDeviceRef = push(devicesRef);
      await set(newDeviceRef, {
        ...deviceData,
        online: false,
        lastSeen: Date.now()
      });
      return { success: true, id: newDeviceRef.key };
    } catch (error) {
      console.error('Error adding device:', error);
      return { success: false, error };
    }
  };

  const removeDevice = async (deviceId) => {
    try {
      const deviceRef = ref(database, `devices/${deviceId}`);
      await remove(deviceRef);
      return { success: true };
    } catch (error) {
      console.error('Error removing device:', error);
      return { success: false, error };
    }
  };

  return { updateDeviceState, addDevice, removeDevice };
}

export function useRoomActions() {
    const addRoom = async (roomData) => {
        try {
            const roomsRef = ref(database, 'rooms');
            const newRoomRef = push(roomsRef);
            await update(newRoomRef, roomData);
            return { success: true, id: newRoomRef.key};
        } catch (error) {
            console.error('Error adding room:', error);
            return { success: false, error};
        }
    };

    const updateRoom = async (roomId, roomData) => {
        try {
            const roomRef = ref(database, `rooms/${roomId}`);
            await update(roomRef, roomData);
            return { success: true };
        } catch (error) {
            console.error('Error updating room:', error);
            return { success: false, error };
        }
    };

    const removeRoom = async (roomId) => {
        try {
            const devicesRef = ref(database, 'devices');
            const q = query(devicesRef, orderByChild('roomId'), equalTo(roomId));
            const snapshot = await get(q);
            
            const updatesList = {};
            updatesList[`rooms/${roomId}`] = null;
            if (snapshot.exists()) {
                snapshot.forEach((child) => {
                    updatesList[`devices/${child.key}`] = null;
                });
            }
            
            const rootRef = ref(database);
            await update(rootRef, updatesList);
            return { success: true };
        } catch (error) {
            console.error('Error removing room:', error);
            return { success: false, error };
        }
    };

    return { addRoom, updateRoom, removeRoom };
}
