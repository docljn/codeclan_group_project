const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.use(express.static('client/build'));
// app.use(require(__dirname + '/controllers/countries_controller'))


const server = app.listen(3000, function () {
  console.log('TravelApp listening at ' + this.address().port);
});
