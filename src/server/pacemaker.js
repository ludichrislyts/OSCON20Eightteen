/* eslint-env: node */
let interval = null;
const subs = [];

const tick = () => {
  const time = Date.now();
  subs.forEach(sub => { sub(time); });
};

const subscribe = sub => {
  if (subs.indexOf(sub) !== -1) return;
  subs.push(sub);

  if (!interval) interval = setInterval(tick, 10000);
};

const getSubs = () => subs;

const unsubscribe = sub => {
  if (subs.indexOf(sub) === -1) return;
  subs.splice(subs.indexOf(sub), 1);
  if (!subs.length) {
    clearInterval(interval);
    interval = null;
  }
};

module.exports = {
  subscribe,
  getSubs,
  unsubscribe,
};
