const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
let {User} = require('./models/user');
let {Initiative} = require('./models/initiative');

let app = express();

app.use(bodyParser.json());

app.post('/initiatives', (req, res) => {
  let initiative = new Initiative({
    companyName: req.body.companyName,
    initiativeName: req.body.initiativeName,
    targetMaturityLevel: req.body.targetMaturityLevel
  });

  initiative.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });


});

app.listen('3000', () => {
  console.log('Server up and listening on port 3000');
});

module.exports = {app};