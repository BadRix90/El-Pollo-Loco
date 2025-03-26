class Endboss extends MovableObject {
  x = 2400;
  y = 100;
  height = 350;
  width = 300;


  IMAGES_WALKING = [
'img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_1.png',
'img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_2.png',
'img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_3.png',
'img/cyberpunk-characters-pixel-art/10_boss/Boss_three/frames/Walk/Walk_frame_4.png',
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.animate();
    this.hitboxOffset = {
      top: 100,     // nach unten kleiner machen
      bottom: 0,
      left: 20,    // von links etwas wegnehmen
      right: 80    // von rechts auch
    };
    
  }

  animate() {
    setInterval(() => {
        this.playAnimation(this.IMAGES_WALKING);
        this.otherDirection = true;
    }, 200);
  }
}