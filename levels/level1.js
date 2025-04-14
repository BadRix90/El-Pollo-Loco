let streetTiles = [];
let maxOffset = 20000;
let tileSize = 32;
let sectionWidth = 719;


/**
 * Array of street tiles forming the ground layer of the level.
 * Each tile is 32px wide and stretches from a negative offset to the maxOffset.
 */
for (let x = -tileSize * 10; x <= maxOffset; x += tileSize) {
  streetTiles.push(new Street(x));
}


/**
 * Predefined x-positions and patrol ranges for basic ground enemies.
 */
const enemyPositions = [
  { x: 900, range: 50 },
  { x: 1800, range: 60 },
  { x: 3000, range: 50 },
  { x: 4200, range: 60 },
  { x: 5100, range: 70 },
];


/**
 * Array of ground-based enemies initialized with patrol ranges based on enemyPositions.
 */
const patrolEnemies = enemyPositions.map((pos) => {
  const enemy = new Enemy();
  enemy.x = pos.x;
  enemy.patrolStart = pos.x;
  enemy.patrolEnd = pos.x + pos.range;
  return enemy;
});


/**
 * Array of robot enemies with randomized spawn positions and fixed patrol range.
 */
const robotEnemies = [];
for (let i = 0; i < 3; i++) {

  let spawnX = Math.random() * (10000 - 719) + 719;
  let robot = new RobotEnemy();
  robot.x = spawnX;

  robot.patrolStart = spawnX;
  robot.patrolEnd = spawnX + 1000;
  robotEnemies.push(robot);
}


/**
 * Array of copter enemies with randomized spawn positions and fixed patrol range.
 */
const copterEnemies = [];
for (let i = 0; i < 3; i++) {
  let spawnX = Math.random() * (10000 - 719) + 719;
  let copter = new CopterEnemy();
  copter.x = spawnX;
  copter.patrolStart = spawnX;
  copter.patrolEnd = spawnX + 1000;
  copterEnemies.push(copter);
}


/**
 * Combined list of all enemies in the level, including patrol, robot, copter enemies, and the endboss.
 */
const initialEnemies = [
  ...patrolEnemies,
  ...copterEnemies,
  ...robotEnemies,
  new Endboss()
];


/**
 * Background objects for all parallax layers in the level.
 * Generated per section with increasing x-offset and varied theme numbers.
 */
const backgroundObjects = [];
const parallaxFactors = [0.05, 0.1, 0.6, 0.2, 0.25];

const sections = [];
sections.push({ number: 1, offset: -719 });

for (let offset = 0; offset <= maxOffset; offset += sectionWidth) {
  const themeNumber = (Math.floor(offset / sectionWidth) % 8) + 1;
  sections.push({ number: themeNumber, offset: offset });
}

sections.forEach(section => {
  for (let layer = 1; layer <= 5; layer++) {
    backgroundObjects.push(
      new BackgroundObject(
        `img/5_background/backgrounds_cyberpunk/${section.number}/Night/${layer}.png`,
        section.offset,
        parallaxFactors[layer - 1]
      )
    );
  }
});


/**
 * The Level instance representing the full level configuration:
 * enemies, street tiles, background objects, and the endboss trigger distance.
 */
level1 = new Level(
  initialEnemies,
  streetTiles,
  backgroundObjects,
  7000
);
