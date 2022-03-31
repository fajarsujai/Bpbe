const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;
const metrics = require('metrics');

var metricsServer = new metrics.Server(9091);

metricsServer.addMetric('com.co.thingA', counter);
metricsServer.addMetric('com.co.thingB', hist1);
metricsServer.addMetric('com.co.thingC', hist2);
metricsServer.addMetric('com.co.thingD', meter);
metricsServer.addMetric('com.co.thingE', timer);

// Report to console every 1000ms.
var report = new metrics.Report();
report.addMetric('com.co.thingA', counter);
var reporter = new metrics.ConsoleReporter(report);

reporter.start(1000);

let Todo = require('./todo.model');

app.use(cors());
app.use(bodyParser.json());

// mongoose.connect('https://mongo.fajarsujai.my.id/todos', { useNewUrlParser: true });
mongoose.connect('mongodb://mongo-bp-service-prod:27017/todos', { useNewUrlParser: true });
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

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});