var express = require("express"); // require express
var path = require("path"); // path module
var bodyParser = require('body-parser'); 
var app = express(); // create the express app


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static"))); // static content
app.set('views', path.join(__dirname, './views')); // setting up views folder
app.set('view engine', 'ejs'); // setting up ejs

var server = app.listen(8000, function() { // tell the express app to listen on port 8000
    console.log("listening on port 8000");
});

var io = require('socket.io').listen(server); // socket

// root route to render the index.ejs view
app.get('/', function(req, res) { res.render("index"); })

var names = {}
var size = 0
// socket code
io.sockets.on('connection', function(socket) {
    console.log("id: ", socket.id)

    socket.on("entered_name", function(data) {
        names[size] = data.name
        size++
        io.emit('new_name', {new_name: data.name})
        io.emit('existing_names', {names: names})
    })

})
