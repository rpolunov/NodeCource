


module.exports.printlog = function(text){
    console.log("log from logger " + text);
}

module.exports.printdebug = function(text){
    console.debug("debug from logger " + text);
}

module.exports.printerror = function(text){
    console.error("error from logger " + text);
}

module.exports.printwarn = function(text){
    console.warn("warn from logger " + text);
}
