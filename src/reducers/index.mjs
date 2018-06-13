import { actions, directions, playerStates } from '../utils/constants.mjs';
import { segmentIntersectsPolyline, segmentsIntersect } from '../utils/calc.mjs';

export const SECOND = 1000;
export const START_COUNTDOWN = 3 * SECOND;
export const CRASH_LINGER = 2 * SECOND;
const {
  BOARD_SET, PLAYER_ADD, PLAYER_CURRENT, PLAYER_DIRECTION, TIME,
} = actions;
const { STARTING, PLAYING, CRASHED } = playerStates;

export const initialState = {
  time: 0,
  players: {},
  obstacles: [],
};

const initializePlayer = (x, y, currentTime) => ({
  x,
  y,
  startTime: currentTime + START_COUNTDOWN,
  status: STARTING,
  speed: 50 / SECOND,
  direction: directions.UP,
  lastDirection: null,
  path: [],
});

// Filters out directions that are the same or opposite
const getNextDirection = (next, prev) => {
  if (next === prev) return null;
  if (prev && next[0] === -prev[0] && next[1] === -prev[1]) return null;
  return next;
};

export default (state = initialState, action) => {
  if (!action) return state;
  const updatePlayer = (name, patch) => {
    const { players } = state;
    const player = players[name];
    return { ...state, players: { ...players, [name]: { ...player, ...patch } } };
  };

  switch (action.type) {
    case BOARD_SET: {
      const obstacles = action.data;
      const [perimeter] = obstacles;
      const Xs = perimeter.map(point => point[0]);
      const Ys = perimeter.map(point => point[1]);
      const minX = Math.min(...Xs);
      const minY = Math.min(...Ys);
      const maxX = Math.max(...Xs);
      const maxY = Math.max(...Ys);
      return {
        ...state, obstacles, minX, maxX, minY, maxY,
      };
    }

    case PLAYER_ADD: {
      const { x, y, name } = action.data;
      // Ignore adding players with a name that already exists on the board
      const current = state.players[name];
      if (current && current.status !== CRASHED) return state;
      return updatePlayer(name, initializePlayer(x, y, state.time));
    }

    case PLAYER_CURRENT: {
      return { ...state, currentPlayer: action.data };
    }

    case PLAYER_DIRECTION: {
      const { direction: nextDirection, name } = action.data;
      const { direction, lastDirection, status } = state.players[name];
      if (status === CRASHED) return state;
      const plannedDirection = getNextDirection(nextDirection, lastDirection);
      if (!plannedDirection || plannedDirection === direction) return state;
      return updatePlayer(name, { direction: plannedDirection });
    }

    case TIME: {
      const increment = action.data;
      const time = state.time + increment;
      const { players } = state;
      const playerList = Object.keys(players);
      const playerPaths = playerList.map(name => players[name].path);
      const obstacles = state.obstacles.concat(playerPaths);
      const playerPathHeads = playerList.filter(name => players[name].status !== STARTING).map((name) => {
        const { x, y, path } = players[name];
        const lastPoint = path[path.length - 1];
        return [lastPoint, [x, y], name];
      });
      const newPlayers = {};
      let somePlayersChanged = false;
      playerList.forEach((name) => {
        const player = players[name];
        const newPlayer = { ...player };
        switch (player.status) {
          case STARTING:
            if (time < player.startTime) {
              newPlayers[name] = player;
              break;
            }
            newPlayer.status = PLAYING;
            // fall through, because now we're playing!

          case PLAYING: {
            somePlayersChanged = true;
            newPlayer.x += increment * player.direction[0] * player.speed;
            newPlayer.y += increment * player.direction[1] * player.speed;
            newPlayers[name] = newPlayer;

            // check for collisions with paths and obstacles
            const p1 = [player.x, player.y];
            const p2 = [newPlayer.x, newPlayer.y];
            obstacles.some((obstacle) => {
              if (segmentIntersectsPolyline(p1, p2, obstacle)) {
                newPlayer.status = CRASHED;
                newPlayer.crashTime = time;
                return true;
              }
              return false;
            });

            // check if the player crashes into the heads of each path
            if (newPlayer.status !== CRASHED) {
              playerPathHeads.forEach(([p3, p4, headName]) => {
                if (headName === name) return;
                if (segmentsIntersect(p1, p2, p3, p4)) {
                  newPlayer.status = CRASHED;
                  newPlayer.crashTime = time;
                }
              });
            }

            // Add any changes in direction to the path
            if (player.direction !== player.lastDirection) {
              newPlayer.path = player.path.concat([[player.x, player.y]]);
              newPlayer.lastDirection = player.direction;
            }
            break;
          }

          case CRASHED: {
            if (time - player.crashTime < CRASH_LINGER) newPlayers[name] = player;
            else somePlayersChanged = true;
            break;
          }

          default:
            newPlayers[name] = player;
        }
      });
      return { ...state, time, players: somePlayersChanged ? newPlayers : players };
    }

    default:
      return state;
  }
};