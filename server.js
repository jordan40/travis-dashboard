var http = require('http');
var dispatcher = require('httpdispatcher');
var fs = require('fs');
var PORT = 8080;

var server = http.createServer(function (req, res){
    dispatcher.dispatch(req, res);
});

server.listen(PORT, '0.0.0.0', function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});

dispatcher.onGet("/", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    read ('index.html', function (data) {
        res.end(data);
    }, function (error) {
        console.log (error);
    })
});

dispatcher.onGet("/functionality.js", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/javascript'});

    read ('functionality.js', function (data) {
        res.end(data);
    }, function (error) {
        console.log (error);
    })
})

dispatcher.onGet("/data.js", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/javascript'});

    read ('data.js', function (data) {
        res.end(data);
    }, function (error) {
        console.log (error);
    })
})

dispatcher.onGet("/styles.css", function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/css'});

    read ('styles.css', function (data) {
        res.end(data);
    }, function (error) {
        console.log (error);
    })
})

function read (filename, success_callback, error_callback) {
    fs.readFile(filename, 'utf8', function (err,data) {
        if (err) {
            return error_callback (err);
        }
        
        return success_callback (data);
    });
}