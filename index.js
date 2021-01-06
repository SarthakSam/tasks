const express = require('express'),
      app = express(),
      bodyParser = require('body-parser');
      
app.use(express.static('public'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/note', (req, res) => {
    res.send("HI");
});

app.post('/note', (req, res) => {
    console.log(req.body);
    res.send("Hello");
})

app.listen(3000, () => {
    console.log("server is running at port 3000");
})