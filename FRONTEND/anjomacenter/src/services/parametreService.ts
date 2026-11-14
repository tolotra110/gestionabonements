import { api } from './api';
import type { Parametres } from '../types/Parametres';

export const parametreService = {
  get: () => api.get('/parametres') as Promise<Parametres>,
  update: (data: Partial<Omit<Parametres, 'id' | 'updated_at'>>) =>
    api.put('/parametres', data) as Promise<Parametres>,
};
