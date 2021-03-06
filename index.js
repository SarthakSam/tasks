const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      fs = require('fs'),
      Reminder = require('./models/Reminder'),
      Note = require("./models/Note"),
      Label = require("./models/Label");

mongoose.connect('mongodb://localhost/tasks', {useNewUrlParser: true, useUnifiedTopology: true});
      
app.use(express.static('public'))
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// (async function() {
//   await Note.deleteMany({ });
//   await Reminder.deleteMany({ });
//   console.log("deleted Data");

// })();

app.get('/notes', (req, res) => {
  Note.find({  status: 0}).populate("reminder").populate("labels").exec( (err, notes) => {
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
     } )
});

app.post('/notes', async (req, res) => {
  let uploadedImages;
  if(req.body.images && req.body.images.length > 0) {
    uploadedImages = saveImages(req.body.images);
  }
  let reminder;
  if(req.body.reminder) {
      reminder = await Reminder.create(req.body.reminder);
  }
    // Reminder.create(req.body.reminder, (err, reminder) => {
    //   if(err) {
    //     console.log("unable to create reminder");
    //     res.send({
    //       status: 400,
    //       message: "Unable to create note because reminder was not created"
    //     })
    //   }
    //   else {
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

})

app.get('/notes/:id', (req, res) => {
    Note.findById(req.params.id).populate("reminder").populate("labels").exec()
    .then( note => {
        res.send( { status: 200, note });
    })
    .catch(err => {
        res.send( { status: 400, message: "Unable to find note"});
    });
});

app.patch('/notes/:id', (req, res) => {
  Note.findByIdAndUpdate(req.params.id, { $set: req.body }, (err, updatedNote) => {
    if(err) {
      console.log("unable to edit note");
      res.send({
        status: 400,
        message: "Unable to edit note"
      })
    }
    else {
      console.log("editedNote" + updatedNote);
      res.send( {
        status: 200,
        message: "note edited successfully"
      })
    }
  });
})

app.delete('/notes/:id', (req, res) => {
  let obj = {
    status: 2
  }
  Note.findByIdAndUpdate(req.params.id, { $set: obj }, (err, updatedNote) => {
    if(err) {
      console.log("unable to edit note");
      res.send({
        status: 400,
        message: "Unable to delete note"
      })
    }
    else {
      console.log("editedNote" + updatedNote);
      res.send( {
        status: 200,
        message: "note deleted successfully"
      })
    }
  });
})

app.get('/labels', (req, res) => {
    Label.find({}).then( labels => {
      res.send({ status: 200, labels, message: "labels loaded successfully" });
    }).catch(err => {
      console.log("error while fetching labels from db", err);
      res.send( { status: 400, message: "error while fetching labels" });
    })
});

app.post('/labels', (req, res) => {
    Label.create( { labelText: req.body['label'] }, (err, label) => {
      if(err) {
        console.log("Error while saving label", err);
        res.send({ status: 400, message: "Unable to save label"});
      } 
      else {
        res.send({
                    status: 200, message: "Label saved succesfully", label
                });
        // Note.findById( req.body.id, ( err, note) => {
        //   if(err) {
        //     console.log("Something went wrong while fetching note in post /labels", err);
        //     res.send({
        //       status: 400, message: err
        //     });
        //   }
        //   else {
        //     note.labels.push(label);
        //     note.save( (err, note) => {
        //       if(err) {
        //         console.log("Something went wrong while saving label in note", err);
        //         res.send({
        //           status: 400, message: "Unable to save label in note"
        //         });
        //       }
        //       else {
        //         res.send({
        //           status: 200, message: "Label saved succesfully", label
        //         });
        //       }
        //     } );
        //   }
        // }) 
      }    
    } );
});

app.get('/labels/:id', (req, res) => {
  Note.find( {labels: req.params.id} ).populate("reminder").populate("labels").exec( (err, notes) => {
    if(err) {
      console.log("error in labels/id", err);
      res.send({ status: 400, message: "unable to get tasks with this label"});
    }
    else {
      res.send( {status: 200, notes} );
    }
  })
})

app.patch('/labels/:id', (req, res) => {
  Label.findByIdAndUpdate( req.params.id, req.body, (err, newLabel) => {
      if(err) {
        console.log("unable to edit label", err);
        res.send({ status: 400, message: "Unable to edit label"});
      }
      else {
        res.send( {status: 200, newLabel, message: "Label saved successfully"} );
      }
  })
})

app.delete('/labels/:id', (req, res) => {

    Note.updateMany( { labels: req.params.id }, { $pullAll: { labels: [ req.params.id ] } }, (err, notes) => {
        if(err) {
          console.log("error while finding notes with this label", err);
          res.send({ status: 400, message: "error while finding notes with this label"});
        }
        else {
          Label.findByIdAndDelete( req.params.id, (err, label) => {
              if(err) {
                console.log("error while deleting label", err);
                res.send({ status: 400, message: "error while deleting label"});
              }
              else {
                res.send({ status: 200, message: 'label deleted succesfully' });
              }
          });
        }
    });  
});

app.get('/reminders', (req, res) => {
  Note.find({reminder: { $ne: null } }).populate("reminder").populate("labels").exec( (err, notes) => {
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
   } )
})

app.delete('/reminders/:id', (req, res) => {
  Note.findOneAndUpdate( { reminder: req.params.id}, { reminder: null} , (err, updatedNote) => {
        if(err) {
          console.log("error while finding note with this reminder id", err);
          res.err({ status: 400, message: "Error while finding note with this reminder id"});
        }
        else {
          Reminder.findByIdAndDelete( req.params.id)
          .then( deletedReminder => { 
            res.send( { status: 200, message: "Reminder deleted successfully"});
          })
          .catch( err => {
            res.send( { status: 400, message: "Reminder deleted successfully from note"});
          })
        }
  });  
})


app.get('/archive', (req, res) => {
  Note.find({  status: 1}).populate("reminder").exec( (err, notes) => {
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
   } )
})

app.get('/bin', (req, res) => {
  Note.find({  status: 2}).populate("reminder").exec( (err, notes) => {
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
   } )
})

app.get("**", (req, res) => {
  res.send({ status: 404, message: "not found" })
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