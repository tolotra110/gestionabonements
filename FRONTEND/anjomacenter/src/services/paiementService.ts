import { api } from './api';
import type { Paiement, PaiementInput } from '../types/Paiement';

export const paiementService = {
  list: () => api.get('/paiements') as Promise<Paiement[]>,
  get: (id: number) => api.get(`/paiements/${id}`) as Promise<Paiement>,
  listByAbonnement: (id: number) =>
    api.get(`/paiements/abonnement/${id}`) as Promise<Paiement[]>,
  create: (data: PaiementInput) => api.post('/paiements', data) as Promise<Paiement>,
  remove: (id: number) => api.del(`/paiements/${id}`) as Promise<void>,
};
