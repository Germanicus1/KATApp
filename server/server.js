const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const mongoose = require('./db/mongoose');
let {User} = require('./models/user');

let {Initiative} = require('./models/initiative');

let app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

/**
 * INITIATIVES API
 */

// POST /initiatives - Creates a new initiative

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


// GET /initiatives - Get all initiatives

app.get('/initiatives', (req, res) => {
  Initiative.find().then((initiatives) => {
    res.send({initiatives});
    }, (e) => {
      res.status(400).send(e);
    });
});


// GET /initiatives/:id - Get a single initiative. Must be called with a valid ObjectID

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

// DELETE /initiative/:id - Delete a single initiative. Must be called with a valid ObjectID

app.delete('/initiatives/:id', (req, res) => {
  const id = req.params.id;

  if(!ObjectID.isValid(id)) {
    return res.status(400).send({});
  }

  Initiative.findByIdAndDelete(id).then((initiative) => {
    if(!initiative) {
      return res.status(404).send({});
    }
    res.status(200).send({initiative});
  }).catch((e) => {
    res.status(400).send({});
  });
});


app.patch('/initiatives/:id', (req, res) => {
  const id = req.params.id;
  initiative = _.pick(req.body, ['companyName', 'initiativeName']);

  if(!ObjectID.isValid(id)) {
    return res.status(400).send({});
  }

  // console.log(id, initiative);

  Initiative.findByIdAndUpdate(id, {$set: {initiative}}, {new: true}).then((initiative) => {
    if(!initiative) {
      return res.status(404).send();
    }
    initiative.lastUpdate = new Date().getTime();

    // console.log(initiative);
    res.status(200).send({initiative});
  }).catch((e) => {
    res.status(400).send();
  });

  res.status(200).send({initiative});

});


/**
 * PRACTICE API
 */




app.listen(port, () => {
  console.log(`Server up and listening on port ${port}`);
});

module.exports = {app};