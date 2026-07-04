import { GameLoop, LoopOptions } from './Loop';
import { MapLoader, loadMap } from './MapLoader';
import { TileRenderer } from './TileRenderer';
import { Input } from './Input';
import { Player } from './Player';
import { GhostManager } from './GhostManager';
import { GhostStateController } from './GhostStateController';
import { createAllGhosts, createGhost, type Ghost, type GhostMode, type GhostName, type Position } from './GhostTypes';
import { calculateTarget } from './GhostTargeting';
import { BASE_FRIGHTENED_SCORE, MAX_COMBO } from '../config/frightenedConstants';
const TILE_WALL = 1;
const TILE_PELLET = 2;
const TILE_POWER_PELLET = 3;
const TILE_EMPTY = 0;

export type GameState = 'playing' | 'gameOver' | 'levelClear';

/**
 * Game engine — coordinates game systems (ghosts, player, map, scoring, game state).
 */
export class GameEngine {
  private loop: GameLoop | null = null;
  private mapLoader: MapLoader | null = null;
  private renderer: TileRenderer | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private tileSize = 20;

  public input!: Input;
  private player!: Player;
  private map: number[][] = [];
  private width = 0;
  private height = 0;

  // Pellet tracking
  private pellets: Set<string> = new Set();
  private powerPellets: Set<string> = new Set();
  private totalPellets = 0;

  // Ghosts
  private ghosts: Record<GhostName, Ghost> | null = null;
  private ghostManager: GhostManager | null = null;
  private ghostState: GhostStateController | null = null;
  private frightenedCombo = 0;

  // Score
  private score = 0;

  // Lives
  private lives = 3;

