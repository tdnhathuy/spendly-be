// profile/model.ts
export interface Profile {
  id: number;
  name: string;
}

export default {
  findAll: async (): Promise<Profile[]> => {
    return [{ id: 1, name: 'Profile example' }];
  },
};
