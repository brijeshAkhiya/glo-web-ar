const express = require('express');
const app = express();
app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 3000, (err, result) => {
  if (err)  {
    console.log(err)
  } else {
    console.log('connected');
  }
});