  // Game state
  private gameState: GameState = 'playing';

  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx || null;
  }

  // --- Public API ---

  getScore(): number {
    return this.score;
  }

  getLives(): number {
    return this.lives;
  }

  getGameState(): GameState {
    return this.gameState;
  }

  getMapDimensions(): { width: number; height: number } {
    return {
      width: this.mapLoader?.width ?? 0,
      height: this.mapLoader?.height ?? 0,
    };
  }

  getCanvasElement(): HTMLCanvasElement | null {
    return document.getElementById('game') as HTMLCanvasElement;
  }

  init(): void {
    if (!this.ctx) {
      console.log('[engine] initializing placeholder');
      return;
    }

    const map = loadMap();
    this.mapLoader = map;
    this.renderer = new TileRenderer(this.ctx, this.tileSize);
    this.map = map.getTiles();
    this.width = map.width;
    this.height = map.height;

    // Create player
    this.player = new Player(23, 13, 1);
    this.input = new Input((dir) => {
      this.handleDirectionChange(dir);
    });

    // Create ghost systems
    this.ghosts = createAllGhosts();
    this.ghostManager = new GhostManager();
    this.ghostState = new GhostStateController(this.ghostManager);

    // Initialize ghost directions to face outward (ghost house)
    for (const name of Object.keys(this.ghosts) as GhostName[]) {
      this.ghosts[name].direction = 'none';
    }

    // Collect pellets
    this.collectPellets(this.map);

    console.log(`[engine] loaded map: ${this.width}x${this.height}, player at (${this.player.pos.col}, ${this.player.pos.row})`);
  }

  start(): void {
    if (!this.ctx || !this.renderer) {
      this.startPlaceholder();
      return;
    }

    this.gameState = 'playing';
    this.frightenedCombo = 0;

    // Activate frightened mode initially (optional — classic starts without it)
    // this.ghostManager?.activateFrightenedMode();

    this.loop = new GameLoop({
      fps: 30,
      update: () => this.update(),
    });
    this.loop.start();
  }

  stop(): void {
    this.loop?.stop();
    this.input?.detachKeyboard();
    console.log('[engine] stopping');
  }

  reset(): void {
    this.stop();
    this.score = 0;
    this.lives = 3;
    this.gameState = 'playing';
    this.frightenedCombo = 0;

    if (this.mapLoader) {
      const map = loadMap();
      this.map = map.getTiles();
      this.width = map.width;
      this.height = map.height;
      this.mapLoader = map;
    }

    this.player = new Player(23, 13, 1);
    this.ghosts = createAllGhosts();
    for (const name of Object.keys(this.ghosts) as GhostName[]) {
      this.ghosts[name].direction = 'none';
    }
    this.ghostManager = new GhostManager();
    this.ghostState = new GhostStateController(this.ghostManager);

    this.collectPellets(this.map);

    console.log('[engine] game reset');
  }

  private update(): void {
    if (!this.mapLoader || !this.renderer || !this.player || !this.ghosts || !this.ghostManager || !this.ghostState) {
      return;
    }

    if (this.gameState !== 'playing') return;

    const map = this.map;
    const direction = this.input.getDirection();

    // Apply player movement
    if (direction) {
      const nextPos = this.player.nextPos(direction);
      const nextCol = nextPos.col;
      const nextRow = nextPos.row;

      // Check bounds
      if (nextCol >= 0 && nextCol < this.width && nextRow >= 0 && nextRow < this.height) {
        const tile = map[nextRow][nextCol];
        if (tile !== TILE_WALL) {
          this.player.move(direction);
          this.input.clearQueue();

          // Check for pellet consumption
          this.eatPellet(nextPos.col, nextPos.row, map);
        }
      }
    }

    // Update ghost timers
    this.ghostManager.updateFrightenedTimer(1 / 30); // 30fps = ~33ms per frame

    // Check collision with ghosts
    this.checkGhostCollision();

    // Update eaten ghost timers
    this.updateEatenGhosts();

    // Render
    this.renderer.renderMap(map, this.width, this.height);
    this.renderPlayer();
    this.renderGhosts();
  }

  private eatPellet(col: number, row: number, map: number[][]): void {
    const key = `${col},${row}`;

    // Check power pellet
    if (this.powerPellets.has(key)) {
      this.powerPellets.delete(key);
      this.score += 50;
      this.ghostManager?.activateFrightenedMode();
      this.frightenedCombo = 0;
      map[row][col] = TILE_EMPTY;
      console.log(`[engine] ate power pellet at (${col},${row}), score: ${this.score}`);
      return;
    }

    // Check regular pellet
    if (this.pellets.has(key)) {
      this.pellets.delete(key);
      this.score += 10;
      map[row][col] = TILE_EMPTY;
      console.log(`[engine] ate pellet at (${col},${row}), score: ${this.score}`);
    }

    // Check level clear
    if (this.pellets.size === 0 && this.powerPellets.size === 0) {
      this.gameState = 'levelClear';
      console.log('[engine] level clear!');
    }
  }

  private checkGhostCollision(): void {
    if (!this.player || !this.ghosts || !this.ghostState) return;

    const playerCol = this.player.pos.col;
    const playerRow = this.player.pos.row;

    for (const name of Object.keys(this.ghosts) as GhostName[]) {
      const ghost = this.ghosts[name];
      if (ghost.pos.col === playerCol && ghost.pos.row === playerRow) {
        if (this.ghostManager?.isFrightenedActive()) {
          // Eat the ghost
          this.frightenedCombo++;
          const score = BASE_FRIGHTENED_SCORE * Math.pow(2, Math.min(this.frightenedCombo - 1, MAX_COMBO - 1));
          this.score += score;
          this.ghostState.setEaten(ghost);
          ghost.mode = 'eaten';
          console.log(`[engine] ate ghost ${name}, combo: ${this.frightenedCombo}, score: ${this.score}`);
        } else if (ghost.mode === 'eaten') {
          // Ghost is already eaten (eyes returning), pass through
          continue;
        } else {
          // Player gets hit
          this.playerDied();
          break;
        }
      }
    }
  }

  private playerDied(): void {
    this.lives--;
    this.frightenedCombo = 0;

    if (this.lives <= 0) {
      this.gameState = 'gameOver';
      console.log('[engine] game over!');
    } else {
      // Reset positions but keep score and map state
      this.player.reset(23, 13);
      for (const name of Object.keys(this.ghosts) as GhostName[]) {
        this.ghosts[name] = createGhost(name);
        this.ghosts[name].direction = 'none';
      }
      this.ghostState?.reset();
      console.log(`[engine] player died, lives left: ${this.lives}`);
    }
  }

  private updateEatenGhosts(): void {
    if (!this.ghostState || !this.ghosts) return;

    const respawned = this.ghostState.updateEatenTimers(1 / 30); // 30fps
    for (const name of respawned) {
      this.ghosts[name] = createGhost(name);
      this.ghosts[name].direction = 'none';
      console.log(`[engine] ghost ${name} respawned`);
    }
  }

  private renderPlayer(): void {
    if (!this.ctx || !this.player || !this.renderer) return;

    const { col, row } = this.player.pos;
    const px = col * this.tileSize;
    const py = row * this.tileSize;

    this.ctx.fillStyle = '#ffff00'; // yellow for Pac-Man
    this.ctx.beginPath();
    this.ctx.arc(
      px + this.tileSize / 2,
      py + this.tileSize / 2,
      this.tileSize * 0.4,
      0,
      Math.PI * 2
    );
    this.ctx.fill();
  }

  private renderGhosts(): void {
    if (!this.ctx || !this.ghosts) return;

    for (const name of Object.keys(this.ghosts) as GhostName[]) {
      const ghost = this.ghosts[name];
      const px = ghost.pos.col * this.tileSize;
      const py = ghost.pos.row * this.tileSize;

      // Ghost color based on mode
      if (ghost.mode === 'frightened') {
        this.ctx.fillStyle = '#0000ff'; // blue for frightened
      } else if (ghost.mode === 'eaten') {
        this.ctx.fillStyle = '#333'; // dark for eaten (eyes)
      } else {
        // Ghost color based on name
        switch (name) {
          case 'blinky': this.ctx.fillStyle = '#ff0000'; break; // red
          case 'pinky': this.ctx.fillStyle = '#ffb8ff'; break; // pink
          case 'inky': this.ctx.fillStyle = '#00ffff'; break; // cyan
          case 'clyde': this.ctx.fillStyle = '#ffb852'; break; // orange
          default: this.ctx.fillStyle = '#ff0000';
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(
        px + this.tileSize / 2,
        py + this.tileSize / 2,
        this.tileSize * 0.4,
        0,
        Math.PI * 2
      );
      this.ctx.fill();
    }
  }

  private collectPellets(map: number[][]): void {
    this.pellets.clear();
    this.powerPellets.clear();
    this.totalPellets = 0;

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const tile = map[row][col];
        if (tile === TILE_PELLET) {
          this.pellets.add(`${col},${row}`);
          this.totalPellets++;
        } else if (tile === TILE_POWER_PELLET) {
          this.powerPellets.add(`${col},${row}`);
          this.totalPellets++;
        }
      }
    }

    console.log(`[engine] collected ${this.pellets.size} pellets, ${this.powerPellets.size} power pellets`);
  }

  private handleDirectionChange(direction: import('./Input').Direction): void {
    // Direction is already queued by input system
    console.log(`[engine] direction changed to: ${direction}`);
  }

  private startPlaceholder(): void {
    console.log('[engine] starting placeholder');
  }
}
