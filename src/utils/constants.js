export const actions = {
  BOARD_SET: 'BOARD_SET',
  PLAYER_ADD: 'PLAYER_ADD',
  PLAYER_CURRENT: 'PLAYER_CURRENT',
  PLAYER_DIRECTION: 'PLAYER_DIRECTION',
  TIME: 'TIME',
};

export const directions = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

export const playerStates = {
  STARTING: 'STARTING',
  PLAYING: 'PLAYING',
  CRASHED: 'CRASHED',
};
