let streetTiles = [];
let maxOffset = 20000;
let tileSize = 32;
let sectionWidth = 719;


for (let x = -tileSize * 10; x <= maxOffset; x += tileSize) {
  streetTiles.push(new Street(x));
}

const enemyPositions = [
  { x: 900, range: 50 },
  { x: 1800, range: 60 },
  { x: 3000, range: 50 },
  { x: 4200, range: 60 },
  { x: 5100, range: 70 },
];

const patrolEnemies = enemyPositions.map((pos) => {
  const enemy = new Enemy();
  enemy.x = pos.x;
  enemy.patrolStart = pos.x;
  enemy.patrolEnd = pos.x + pos.range;
  return enemy;
});


const robotEnemies = [];
for (let i = 0; i < 3; i++) {

  let spawnX = Math.random() * (10000 - 719) + 719;
  let robot = new RobotEnemy();
  robot.x = spawnX;

  robot.patrolStart = spawnX;
  robot.patrolEnd = spawnX + 1000;
  robotEnemies.push(robot);
}


const copterEnemies = [];
for (let i = 0; i < 3; i++) {
  let spawnX = Math.random() * (10000 - 719) + 719;
  let copter = new CopterEnemy();
  copter.x = spawnX;
  copter.patrolStart = spawnX;
  copter.patrolEnd = spawnX + 1000;
  copterEnemies.push(copter);
}

const initialEnemies = [
  ...patrolEnemies,
  ...copterEnemies,
  ...robotEnemies,
  new Endboss()
];

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

level1 = new Level(
  initialEnemies,
  streetTiles,
  backgroundObjects,
  7000
);
