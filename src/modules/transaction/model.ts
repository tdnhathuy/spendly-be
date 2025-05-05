// transaction/model.ts
export interface Transaction {
  id: number;
  name: string;
}

export default {
  findAll: async (): Promise<Transaction[]> => {
    return [{ id: 1, name: 'Transaction example' }];
  },
};
