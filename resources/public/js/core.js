(function(context) {

    function module(name, module) {
        context[name] = module;
    }

    context.Core = {module : module};

})(window);