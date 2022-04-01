const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
const client = require('prom-client')

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

// mongoose.connect('https://mongo.fajarsujai.my.id/todos', { useNewUrlParser: true });
mongoose.connect('mongodb://mongo-bp-service:27017/todos', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

todoRoutes.route('/').get(function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
});

todoRoutes.route('/:id').get(function(req, res) {
    let id = req.params.id;
    Todo.findById(id, function(err, todo) {
        res.json(todo);
    });
});

todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

todoRoutes.route('/add').post(function(req, res) {
    let todo = new Todo(req.body);
    todo.save()
        .then(todo => {
            res.status(200).json({'todo': 'todo added successfully'});
        })
        .catch(err => {
            res.status(400).send('adding new todo failed');
        });
});

app.use('/todos', todoRoutes);

// // App
// // const client = require('prom-client');
// const collectDefaultMetrics = client.collectDefaultMetrics;
// // Probe every 5th second.
// collectDefaultMetrics({ timeout: 5000 });

// const counter = new client.Counter({
//   name: 'node_request_operations_total',
//   help: 'The total number of processed requests'
// });

// const histogram = new client.Histogram({
//   name: 'node_request_duration_seconds',
//   help: 'Histogram for the duration in seconds.',
//   buckets: [1, 2, 5, 6, 10]
// });

// // const app = express();
// // app.get('/', (req, res) => {

// //   //Simulate a sleep
// //   var start = new Date()
// //   var simulateTime = 1000

// //   setTimeout(function(argument) {
// //     // execution time simulated with setTimeout function
// //     var end = new Date() - start
// //     histogram.observe(end / 1000); //convert to seconds
// //   }, simulateTime)

// //   counter.inc();
  
// //   res.send('Hello world\n');
// // });


// // Metrics endpoint
// app.get('/metrics', (req, res) => {
//   res.set('Content-Type', client.register.contentType)
//   res.end(client.register.metrics())
// })




app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

// 'use strict';

// const express = require('express');

// // Constants
// const PORT = 4000;
// // const HOST = '0.0.0.0';

// // App
// const client = require('prom-client');
// const collectDefaultMetrics = client.collectDefaultMetrics;
// // Probe every 5th second.
// collectDefaultMetrics({ timeout: 5000 });

// const counter = new client.Counter({
//   name: 'node_request_operations_total',
//   help: 'The total number of processed requests'
// });

// const histogram = new client.Histogram({
//   name: 'node_request_duration_seconds',
//   help: 'Histogram for the duration in seconds.',
//   buckets: [1, 2, 5, 6, 10]
// });

// const app = express();
// app.get('/', (req, res) => {

//   //Simulate a sleep
//   var start = new Date()
//   var simulateTime = 1000

//   setTimeout(function(argument) {
//     // execution time simulated with setTimeout function
//     var end = new Date() - start
//     histogram.observe(end / 1000); //convert to seconds
//   }, simulateTime)

//   counter.inc();
  
//   res.send('Hello world\n');
// });


// // Metrics endpoint
// app.get('/metrics', (req, res) => {
//   res.set('Content-Type', client.register.contentType)
//   res.end(client.register.metrics())
// })

// app.listen(PORT, function() {
//     console.log("Server is running on Port: " + PORT);
// });

// // app.listen(PORT, HOST);
// // console.log(`Running on http://${HOST}:${PORT}`);


