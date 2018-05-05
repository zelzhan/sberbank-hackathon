const mongodb        = require('mongodb');
const sms            = require('../sms/smsc_api');

sms.configure({
  login: 'vk_510857',
  password: 'dauletdoka1'
})

sms.test((err) => {
  if(err) return console.log("SMS/Error: " + err)
})

module.exports = function(app, db) {

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
    });
    
    })

}