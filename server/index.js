// var express = require('express');
// var app = express();
var app = require('express')();
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http); // use socket.io

mongoose.connect('mongodb://localhost/webdxd');

var studentSchema = {
    firstName: String,
    lastName: String,
    email: String,
    age: Number
}

var Student = mongoose.model('Students', studentSchema, 'students');

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send("Hello World!");
});

app.get('/student', function(req, res) {
    Student.find().select('firstName age').exec(function(err, doc) {
        res.send(doc);
    })
});

app.get('/student/:id', function(req, res) {
    Student.findById(req.params.id, function(err, doc) {
        res.send(doc);
    });
});

app.post('/new', function(req, res) {
    var newStudent = new Student(req.body);
    newStudent.save(function(err, doc) {
        // console.log(doc);
        res.send(doc);
    });
});

app.post('/update/:id', function(req, res) {
    Student.update({_id: req.params.id}, {$set: req.body}, function(err,doc){
        res.send(doc);
    })
    // Student.update(params.id, req.body, function(err,doc){
    //     res.send(doc);
    // })
});

app.post('/delete/:id', function(req, res) {
    Student.remove({_id: req.params.id}).exec( function(err,doc) {
        res.send(doc);
    });

});



app.get('/chat', function(req, res){
    res.sendFile(path.join(__dirname, '../react-client','chat.html'));
});


io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('chat message', function (usermsg) {
        var user = usermsg.user;
        var msg = usermsg.msg;
        console.log('message: ' + user + msg);
        io.emit('response message', usermsg);
    });

    socket.on('disconnect', function () {
        console.log('disconnect');
    });
});

// app.listen(3000);
http.listen(3000,function () {
    console.log('listening on *:3000');
});