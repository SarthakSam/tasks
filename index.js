const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      path = require('path')
      fs = require('fs');
      Reminder = require('./models/Reminder');
      Note = require("./models/Note");
      
mongoose.connect('mongodb://localhost/tasks', {useNewUrlParser: true, useUnifiedTopology: true});
      
app.use(express.static('public'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/notes', (req, res) => {
   Note.find({}, (err, notes) => {
    if(err) {
      console.log("something went wrong in /notes");
      res.send({ status: 400, message: "Something went wrong" });
    }
    else {
      res.send({
        status: 200,
        notes
      })
    }
   });
});

app.post('/notes', (req, res) => {
  let uploadedImages;
  if(req.body.images && req.body.images.length > 0) {
    uploadedImages = saveImages(req.body.images);
  }

  Reminder.create(req.body.reminder, (err, reminder) => {
    if(err) {
      console.log("unable to create reminder");
      res.send({
        status: 400,
        message: "Unable to create note because reminder was not created"
      })
    }
    else {

      const newNote = new Note( {
        title: req.body.title,
        description: req.body.description,
        list: req.body.list,
        backgroundColor: req.body.backgroundColor,
        images: uploadedImages,
        isPinned: req.body.isPinned,
        reminder: reminder
      } );
      
      newNote.save().then( note => {
        console.log(note + "saved");
        res.send( {
          status: 200,
          message: "note saved successfully"
        })
      }).catch(err => {
          console.log(err)
          res.send( {
            status: 400,
            message: "Unable to create note"
          })
      });
    }
  });

})

function saveImages(images) {
  const pathToPublicDir = './public';
  const pathToUploadDir = "/uploads/";
  const path = pathToPublicDir + pathToUploadDir;
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
  
    fs.writeFileSync(path+filename, base64Data, 'base64');
    return pathToUploadDir + filename;
  });
  return uploadedImages;
}

app.listen(3000, () => {
    console.log("server is running at port 3000");
})