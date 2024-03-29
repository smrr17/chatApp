const INITIAL_STATES = {
  user: {},
};
export default function (state = INITIAL_STATES, action) {
  switch (action.type) {
    case 'SAVE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...INITIAL_STATES,
      };
    default:
      return state;
  }
}
