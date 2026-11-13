import { api } from './api';
import type { Abonnement } from '../types/abonemment';

export type AbonnementInput = Omit<Abonnement, 'id' | 'statut'> & { statut?: string };

export const abonnementService = {
  list: () => api.get('/abonnements') as Promise<Abonnement[]>,
  get: (id: number) => api.get(`/abonnements/${id}`) as Promise<Abonnement>,
  create: (data: AbonnementInput) => api.post('/abonnements', data) as Promise<Abonnement>,
  update: (id: number, data: Partial<AbonnementInput>) => api.put(`/abonnements/${id}`, data) as Promise<Abonnement>,
  remove: (id: number) => api.del(`/abonnements/${id}`) as Promise<void>,
};
