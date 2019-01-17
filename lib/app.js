const People = require('./models/People');
const { parse } = require('url');
const bodyParser = require('./bodyParser');

module.exports = (req, res) => {
  const url = parse(req.url, true);

  res.setHeader('Content-Type', 'application/json');

  if(req.method === 'GET' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findById(id, (err, person) => {
      res.end(JSON.stringify(person));
    });
  }

  else if(req.method === 'PUT' && url.pathname.includes('/people/')) {
    const id = url.pathname.slice(1).split('/')[1];
    People.findByIdAndUpdate(id, { name: 'banana', age: '20', favoriteColor: 'blue' }, (err, updatedPerson) => {
      console.log(id);
      res.end(JSON.stringify(updatedPerson));
    });
  }

  else if(req.method === 'POST' && url.pathname.includes('/people')) {
    bodyParser(req)
      .then(body => {
        People.create({ 
          name: body.name, 
          age: body.age, 
          favoriteColor: body.favoriteColor, 
          _id: body._id 
        }, (err, createdPerson) => {
          res.end(JSON.stringify(createdPerson));
        });
      });
  }

  else if(req.method === 'GET' && url.pathname.includes('/people')) {
    People.find((err, listOfPeople) => {
      res.end(JSON.stringify(listOfPeople));
    });
  }
};