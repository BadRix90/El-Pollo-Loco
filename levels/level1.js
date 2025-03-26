let streetTiles = [];
let levelWidth = 5400;
let tileSize = 32;

for (let x = -tileSize * 10; x <= levelWidth; x += tileSize) {
  streetTiles.push(new Street(x));
}

const enemyPositions = [
  { x: 600, range: 50 },
  { x: 1800, range: 60 },
  { x: 3000, range: 50 },
  { x: 4200, range: 60 },
  { x: 5100, range: 70 },
  { x: 5300, range: 90 },
];

const patrolEnemies = enemyPositions.map((pos) => {
  const enemy = new Enemy();
  enemy.x = pos.x;
  enemy.patrolStart = pos.x;
  enemy.patrolEnd = pos.x + pos.range;
  return enemy;
});

const initialEnemies = [...patrolEnemies, new Endboss()];

const level1 = new Level(
  initialEnemies,
  streetTiles,

  [
    // Abschnitt 0
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/1.png",
      -719,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/2.png",
      -719,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/3.png",
      -719,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/4.png",
      -719,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/5.png",
      -719,
      0.25
    ),
    // Abschnitt 1
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/1.png",
      0,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/2.png",
      0,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/3.png",
      0,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/4.png",
      0,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/1/Day/5.png",
      0,
      0.25
    ),

    // Abschnitt a2
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/2/Day/1.png",
      719,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/2/Day/2.png",
      719,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/2/Day/3.png",
      719,
      0.15
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/2/Day/4.png",
      719,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/2/Day/5.png",
      719,
      0.25
    ),

    // Abschnitt 3
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/3/Day/1.png",
      1438,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/3/Day/2.png",
      1438,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/3/Day/3.png",
      1438,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/3/Day/4.png",
      1438,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/3/Day/5.png",
      1438,
      0.25
    ),

    // Abschnitt 4
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/4/Day/1.png",
      2157,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/4/Day/2.png",
      2157,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/4/Day/3.png",
      2157,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/4/Day/4.png",
      2157,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/4/Day/5.png",
      2157,
      0.25
    ),

    // Abschnitt 5
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/5/Day/1.png",
      2876,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/5/Day/2.png",
      2876,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/5/Day/3.png",
      2876,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/5/Day/4.png",
      2876,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/5/Day/5.png",
      2876,
      0.25
    ),

    // Abschnitt 6
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/6/Day/1.png",
      3595,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/6/Day/2.png",
      3595,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/6/Day/3.png",
      3595,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/6/Day/4.png",
      3595,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/6/Day/5.png",
      3595,
      0.25
    ),

    // Abschnitt 7
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/7/Day/1.png",
      4314,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/7/Day/2.png",
      4314,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/7/Day/3.png",
      4314,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/7/Day/4.png",
      4314,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/7/Day/5.png",
      4314,
      0.25
    ),

    // Abschnitt 8
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/8/Day/1.png",
      5033,
      0.05
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/8/Day/2.png",
      5033,
      0.1
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/8/Day/3.png",
      5033,
      0.6
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/8/Day/4.png",
      5033,
      0.2
    ),
    new BackgroundObject(
      "img/5_background/backgrounds_cyberpunk/8/Day/5.png",
      5033,
      0.25
    ),
  ]
);
