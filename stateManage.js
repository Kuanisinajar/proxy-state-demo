class PubSub {
  constructor() {
    this.events = {}
  }

  subscribe(event, callback) {
    if (!this.events.hasOwnProperty(event)) {
      this.events[event] = [];
    }

    return this.events[event].push(callback);
  }

  publish(event, data = {}) {
    if (!this.events.hasOwnProperty(event)) {
      this.events[event] = [];
    }

    return this.events[event].map(callback => callback(data));
  }
}

class Store {
  constructor({ actions, mutations, state }) {
    this.actions = actions || {};
    this.mutations = mutations || {};
    this.state = {};
    this.status = 'resting';

    this.events = new PubSub();

    this.state = new Proxy(state || {}, {
      set: (currentState, key, value) => {
        currentState[key] = value;

        console.log(`state-change: ${key}: ${value}`);

        this.events.publish('stateChange', this.state);

        if(this.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        }

        this.status = 'resting';

        return true
      }
    })
  }

  dispatch(action, payload) {
    if(typeof this.actions[action] !== 'function') {
      console.error(`Action "${action} doesn't exist.`);
      return false;
    }

    console.groupCollapsed(`ACTION: ${action}`);

    this.status = 'action';

    this.actions[action](this, payload);

    console.groupEnd();

    return
  }

  commit(mutation, payload) {
    if(typeof this.mutations[mutation] !== 'function') {
      console.log(`Mutation "${mutation}" doesn't exist`);
      return false;
    }
  
    this.status = 'mutation';
  
    const newState = this.mutations[mutation](this.state, payload);

    console.log(newState, 'newState')
  
    this.state = Object.assign(this.state, newState);
  
    return;
  }
}

const state = {
  items: []
}

const actions = {
  addItem(context, payload) {
    context.commit('addItem', payload);
  },
  clearItem(context, payload) {
    context.commit('clearItem', payload);
  }
}

const mutations = {
  addItem(state, payload) {
    state.items.push(payload);

    return state;
  },
  clearItem(state, payload) {
    state.items.splice(payload.index, 1);

    return state;
  }
}

const store = new Store({
  state,
  actions,
  mutations,
})

store.events.subscribe('stateChange', (change) => {
  console.log(change.items, 'catch changes')
})

store.dispatch('addItem', 1)
store.dispatch('addItem', 2)
store.dispatch('addItem', 3)


