import { api } from './api';
import type { Client } from '../types/Client';

export const clientService = {
  list: () => api.get('/clients') as Promise<Client[]>,
  get: (id: string) => api.get(`/clients/${id}`) as Promise<Client>,
  create: (data: Omit<Client, 'id'>) => api.post('/clients', data) as Promise<Client>,
  update: (id: string, data: Partial<Client>) => api.put(`/clients/${id}`, data) as Promise<Client>,
  remove: (id: string) => api.del(`/clients/${id}`) as Promise<void>,
};
