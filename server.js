var express = require("express"); // require express
var path = require("path"); // path module
var bodyParser = require('body-parser'); 
var app = express(); // create the express app
//SEND HYPERLINK MESSAGES?
//Validate name

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

var size = 0
var addedName = false
// socket code
io.sockets.on('connection', function(socket) {

    socket.on("entered_name", function(data) {
        size++
        addedName = true
        socket.username = data.name
        io.emit('new_name', {new_name: data.name, size: size})
    })

    socket.on("entered_message", function(data) {
        io.emit('new_message', {new_message: data.message, user: socket.username})
    })

    socket.on('disconnect', function () {
        if (addedName) {
            size--
            socket.broadcast.emit('user_left', {left_name: socket.username, size: size})
        }
        
    })
})
