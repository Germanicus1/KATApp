const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Initiative} = require('../models/initiative');

beforeEach((done) => {
  Initiative.deleteMany({}).then(() => done());
});

describe('POST /initiatives', () => {
  it('Should create a new initiative', (done) => {
    const companyName = 'My company';
    const initiativeName = 'My initiative';
    const targetMaturityLevel = 2;

    request(app)
      .post('/initiatives')
      .send({companyName, initiativeName, targetMaturityLevel})
      .expect(200)
      .expect((res) => {
        expect(res.body.companyName).toBe(companyName);
        expect(res.body.initiativeName).toBe(initiativeName);
        expect(res.body.targetMaturityLevel).toBe(targetMaturityLevel);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Initiative.find().then((initiatives) => {
          expect(initiatives.length).toBe(1);
          expect(initiatives[0].companyName).toBe(companyName);
          expect(initiatives[0].initiativeName).toBe(initiativeName);
          expect(initiatives[0].targetMaturityLevel).toBe(targetMaturityLevel);
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
          expect(initiatives.length).toBe(0);
          done();
        }).catch((e) => done());
      });
  })
});