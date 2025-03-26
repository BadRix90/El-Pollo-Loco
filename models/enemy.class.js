class Enemy extends MovableObject {
  y = 250;
  height = 200;
  width = 100;
  speed = 0.3 + Math.random() * 0.25;

  IMAGES_WALKING = [
    'img/cyberpunk-characters-pixel-art/4 Enemies/1 Worker/frames/Run/Run_frame_1.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/1 Worker/frames/Run/Run_frame_2.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/1 Worker/frames/Run/Run_frame_3.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/1 Worker/frames/Run/Run_frame_4.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/1 Worker/frames/Run/Run_frame_5.png',
    'img/cyberpunk-characters-pixel-art/4 Enemies/1 Worker/frames/Run/Run_frame_6.png'
  ];

  constructor() {
    super().loadImage('img/cyberpunk-characters-pixel-art/4 Enemies/1 Worker/frames/Run/Run_frame_1.png');
    this.x = 200 + Math.random() * 500;
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
    this.hitboxOffset = {
      top: 50,
      bottom: 0,
      left: 12,   // 👈 Bild-Offset ausgleichen
      right: 20
    };
  }    

  animate() {
    setInterval(() =>{
      this.moveLeft();
    }, 1000 / 60);

    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);
      setInterval(() => this.resetPosition(), 1000 / 600);
    }, 100 / this.speed);
  }

  resetPosition() {
    if (this.x < -this.width) {
      this.x = 720;
    }
  }
}
