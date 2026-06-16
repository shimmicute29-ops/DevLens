import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

const initialAuthState = {
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  isAuthenticated: !!localStorage.getItem('token')
};

const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'SET_AUTH':
      return { ...state, ...action.payload, isAuthenticated: true };
    case 'CLEAR_AUTH':
      return { token: null, userId: null, isAuthenticated: false };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
