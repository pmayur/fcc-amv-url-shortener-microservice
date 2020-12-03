require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const util = require('./util/helper.js')

let data = new Map();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/shorturl/new', function(req, res) {

  let urlReceived = req.body.url;

  if( util.isValidHttpUrl(urlReceived) ) {

    if(data.size >= 50) {
      data.clear();
    }

    data.set(data.size.toString(), urlReceived)

    let shortUrl = (data.size - 1).toString();

    res.json({
      "original_url": urlReceived,
      "short_url": shortUrl
    })

  } else {

    res.json({
      "error": "invalid url"
    })
    
  }
})

app.get('/api/shorturl/:shortURL', function(req, res) {
  let shortURL = req.params.shortURL;

  let actualURL = data.get(shortURL)
  
  if(actualURL) {
    res.redirect(actualURL)
  } else {
    res.json({
      "error": "invalid url"
    })
  }

})
// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
