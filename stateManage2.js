class EventController {
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
  constructor({ mutations, state }) {
    this.mutations = mutations || {};

    this.events = new EventController();

    this.state = new Proxy(state || {}, {
      set: (currentState, key, value) => {
        currentState[key] = value;

        this.events.publish('stateChange', this.state);

        return true
      }
    })
  }

  dispatch(action, payload) {
    if(typeof this.mutations[action] !== 'function') {
      console.log(`Mutation "${mutation}" doesn't exist`);
      return false;
    }
    
    const newState = this.mutations[action](this.state, payload);
  
    this.state = Object.assign(this.state, newState);
  
    return;
  }
}

const state = {
  items: []
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
  mutations,
})


class Component {
  constructor({ store }) {
    this.render = (count) => {
      console.log(count)
      document.querySelector('#root').innerHTML = `現在有 ${count} 個東西`;
    }

    if(store instanceof Store) {
      store.events.subscribe('stateChange', ({items}) => {
        console.log(items);
        this.render(items.length)
      });
    }
  }
}

const a = new Component({store})

document.getElementById('btn').addEventListener('click', () => {
  store.dispatch('addItem', 1)
})


store.dispatch('addItem', 2)
store.dispatch('addItem', 3)

