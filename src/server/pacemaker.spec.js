import pacemaker from './pacemaker';

const noop = () => {};

describe('Pacemaker', () => {
  it('should expose list of subscribers', () => {
    expect(pacemaker.getSubs()).toEqual([]);
  });
  it('should subscribe listeners', () => {
    pacemaker.subscribe(noop);
    const subs = pacemaker.getSubs();
    expect(subs).toEqual([noop]);
  });
  it('should remove listeners', () => {
    pacemaker.subscribe(noop);
    let subs = pacemaker.getSubs();
    expect(subs).toHaveLength(1);
    pacemaker.unsubscribe(noop);
    subs = pacemaker.getSubs();
    expect(subs).toEqual([]);
  });
  it('should call subscribers with a timestamp', (done) => {
    const func = (time) => {
      expect(time).toBeTruthy();
      done();
    };
    pacemaker.subscribe(func);
  });
  it('should allow interval to be set', () => {
    expect(true).toEqual(false);
  });
});

