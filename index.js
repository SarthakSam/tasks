const express = require('express'),
      app = express(),
      bodyParser = require('body-parser')
      multer = require('multer'),
      path = require('path')
      fs = require('fs');
      
app.use(express.static('public'))
app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
// app.use(bodyParser.json());

// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'public/uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
//   })
   
//   var upload = multer({ storage: storage }).array('images', 12);

app.get('/note', (req, res) => {
    res.send("HI");
});

app.post('/note', (req, res) => {
   
    if(req.body.images && req.body.images.length > 0) {
      saveImages(req.body.images);
    }
    return res.send( {message: "success"});

    // upload(req, res, (err) => {
    //     if(err) {
    //        return res.send( {error: "Something went wrong"});
    //     }
    //     return res.send( {message: "success"});
    // })
})

function saveImages(images) {
  const path = './public/uploads/';
  let uploadedImages = images.map( image => {
    const ext = image.substring(image.indexOf("/")+1, image.indexOf(";base64"));
    const fileType = image.substring("data:".length,image.indexOf("/"));
    //Forming regex to extract base64 data of file.
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    //Extract base64 data.
    const base64Data = image.replace(regex, "");
    const rand = Math.ceil(Math.random()*1000);
    //Random photo name with timeStamp so it will not overide previous images.
    const filename = `Photo_${Date.now()}_${rand}.${ext}`;
    
    //Check that if directory is present or not.
    if(!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
    // if (!fs.existsSync(localPath)) {
    //     fs.mkdirSync(localPath);
    // }
    fs.writeFileSync(path+filename, base64Data, 'base64');
    return {filename, path};
  });
  console.log(uploadedImages);
}

app.listen(3000, () => {
    console.log("server is running at port 3000");
})