import { api } from "./api";
import type { CaisseOperation, CaisseOperationInput } from "../types/Caisse";

export const caisseService = {
  list: () => api.get("/caisse") as Promise<CaisseOperation[]>,
  create: (operation: CaisseOperationInput) =>
    api.post("/caisse", operation) as Promise<CaisseOperation>,
  update: (id: number, operation: CaisseOperationInput) =>
    api.put(`/caisse/${id}`, operation) as Promise<CaisseOperation>,
  remove: (id: number) => api.del(`/caisse/${id}`) as Promise<void>,
};
