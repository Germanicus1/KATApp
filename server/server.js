const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const mongoose = require('./db/mongoose');
let {User} = require('./models/user');
let {Initiative} = require('./models/initiative');

let app = express();

const port = process.env.PORT || 3000;

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


app.get('/initiatives', (req, res) => {
  Initiative.find().then((initiatives) => {
    res.send({initiatives});
    }, (e) => {
      res.status(400).send(e);
    });
});

app.get('/initiatives/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(400).send({});
  }

  Initiative.findById(id).then((initiative) => {
    if(!initiative) {
      return res.status(404).send({});
    }
    res.status(200).send({initiative});
  }).catch((e) => {
    res.status(400).send({});
  });
});

app.listen(port, () => {
  console.log(`Server up and listening on port ${port}`);
});

module.exports = {app};