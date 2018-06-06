import actions from './index';

const { board, player, time } = actions;

const simpleBoard = [[
  [0, 0], [50, 0], [50, 50], [0, 0],
]];

describe('actions', () => {
  describe('board', () => {
    describe('load()', () => {
      it('works with a simple boundary', () => {
        expect(board.load(simpleBoard)).toEqual({ type: 'BOARD_SET', data: simpleBoard });
      });

      it('rejects unless provided with an array of arrays of arrays', () => {
        expect(() => board.load('garbage')).toThrow(/must be an array/);
        expect(() => board.load([3, 2])).toThrow(/array of arrays/);
        expect(() => board.load([[3, 2]])).toThrow(/array of arrays of arrays/);
      });

      it('rejects unless deepest arrays are numeric', () => {
        expect(() => board.load([[['garbage']]])).toThrow(/numeric/);
      });

      it('rejects unless deepest arrays are 2D points', () => {
        expect(() => board.load([[[3]]])).toThrow(/point.*length.*2/i);
        expect(() => board.load([[[3, 2, 1]]])).toThrow(/point.*length.*2/i);
      });

      it('rejects unless all polylines have at least 2-points', () => {
        expect(() => board.load([[[3, 2]]])).toThrow(/at least.*2.*points/);
      });

      it('rejects unless boundary has at least 3 points', () => {
        expect(() => board.load([[[3, 2], [1, 0]]])).toThrow(/boundary.*at least.*3.*points/i);
      });

      it('rejects unless boundary is self-closing', () => {
        expect(() => board.load([[[3, 2], [1, 0], [3, 3]]])).toThrow(/boundary.*self.*closing/i);
      });
    });
  });

  describe('player', () => {
    describe('add()', () => {
      it('works with simple numbers', () => {
        expect(player.add('matt', 20, 15)).toEqual({ type: 'PLAYER_ADD', data: { name: 'matt', x: 20, y: 15 } });
        expect(player.add('matt', 0, 0)).toEqual({ type: 'PLAYER_ADD', data: { name: 'matt', x: 0, y: 0 } });
      });

      it('converts non-numberics', () => {
        expect(player.add('matt', '20', '15')).toEqual({ type: 'PLAYER_ADD', data: { name: 'matt', x: 20, y: 15 } });
      });

      it('throws garbage', () => {
        expect(() => player.add('matt', 'junk', 3)).toThrow();
        expect(() => player.add('matt', 3, 'junk')).toThrow();
      });

      it('throws nulls and undefineds', () => {
        expect(() => player.add('matt', null, 3)).toThrow();
        expect(() => player.add('matt', undefined, 3)).toThrow();
        expect(() => player.add('matt', 3)).toThrow();
        expect(() => player.add('matt', 3, null)).toThrow();
        expect(() => player.add('matt', 3, undefined)).toThrow();
      });
    });

    it('up()', () => {
      expect(player.up('ian')).toEqual({ type: 'PLAYER_DIRECTION', data: { name: 'ian', direction: [0, -1] } });
    });
    it('down()', () => {
      expect(player.down('ian')).toEqual({ type: 'PLAYER_DIRECTION', data: { name: 'ian', direction: [0, 1] } });
    });
    it('left()', () => {
      expect(player.left('ian')).toEqual({ type: 'PLAYER_DIRECTION', data: { name: 'ian', direction: [-1, 0] } });
    });
    it('right()', () => {
      expect(player.right('ian')).toEqual({ type: 'PLAYER_DIRECTION', data: { name: 'ian', direction: [1, 0] } });
    });
  });

  describe('time()', () => {
    it('rejects non-numbers', () => {
      expect(() => time('lame')).toThrow();
      expect(() => time([3, 4])).toThrow();
      expect(() => time({})).toThrow();
      expect(() => time(NaN)).toThrow();
      expect(() => time(Infinity)).toThrow();
    });
    it('rejects falsies', () => {
      expect(() => time(0.0)).toThrow();
      expect(() => time(0)).toThrow();
      expect(() => time(false)).toThrow();
      expect(() => time(undefined)).toThrow();
      expect(() => time(null)).toThrow();
    });
  });
});
