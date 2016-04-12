var size;
var layer_posY, layer_posX;
var globezLayer;
var currentSprite = null;

var matchSize = 3;
var fieldSizeROW;
var fieldSizeCOL;
var tileSize = 40;
var tileArray = [];
var tileImage=[];
var tileImageBack = "res/bubbles.png";
var tileTypes = ["red", "green", "blue", "pink", "sky", "white", "gray"];
//var tileTypes = ["red", "green", "blue", "pink"];

//var that;
var currentBubble, previousBubble;

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
        // that= this;
        size = cc.winSize;
        layer_posX = size.width*0.125;
        layer_posY = 120;
        fieldSizeROW = Math.floor((size.height-layer_posY)/40);
        fieldSizeCOL= Math.floor((size.width-layer_posX*2)/40);

        var backgroundLayer1 = new cc.LayerGradient(cc.color(0x255,0x255,0x255,255), cc.color(0x255,0x255,0x255,255));
        this.addChild(backgroundLayer1,0);
        
        var backgroundLayer = new cc.LayerGradient(cc.color(0x240,0x255,0x255,255), cc.color(0x240,0x255,0x255,255));
        backgroundLayer.changeWidthAndHeight(size.width*0.75,size.height);
        backgroundLayer.setPosition(cc.p(layer_posX,layer_posY));
        this.addChild(backgroundLayer,1);

        var backgroundLayer2 = new cc.LayerGradient(cc.color(0x204,0x255,0x230,128), cc.color(0x204,0x255,0x230,128));
        backgroundLayer2.changeWidthAndHeight(size.width*0.75,80);
        backgroundLayer2.setPosition(cc.p(layer_posX,40));
        this.addChild(backgroundLayer2,1);

        var x1 = 0, x2=40, y1=0, y2=40;
        for(var i=0; i<tileTypes.length; i++){
            tileImage.push(cc.rect(x1,y1,x2,y2));
            x1 += x2;
        }

        globezLayer = cc.Layer.create();
        globezLayer.setPosition(layer_posX, layer_posY);
        this.addChild(globezLayer,1);

        var sprite = new cc.Sprite.create("res/greycircle.png");
        sprite.setPosition(size.width*0.75*0.5, -40);
        globezLayer.addChild(sprite,1);

        var randomTile = Math.floor(Math.random()*tileTypes.length);
        currentSprite = new cc.Sprite.create("res/bubbles.png", tileImage[randomTile]);
        currentSprite.setPosition(size.width*0.75*0.5,-40);
        globezLayer.addChild(currentSprite,1);

        currentBubble = randomTile;

        var randomTile = Math.floor(Math.random()*tileTypes.length);
        var sprite = new cc.Sprite.create("res/bubbles.png", tileImage[randomTile]);
        sprite.setPosition(size.width*0.75*0.5 - 80, -40);
        globezLayer.addChild(sprite,1);

        previousBubble = randomTile;

        this.createLevel();
        cc.eventManager.addListener(touchListener, this);

        return true;
    },

    createLevel: function(){
        for(var i = 0; i < fieldSizeROW; i ++){
            tileArray[i] = [];
            for(var j = 0;j < fieldSizeCOL; j ++){
                tileArray[i][j] = null;;
            }
        }

        for(var i = 0; i < fieldSizeROW/2; i ++){
            for(var j = 0;j < fieldSizeCOL; j ++){
                this.addTile(fieldSizeROW-i-1, j);
            }
        }
    },

    addTile:function(row,col){
        var randomTile = Math.floor(Math.random()*tileTypes.length);
        var sprite = cc.Sprite.createWithSpriteFrame("res/bubbles.png",tileImage[randomTile]);
        sprite.val = randomTile;
        sprite.picked = false;
        globezLayer.addChild(sprite,1);
        if((fieldSizeROW-row-1)%2==1)
            sprite.setPosition(col*tileSize+tileSize,row*tileSize+tileSize/2);
        else
            sprite.setPosition(col*tileSize+tileSize/2,row*tileSize+tileSize/2);
        tileArray[fieldSizeROW-row-1][col] = sprite;
    }
});

var bubbleRow = 0, bubbleCol=0;
var slopeX, slopeY;
var result = [];

