
import shallowEqual from 'react-redux/src/utils/shallowEqual';

export default (store, select, onChange, equalityCheck = shallowEqual) => {
  let lastState = select(store.getState());
  store.subscribe(() => {
    const currentState = select(store.getState());
    if (!equalityCheck(currentState, lastState)) {
      onChange(currentState, lastState);
    }
    lastState = currentState;
  });
};
