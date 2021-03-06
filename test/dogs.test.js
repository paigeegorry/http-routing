const app = require('../lib/app');
const request = require('supertest');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

const createDog = (breed) => {
  return request(app)
    .post('/dogs')
    .send({
      breed,
      name: 'pig'
    });
};

describe('dogs', () => {
  beforeEach(done => {
    rimraf('./data/dogs', err => {
      done(err);
    });
  });

  beforeEach(done => {
    mkdirp('./data/dogs', err => {
      done(err);
    });
  });

  it('creates a dog', () => {
    return request(app)
      .post('/dogs')
      .send({
        breed: 'mastiff',
        name: 'bear'
      })
      .then(({ body }) => {
        expect(body).toEqual({
          breed: 'mastiff',
          name: 'bear',
          _id: expect.any(String)
        });
      });
  });

  it('can get a list of dogs from our db', () => {
    const dogsToCreate = ['pug', 'goldendoodle', 'poodle', 'old english sheepdog', 'portugeuse water dog'];
    return Promise.all(dogsToCreate.map(createDog))
      .then(() => {
        return request(app)
          .get('/dogs');
      })
      .then(({ body }) => {
        expect(body).toHaveLength(5);
      });
  });

  it('can get a dog by id', () => {
    return createDog('bernese mountain dog')
      .then(({ body }) => {
        return request(app)
          .get(`/dogs/${body._id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({
          breed: 'bernese mountain dog',
          name: 'pig',
          _id: expect.any(String)
        });
      });
  });

  it('can find a dog by id and update', () => {
    return createDog('pug')
      .then(({ body }) => {
        return request(app)
          .put(`/dogs/${body._id}`);
      })
      .then(({ body }) => {
        return Promise.all([
          Promise.resolve(body._id),
          request(app)
            .get(`/dogs/${body._id}`)
        ]);
      })
      .then(([_id, { body }]) => {
        expect(body).toEqual({
          breed: 'pug',
          name: 'pig',
          _id
        });
      });
  });

  it('can find by id and delete a dog', () => {
    return createDog('yellow lab')
      .then(({ body }) => {
        return request(app)
          .delete(`/dogs/${body._id}`);
      })
      .then(({ body }) => {
        expect(body).toEqual({ deleted: 1 });
      });
  });
});
