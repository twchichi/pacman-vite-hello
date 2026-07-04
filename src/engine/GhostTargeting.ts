import { type Ghost, type GhostName, type Position, SCATTER_CORNERS } from './GhostTypes';
import { type Direction } from './Input';

/**
 * Calculate the target position for a ghost based on its name and game state.
 */
export function calculateTarget(
  ghostName: GhostName,
  ghost: Ghost,
  pacman: Position,
  blinky: Ghost,
  mode: 'scatter' | 'chase'
): Position {
  const pacmanDirection = getDirectionFromInput(pacman);

  switch (ghostName) {
    case 'blinky':
      return calculateBlinkyTarget(pacman, mode);
    case 'pinky':
      return calculatePinkyTarget(pacman, pacmanDirection, mode);
    case 'inky':
      return calculateInkyTarget(ghost.pos, pacman, pacmanDirection, blinky, mode);
    case 'clyde':
      return calculateClydeTarget(ghost.pos, pacman, mode);
    default:
      return ghost.pos;
  }
}

function calculateBlinkyTarget(pacman: Position, mode: 'scatter' | 'chase'): Position {
  if (mode === 'scatter') {
    return SCATTER_CORNERS.blinky;
  }
  return pacman;
}

function calculatePinkyTarget(
  pacman: Position,
  pacmanDirection: Direction,
  mode: 'scatter' | 'chase'
): Position {
  if (mode === 'scatter') {
    return SCATTER_CORNERS.pinky;
  }
  const target = getPacmanTargetOffset(pacman, pacmanDirection, 4);
  return wrapPosition(target);
}

function calculateInkyTarget(
  ghostPos: Position,
  pacman: Position,
  pacmanDirection: Direction,
  blinky: Ghost,
  mode: 'scatter' | 'chase'
): Position {
  if (mode === 'scatter') {
    return SCATTER_CORNERS.inky;
  }

  const ahead = getPacmanTargetOffset(pacman, pacmanDirection, 2);

  const vector = {
    col: blinky.pos.col - ahead.col,
    row: blinky.pos.row - ahead.row,
  };

  const target = {
    col: ahead.col + vector.col * 2,
    row: ahead.row + vector.row * 2,
  };

  return wrapPosition(target);
}

function calculateClydeTarget(
  ghostPos: Position,
  pacman: Position,
  mode: 'scatter' | 'chase'
): Position {
  if (mode === 'scatter') {
    return SCATTER_CORNERS.clyde;
  }

  const distance = Math.sqrt(
    Math.pow(ghostPos.col - pacman.col, 2) + Math.pow(ghostPos.row - pacman.row, 2)
  );

  return distance > 8 ? pacman : SCATTER_CORNERS.clyde;
}

function getDirectionFromInput(pacman: Position): Direction {
  return 'right';
}

function getPacmanTargetOffset(
  pacman: Position,
  direction: Direction,
  distance: number
): Position {
  switch (direction) {
    case 'up':
      return { col: pacman.col, row: pacman.row - distance };
    case 'down':
      return { col: pacman.col, row: pacman.row + distance };
    case 'left':
      return { col: pacman.col - distance, row: pacman.row };
    case 'right':
      return { col: pacman.col + distance, row: pacman.row };
    default:
      return pacman;
  }
}

function wrapPosition(pos: Position): Position {
  const wrappedCol = ((pos.col % 28) + 28) % 28;
  const wrappedRow = ((pos.row % 31) + 31) % 31;
  return { col: wrappedCol, row: wrappedRow };
}
