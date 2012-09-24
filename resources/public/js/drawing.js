(function(Core, $) {

    function create(config) {

        var size = config["size"];
        var xSymbol = config["player1"];
        var oSymbol = config["player2"];
        var canvasId = config["canvas-id"];
        var canvasSize = config["canvas-size"];
        var spotSize = canvasSize / size;
        var messageMargin = 50;
    
        function getCanvasEl() {
            return $("#" + canvasId);
        }
        
        function getCanvasContext() {
            return getCanvasEl()[0].getContext('2d');
        }
        
        function clear() {
            getCanvasContext().clearRect(0, 0, canvasSize, canvasSize);
        }

        function drawBoard(board) {
            var context = getCanvasContext();
            
            context.save();
            context.fillStyle = "#666";
            context.fillRect(0, 0, canvasSize, canvasSize);
            context.restore();
            
            for(var x = 0; x < size; x++) {
                for(var y = 0; y < board[x].length; y++) {
                    var player = board[x][y];
                    var drawFunc = lookupDrawFunc(player);
                    if(drawFunc) {
                        drawFunc(x, y, spotSize);
                    }
                }
            }
            
            context.save();
            context.lineWidth = 5;
            context.lineCap = "round";
            
            for(var i = 1; i < size; i++) {
                
                context.beginPath();
                context.moveTo(0 + context.lineWidth, spotSize * i);
                context.lineTo(canvasSize - context.lineWidth, spotSize * i);
                context.stroke();
                
                context.beginPath();
                context.moveTo(spotSize * i, 0 + context.lineWidth);
                context.lineTo(spotSize * i, canvasSize - context.lineWidth);
                context.stroke();
            }
            
            context.restore();
        }

        function lookupDrawFunc(player) {
            
            var func;
            
            if(xSymbol === player) {
                func = drawX;
            } else if(oSymbol === player) {
                func = drawO;
            }
            
            return func;
        }

        function drawX(x, y) {
            var context = getCanvasContext();
            
            context.save();
            
            context.lineWidth = 5;
            context.lineCap = "round";
            context.strokeStyle = "#85FF85";

            context.beginPath();
            context.moveTo((x * spotSize) + context.lineWidth * 2, (y * spotSize) + context.lineWidth * 2);
            context.lineTo((x * spotSize) + spotSize - context.lineWidth * 2, (y * spotSize) + spotSize - context.lineWidth * 2);
            context.stroke();

            context.beginPath();
            context.moveTo((x * spotSize) + spotSize - context.lineWidth * 2, (y * spotSize) + context.lineWidth * 2);
            context.lineTo((x * spotSize) + context.lineWidth * 2, (y * spotSize) + spotSize - context.lineWidth * 2);
            context.stroke();
            
            context.restore();
        }
     
        function drawO(x, y) {
            var context = getCanvasContext();
            
            var centerX = x * spotSize + spotSize / 2;
            var centerY = y * spotSize + spotSize / 2;
            var radius = spotSize / 2;

            context.save();
             
            context.strokeStyle = "#FF944D";
            context.lineWidth = 5;
            
            context.beginPath();
            context.arc(centerX, centerY, radius - context.lineWidth, 0, 2 * Math.PI, false);
            context.stroke();
            
            context.restore();
        }
        
        function getQuadrant(x, y) {
            
            var quad = {x: -1, y: -1};
            
            for(var i = 0; i < size; i++) {
                for(var j = 0; j < size; j++) {
                    if(x > spotSize * i && x <= spotSize * (i + 1) && y > spotSize * j && y <= spotSize * (j + 1)) {
                        quad.x = i;
                        quad.y = j;
                        break;
                    }
                }
            }
            
            return quad;
        }
        
        function drawMessage(x, y, message) {
            var context = getCanvasContext();
            context.save();
            context.fillStyle = "#C55EDF";
            context.font = (canvasSize / 9) + 'px Helvetica';
            context.fillText(message, x, y);
            context.restore();
        }
        
        function oneOrTwo() {
            return Math.floor((Math.random() * 2 + 1))
        }
        
        function animateMessage(message, board) {
            (function recurse(x, y, xDir, yDir, xVel, yVel) {
                var timer = setTimeout(function () {
                    if(x < messageMargin || x > canvasSize - messageMargin) {
                        xDir *= -1;
                        xVel = oneOrTwo() * xDir;
                    } 
                    
                    if(y < messageMargin || y > canvasSize - messageMargin) {
                        yDir *= -1;
                        yVel = oneOrTwo() * yDir;
                    }
                    
                    recurse(x + xVel, y + yVel, xDir, yDir, xVel, yVel);
                    
                }, 20);
                clear();
                drawBoard(board);
                drawMessage(x, y, message);
                getCanvasEl().one("click", function() {clearTimeout(timer);});
            })(messageMargin, messageMargin, 1, 1, oneOrTwo(), oneOrTwo());
        }
        
        return {clear: clear,
                drawBoard: drawBoard, 
                getQuadrant: getQuadrant,
                drawMessage: drawMessage, 
                animateMessage: animateMessage};
    }

    Core.module("Drawing", {create: create});

})(Core, $);
