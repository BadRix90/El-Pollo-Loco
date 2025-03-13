class BackgroundObject extends MovableObject{
    y = 180;
    x = 0;
    height = 300;
    width = 720;
    
    constructor(imagePath){
        super().loadImage(imagePath)

    }
}
