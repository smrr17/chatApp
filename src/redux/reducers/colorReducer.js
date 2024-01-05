const INITIAL_STATES = {
    darkMode: 'black',
  };
  export default function (state = INITIAL_STATES, action) {
    switch (action.type) {
      case 'DARK_MODE':
        return {
          ...state,
          darkMode: action.payload,
        };
  
      default:
        return state;
    }
  }
  