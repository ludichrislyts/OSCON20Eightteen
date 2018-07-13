const OBJECT = {};
let state = OBJECT;

export default (reducer) => {
  state = reducer();
  const dispatch = (action) => {
    state = reducer(state, action);
  };
  const getState = () => state;
  return { dispatch, getState };
};
