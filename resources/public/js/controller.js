(function(Core, $) {

    function create(config, dependencies) {
        
        var graphics = dependencies["graphics"];
        
        var stateUrl = config["state-url"];
        var moveUrl = config["move-url"];
        var resetUrl = config["reset-url"];
        var canvasId = config["canvas-id"];
        
        $("#" + canvasId).click(clickSpace);
    
        function refresh() {
            $.get(stateUrl, function(data) {
                var board = data["board"];
                var winner = data["winner"];
                var draw = data["draw"];
                
                graphics.clear();
                
                if(winner || draw) {
                    if(winner) {
                        graphics.animateMessage(winner + " Wins!!", board);
                    } else if(draw) {
                        graphics.animateMessage("Cats Game!!!", board);
                    }
                    $("#" + canvasId).one("click", newGame);
                } else {
                    graphics.drawBoard(board);
                }
            });
        }

        function makeMove(x, y) {
            $.post(moveUrl, {"x" : x, "y": y}, function() {
                refresh();
            });
        }

        function newGame() {
            $.post(resetUrl, function() {
                refresh();
            });
        }

        function clickSpace(event) {
    
            var container = document.getElementById('container');
            var offsetTop = container.offsetTop;
            var offsetLeft = container.offsetLeft;

            var x  = event.pageX - offsetLeft;
            var y = event.pageY - offsetTop;
            
            var quad = graphics.getQuadrant(x,y);
            
            makeMove(quad.x, quad.y);
        }
        
        return {init: refresh}
    }

    Core.module("Controller", {create: create});

})(Core, $);