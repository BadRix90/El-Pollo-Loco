class Cloud extends MovableObject{
    y = 70;
    height = 300;
    width = 400;


    constructor(){
        super().loadImage('img/5_background/layers/4_clouds/1.png')
        this.x = 0 + Math.random() * 500;

    }





}