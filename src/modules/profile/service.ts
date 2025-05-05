// profile/service.ts
import model from './model';

export default {
  getAll: async () => {
    return await model.findAll();
  },
};
