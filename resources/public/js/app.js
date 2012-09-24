(function(Core, Controller, Drawing) {

    $(document).ready(function() {
        $.get('/ajax/tic-tac-toe/config', function(config) {
            Controller.create(config, {"graphics": Drawing.create(config)}).init();
        });
    });

})(Core, Controller, Drawing);