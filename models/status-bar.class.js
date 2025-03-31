class StatusBar extends DrawableObject {
  IMAGES_FULL = [
    "IMG/GUI/2 BARS/HEALTHBAR1.PNG",
    "IMG/GUI/2 BARS/HEALTHBAR2.PNG",
    "IMG/GUI/2 BARS/HEALTHBAR3.PNG",
    "IMG/GUI/2 BARS/HEALTHBAR4.PNG",
  ];

  IMAGES_EMPTY = [
    "IMG/GUI/2 BARS/HEALTHBAR5.PNG",
    "IMG/GUI/2 BARS/HEALTHBAR6.PNG",
    "IMG/GUI/2 BARS/HEALTHBAR7.PNG",
    "IMG/GUI/2 BARS/HEALTHBAR8.PNG",
  ];

  percentage = 100;

  constructor() {
    super();
    this.loadImages(this.IMAGES_FULL);
    this.loadImages(this.IMAGES_EMPTY);
    this.x = 20;
    this.y = 20;
    this.width = 120;
    this.height = 20;
   
    
  }

  draw(ctx) {
    const partWidth = this.width / 4;

    const hpPercent = this.percentage / 100;
    let opacity = 1;

    if (hpPercent < 0.5) {
      const pulse = Math.sin(Date.now() / 200) * 0.1 + 0.9;
      opacity = Math.min(1, pulse);
    }

    ctx.save();
    ctx.globalAlpha = opacity;

    this.IMAGES_EMPTY.forEach((path, index) => {
      const img = this.imageCache[path];
      ctx.drawImage(
        img,
        this.x + index * partWidth,
        this.y,
        partWidth,
        this.height
      );
    });

    const hpParts = Math.ceil(hpPercent * 4);
    for (let i = 0; i < hpParts; i++) {
      const path = this.IMAGES_FULL[i];
      const img = this.imageCache[path];
      ctx.drawImage(
        img,
        this.x + i * partWidth,
        this.y,
        partWidth,
        this.height
      );
    }

    ctx.restore();
  }

  setPercentage(percentage) {
    this.percentage = percentage;
  }
}
