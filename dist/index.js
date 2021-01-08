const express = require('express');
const app = express();
app.use('/scanqr', express.static(__dirname));
app.use(express.static(__dirname));

app.get('/scanqr/:qrcode', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

app.get('/Verified-QR-Code', (req, res) => {
  res.sendFile(__dirname + '/verified.html');
});

app.get('/Invalid-QR-Code', (req, res) =>{
  res.sendFile(__dirname + '/notverified.html');
});

app.listen(process.env.PORT || 3000, (err, result) => {
  if (err)  {
    console.log(err)
  } else {
    console.log('connected');
  }
});

// const myParam = localStorage.getItem('url');
//             window.open(myParam, '_parent');
