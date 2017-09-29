import { types, getSnapshot, applySnapshot } from 'mobx-state-tree';

const Stores = types
  .model('Stores', {
    color: 'red',
  })
  .views(self => ({
    get colorAndNumber() {
      return `${self.color} and 7`;
    },
  }))
  .actions(self => ({
    toggleColor: () => {
      self.color = self.color === 'red' ? 'blue' : 'red';
    },
  }));

const stores = Stores.create({});

if (typeof window !== 'undefined') window.stores = stores;

export default stores;

if (module.hot) {
  if (module.hot.data && module.hot.data.store) applySnapshot(stores, module.hot.data.store);
  module.hot.dispose(data => {
    data.store = getSnapshot(stores);
  });
}
