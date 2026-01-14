import { useEffect } from 'react';
import { socketService } from '../services/socketService';

export function useSocket(projectId: string | null, onEvent: (event: string, data: any) => void) {
  useEffect(() => {
    if (!projectId) return;

    const socket = socketService.connect();
    socketService.subscribeToProject(projectId);

    socketService.on('new:event', (data) => onEvent('new:event', data));
    socketService.on('update:metric', (data) => onEvent('update:metric', data));
    socketService.on('batch:events', (data) => onEvent('batch:events', data));

    return () => {
      socketService.unsubscribeFromProject(projectId);
      socketService.off('new:event');
      socketService.off('update:metric');
      socketService.off('batch:events');
    };
  }, [projectId, onEvent]);
}
