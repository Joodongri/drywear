import { ADD_ITEM } from '../actions/actions'

// initialState contains an empty array of items
const initialState = {
  items: [],
};

const itemsReducer = (state=initialState, action) => {

// adds an item by making a copy of state with an item as payload
switch(action.type) {
  case ADD_ITEM :
  return {
    ...state,
    token: action.payload
  }
  default:
    return state;
}

};

export default itemsReducer;
