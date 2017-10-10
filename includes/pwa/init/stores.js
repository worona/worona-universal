import { types, getSnapshot, applySnapshot } from 'mobx-state-tree';

const Router = types
  .model('Router')
  .props({
    id: types.number,
    type: types.string,
  })
  .actions(self => ({
    push: ({ id, type }) => {
      self.id = id;
      self.type = type;
    }
  }));

const Stores = types
  .model('Stores')
  .props({
    color: 'red',
    router: Router,
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

const stores = Stores.create({ router: { id: 0, type: 'post' } });

if (typeof window !== 'undefined') window.stores = stores;

export default stores;

if (module.hot) {
  if (module.hot.data && module.hot.data.store) applySnapshot(stores, module.hot.data.store);
  module.hot.dispose(data => {
    data.store = getSnapshot(stores);
  });
}
