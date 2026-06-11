import { useState, useEffect, useRef } from 'react';
import { ref, onValue, update, remove, push, set } from 'firebase/database';
import { database } from '../firebase/config';
import toast from 'react-hot-toast';

export function useLixeiras() {
  const [lixeiras, setLixeiras] = useState({});
  const [loading, setLoading] = useState(true);
  const prevLixeirasRef = useRef({});

  useEffect(() => {
    const lixeirasRef = ref(database, 'lixeiras');
    const unsubscribe = onValue(lixeirasRef, (snapshot) => {
      const data = snapshot.val() || {};
      
      // Check for newly full bins
      Object.entries(data).forEach(([id, lixeira]) => {
        const prevStatus = prevLixeirasRef.current[id]?.state?.status;
        const currentStatus = lixeira.state?.status;
        
        if (currentStatus === 'full' && prevStatus !== 'full') {
          toast.error(`Atenção: A lixeira "${lixeira.name || id}" atingiu capacidade máxima!`, {
            duration: 6000,
            icon: '⚠️',
          });
        }
      });
      
      prevLixeirasRef.current = data;
      setLixeiras(data);
      setLoading(false);
    }, (error) => {
      console.error("Firebase onValue Error:", error);
      toast.error("Erro de permissão no Firebase");
    });

    return () => unsubscribe();
  }, []);

  return { lixeiras, loading };
}

export function useLixeiraActions() {
  const addLixeira = async (lixeiraData) => {
    try {
      const lixeirasRef = ref(database, 'lixeiras');
      const newLixeiraRef = push(lixeirasRef);
      await set(newLixeiraRef, {
        ...lixeiraData,
        online: false,
        alertPin: false,
        state: {
          fillLevel: 0,
          status: 'normal',
          lastSeen: Date.now()
        }
      });
      return { success: true, id: newLixeiraRef.key };
    } catch (error) {
      console.error('Error adding lixeira:', error);
      return { success: false, error };
    }
  };

  const updateLixeira = async (id, data) => {
    try {
      const lixeiraRef = ref(database, `lixeiras/${id}`);
      await update(lixeiraRef, data);
      return { success: true };
    } catch (error) {
      console.error('Error updating lixeira:', error);
      return { success: false, error };
    }
  };

  const removeLixeira = async (id) => {
    try {
      const lixeiraRef = ref(database, `lixeiras/${id}`);
      await remove(lixeiraRef);
      return { success: true };
    } catch (error) {
      console.error('Error removing lixeira:', error);
      return { success: false, error };
    }
  };

  const resetAlert = async (id) => {
    try {
      const alertRef = ref(database, `lixeiras/${id}`);
      await update(alertRef, { alertPin: false });
      return { success: true };
    } catch (error) {
      console.error('Error resetting alert:', error);
      return { success: false, error };
    }
  };

  return { addLixeira, updateLixeira, removeLixeira, resetAlert };
}
