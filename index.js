const express = require('express'),
      app = express();
      
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send("HI");
});

app.listen(3000, () => {
    console.log("server is running at port 3000");
})