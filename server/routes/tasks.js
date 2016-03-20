var express = require('express');
var tasks = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString;

if (process.env.DATABASE_URL) {
  pg.defaults.ssl = true;
  connectionString = process.env.DATABASE_URL;
} else {
  connectionString = 'postgres://localhost:5432/tasks'
}

pg.connect(connectionString, function(err, client, done){
  if (err) {
    console.log('Error connecting to DB!', err);
    //TODO end process with error code
  } else {
    var query = client.query('CREATE TABLE IF NOT EXISTS tasklist (' +
    'id SERIAL PRIMARY KEY,' +
    'task_name varchar(80) NOT NULL,' +
    'task_description varchar(80) NOT NULL,' +
    'completed boolean NOT NULL);'
  );
  query.on('end', function() {
    console.log('Successfully ensured schema exists');
    done();
  });

  query.on('error', function() {
    console.log('Error creating schema!');
    //TODO exit(1)
    done();
  })
}
});


tasks.get('/get', function(req,res) {
  var results = [];
  pg.connect(connectionString, function(err, client, done){
    var query = client.query('SELECT * FROM tasklist ORDER BY id DESC;');

    query.on('row', function(row) {
      results.push(row);
    });

    query.on('end', function(){
      done();
      return res.json(results);
    });

    if(err) {
      console.log(err);
    }
  });
});


tasks.post('/post', function(req, res) {
  var newTask = {
    task_name: req.body.task_name,
    task_description: req.body.task_description,
    completed: false
  };
  console.log('POST successful, here is info:', newTask);

  pg.connect(connectionString, function(err, client, done){
    client.query('INSERT INTO tasklist (task_name, task_description, completed)' +
    'VALUES($1, $2, $3) RETURNING id',
    [newTask.task_name, newTask.task_description, newTask.completed],
    function(err, result){
      done();

      if(err){
        console.log('Error inserting data: ', err);
        res.send(false);
      } else {
        res.send(result);
      }
    });
  });
});

module.exports = tasks;
