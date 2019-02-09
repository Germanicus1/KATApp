const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Initiative} = require('../models/initiative');

const initiatives = [{
  _id: new ObjectID(),
  companyName: 'My first company',
  initiativeName: 'My first initiative',
  targetMaturityLevel: 1
},
{
  _id: new ObjectID(),
  companyName: 'My second company',
  initiativeName: 'My second initiative',
  targetMaturityLevel: 2
}]

beforeEach((done) => {
  Initiative.deleteMany({}).then(() => {
    return Initiative.insertMany(initiatives);
  }).then(() => done());
});

describe('POST /initiatives', () => {
  it('Should create a new initiative', (done) => {
    const testInitative = {
      companyName: 'My company',
      initiativeName: 'My initiative',
      targetMaturityLevel: 2
    }

    request(app)
      .post('/initiatives')
      .send(testInitative)
      .expect(200)
      .expect((res) => {
        expect(res.body.companyName).toBe(testInitative.companyName);
        expect(res.body.initiativeName).toBe(testInitative.initiativeName);
        expect(res.body.targetMaturityLevel).toBe(testInitative.targetMaturityLevel);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Initiative.find(testInitative).then((initiatives) => {
          expect(initiatives.length).toBe(1);
          expect(initiatives[0].companyName).toBe(testInitative.companyName);
          expect(initiatives[0].initiativeName).toBe(testInitative.initiativeName);
          expect(initiatives[0].targetMaturityLevel).toBe(testInitative.targetMaturityLevel);
          done();
        }).catch((e) => done(e));
      });   
  });

  it('Should not create an intiative with bad data', (done) => {
    request(app)
      .post('/initiatives')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Initiative.find().then((initiatives) => {
          expect(initiatives.length).toBe(2);
          done();
        }).catch((e) => done());
      });
  })
});

describe('GET /initatives)', () => {
  it('Should get all initiatives', (done) => {
    request(app)
      .get('/initiatives')
      .expect(200)
      .expect((res) => {
        expect(res.body.initiatives.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /initiatives/:id', () => {
  it('Should get an individual initiative', (done) => {
    request(app)
      .get(`/initiatives/${initiatives[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.initiative.companyName).toBe(initiatives[0].companyName);
      })
      .end(done);
  });

  it('Should return 404 if initiative not found', (done) => {
    id = new ObjectID();
    request(app)
      .get(`/initiatives/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 400 if ObjectID not valid', (done) => {
    request(app)
      .get('/initiatives/123')
      .expect(400)
      .end(done)
  })

});

describe('DELETE /initiatives/:id', () => {
  it('Should delete a single initiative by its ID', (done) => {
    id = initiatives[1]._id.toHexString();

    request(app)
      .delete(`/initiatives/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.initiative._id).toBe(id);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Initiative.findById(id).then((intiative) => {
          expect(intiative).toNotExist();
          done();
        }).catch((e) => done());
      });
  });

  it('Should return 404 if initiative not found', (done) => {
    id = new ObjectID();
    request(app)
      .delete(`/initiatives/${id.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('Should return 400 if ObjectID not valid', (done) => {
    request(app)
      .delete('/initiatives/123')
      .expect(400)
      .end(done)
  })
});