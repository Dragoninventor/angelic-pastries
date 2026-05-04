import * as migration_20260504_065334_initial from './20260504_065334_initial';

export const migrations = [
  {
    up: migration_20260504_065334_initial.up,
    down: migration_20260504_065334_initial.down,
    name: '20260504_065334_initial'
  },
];
