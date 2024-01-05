import { combineReducers } from 'redux';
import reducer from './reducer'
import colorReducer from './colorReducer';

const allReducers = combineReducers({
    reducer,
    colorReducer,
    
});

export default allReducers;