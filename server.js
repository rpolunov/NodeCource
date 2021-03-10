const http = require("http");
const logfile = require("./logger.js");
const {PORT, ENV} = require("./config.js");

logfile.printlog("test log")
logfile.printdebug("test debug");
logfile.printerror("test error");
logfile.printwarn("test warn");
  
http.createServer(function(request, response){
    console.log('New incoming request');
    response.writeHeader(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Hello world!' })); 
}).listen(PORT, () => console.log('Listening on port ' + PORT + '...'));