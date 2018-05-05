const mongodb        = require('mongodb');
const sms            = require('../sms');
const path           = require('path');

// sms.configure({
//   login: 'vk_510857',
//   password: 'dauletdoka1'
// })

// sms.test((err) => {
//   if(err) return console.log("SMS/Error: " + err)
// })

module.exports = function(app, db) {

    /* MONGODB STARTS HERE */

    app.get('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': mongodb.ObjectId(id) };
        db.collection('notes').findOne(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send(item);
          } 
        });
      });

    app.delete('/notes/:id', (req, res) => {

        const id = req.params.id;
        const details = { '_id': mongodb.ObjectId(id) };
        db.collection('notes').remove(details, (err, item) => {
          if (err) {
            res.send({'error':'An error has occurred'});
          } else {
            res.send('Note ' + id + ' deleted!');
          } 
        });
      });

    app.put('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': mongodb.ObjectId(id) };
        const note = { text: req.body.body, title: req.body.title };
        db.collection('notes').update(details, note, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(note);
            } 
        });
    });

    app.post('/notes', (req, res) => {
        const note = { text: req.body.body, title: req.body.title };
        db.collection('notes').insert(note, (err, result) => {
          if (err) { 
            res.send({ 'error': 'An error has occurred' }); 
          } else {
            res.send(result.ops[0]);
          }
        });
      });

    /* MONGODB ENDS HERE */

    /* SMS STARTS HERE */
    app.post('/sms', (req, res) => {
      const thesms = {text: req.body.text, num: req.body.num}
      sms.send_sms({
        phones : thesms.num,
        mes : thesms.text,
        cost : 0.0000001
    }, function (data, raw, err, code) {
        if (err) return console.log(err, 'code: '+code);
        console.log(data); // object
        console.log(raw); // string in JSON format
        res.status(200)
          .send("successful")
    });
  
    
    })

    /* SMS ENDS HERE */

    /* WEBSITE STARTS HERE */

    app.get('/', (req, res) => {
    
      res.sendFile(path.join(__dirname + '../web/index.html'))

    })

    app.post('/auth', (req, res) => {
      const details = {'login':req.body.login, 'password':req.body.password}
      db.collection('users').findOne(details, (err, item) => {
        if(err) {
          res.status(404)
            .send('Not found');
        }
        else {
          res.status(200)
            .sendFile(path.join(__dirname + "/../web/private/index.html"))
        }
      })

    })

    app.post('/genSMScode', (req, res) => {
      var verification_number = Math.floor(Math.random() * 100000) + 100000
      const details = {'login':req.body.login, 'password':req.body.password, 'number':req.body.number, 'verification_code':verification_code}
      db.collection('users_pending').insert(details, (err, result) => {
        if (err) { 
          res.send({ 'error': 'An error has occurred' }); 
        } else {
          res.send(result.ops[0]);
        }
      });
    })

    app.post('/verifySMScode', (req, res) => {
      const details = {'verification_code': req.body.verification_code} 
      db.collection('users_pending').findOne(details, (err, item) => {
        if(err) {
          res.status(404)
            .send('Not found');
        }
        else {
          res.status(200)
            .sendFile(path.join(__dirname + "/../web/private/index.html"))
        }
      })
    })

    app.post('/register', (req, res) => {
      const details = {'login': req.body.login, 'password': req.body.password, 'password_verify':req.body.password_verify}
    })

    /* WEBSITE ENDS HERE */

}