var touchListener = cc.EventListener.create({
    event: cc.EventListener.MOUSE,

    // Convert radians to degrees
    radToDeg:function(rad) {
        return rad * (180 / Math.PI);
    },
    
    // Convert degrees to radians
    degToRad:function(angle) {
        return angle * (Math.PI / 180);
    },

    newBubbleCreate:function(){
        //var randomTile = Math.floor(Math.random()*tileTypes.length);
        currentSprite = new cc.Sprite.create("res/bubbles.png", tileImage[previousBubble]);
        currentSprite.setPosition(size.width*0.75*0.5,-40);
        globezLayer.addChild(currentSprite,1);

        currentBubble = previousBubble;

        var randomTile = Math.floor(Math.random()*tileTypes.length);
        var sprite = new cc.Sprite.create("res/bubbles.png", tileImage[randomTile]);
        sprite.setPosition(size.width*0.75*0.5 - 80, -40);
        globezLayer.addChild(sprite,1);

        previousBubble = randomTile;
    },

    DFS:function(R,C, val){
        var dirc = [[[1,0],[-1,0],[0,-1],[0,1],[1,-1],[-1,-1]], [[1,0],[-1,0],[0,-1],[0,1],[1,1],[-1,1]]];
        var indx = R%2;
        for(var i=0; i<dirc[indx].length; i++){
            if(R+dirc[indx][i][0]>=0 && R+dirc[indx][i][0]<fieldSizeROW && C+dirc[indx][i][1]>=0 &&C+dirc[indx][i][1]<fieldSizeCOL){
                if(tileArray[R+dirc[indx][i][0]][C+dirc[indx][i][1]] != null)
                    if(tileArray[R+dirc[indx][i][0]][C+dirc[indx][i][1]].val == val && !tileArray[R+dirc[indx][i][0]][C+dirc[indx][i][1]].picked){
                        result.push({
                            row: R+dirc[indx][i][0],
                            col: C+dirc[indx][i][1]
                        });

                        tileArray[R+dirc[indx][i][0]][C+dirc[indx][i][1]].picked = true;
                        this.DFS(R+dirc[indx][i][0], C+dirc[indx][i][1], val);
                    }
            }
        }
    },

    removeBubble:function(R,C){
        result = [];

        this.DFS(R,C, tileArray[R][C].val);
        
        if(result.length>=3){
            for(var i=0; i<result.length; i++){
                globezLayer.removeChild(tileArray[result[i].row][result[i].col]);
                tileArray[result[i].row][result[i].col] = null;
            }
        }
        else
            for(var i=0; i<result.length; i++)
                tileArray[result[i].row][result[i].col].picked = false;
    },

    runBubble:function(){
        var that= this;
        var target = currentSprite.getPosition();
        var pickedRow = Math.floor((target.y + 40*slopeY + tileSize/2)/tileSize);
        var pickedCol;
        
        if(slopeX<0)
            pickedCol = Math.floor((target.x + 40*slopeX - tileSize/2)/tileSize);
        else 
            pickedCol = Math.floor((target.x + 40*slopeX)/tileSize);
        
        var currentRow = fieldSizeROW-pickedRow-1;
        var currentCol = pickedCol;

        var act = new cc.MoveBy.create(0.05, cc.p(10*slopeX, 10*slopeY));
        currentSprite.runAction(act);

        if( (target.x + slopeX*10) <= tileSize/1.5 || (target.x+slopeX*10)>=(size.width*0.75-tileSize/1.5))
            slopeX = -1*slopeX;

        if(currentRow>=0 && currentRow<fieldSizeROW&& currentCol>=0 && currentCol<fieldSizeCOL){
            if(tileArray[currentRow][currentCol] != null){
                globezLayer.removeChild(currentSprite);
                currentSprite = null;
                var sprite = cc.Sprite.createWithSpriteFrame("res/bubbles.png",tileImage[currentBubble]);
                sprite.val = currentBubble;
                sprite.picked = false;
                globezLayer.addChild(sprite,1);
                if((bubbleRow)%2==1)
                    sprite.setPosition(bubbleCol*tileSize+tileSize,(fieldSizeROW-bubbleRow-1)*tileSize+tileSize/2);
                else
                    sprite.setPosition(bubbleCol*tileSize+tileSize/2,(fieldSizeROW-bubbleRow-1)*tileSize+tileSize/2);
                tileArray[bubbleRow][bubbleCol] = sprite;


                this.newBubbleCreate();
                this.removeBubble(bubbleRow, bubbleCol);

                return 0;
            }
        }

        if(bubbleRow != currentRow || bubbleCol != currentCol)
        {   
            bubbleRow = currentRow;
            bubbleCol = currentCol;

            if(bubbleCol<0) bubbleCol=0;
            if(bubbleRow<0) bubbleRow=0;

            if(bubbleCol>=fieldSizeCOL) bubbleCol=fieldSizeCOL-1;
            if(bubbleRow>=fieldSizeROW) bubbleRow=fieldSizeROW-1;
        }

        setTimeout(function(){
            that.runBubble();
        }, 0.05*1000);
    },

    onMouseDown: function (event){
        if(currentSprite != null){                
            var target = currentSprite.getPosition();
            var mouseangle = this.radToDeg(Math.atan2(target.y - ( event._y - layer_posY), (event._x - layer_posX) - target.x));
            slopeX = Math.cos(this.degToRad(mouseangle));
            slopeY = -1*Math.sin(this.degToRad(mouseangle));
        }
    },

    onMouseUp: function(event){
        if(currentSprite != null)
            this.runBubble();
    },

    onMouseMove: function(event){
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

