const express = require('express');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const _ = require('lodash');
//const fs = require('fs')
var path = require('path');
const morgan = require('morgan');
const { json } = require('body-parser');
//const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
app = express();
app.use(fileUpload({
    createParentPath: true
}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(morgan('dev'));
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/',(req, res) => {
    res.send('Hello world');
});

app.get('/send3d',(req, res) => {
    // res.send('Here the 3D Object File will be sent');
    if(fs.existsSync('./objects/object.ply')) {
        res.sendFile(path.join(__dirname, '/objects', 'object.ply'));
    }
});

app.get('/sendjson',(req, res) => {
    // res.send('Here the JSON File will be sent');
    if(fs.existsSync('./data/camData.json')) {
        res.sendFile(path.join(__dirname, '/data', 'camData.json'));
    }
});

app.get('/model.pth',(req, res) => {
    // res.send('Here the JSON File will be sent');
    if(fs.existsSync('./models/model.pth')) {
        res.sendFile(path.join(__dirname, '/models', 'model.pth'));
    }
});

app.get('/datatrigger',(req, res) => {
    // To send check signal for uploaded files
    if(fs.existsSync('./objects/object.ply')) {
        if(fs.existsSync('./data/camData.json')) {    
            res.send('true')
        }
    } else {
        res.send('false')
    }
});

app.get('/startrender',(req, res) => {
    // To send start trigger to BE
    if(fs.existsSync('./data/rendertrigger.txt')) {
        res.send('true')
        //setTimeout(() => console.log('Trigger sent, Blender-Gen will now be triggered'), 1000)
        console.log('Trigger sent, Images will be rendered now!')
        try {
            fs.unlinkSync('./data/rendertrigger.txt')
            fs.unlinkSync('./data/camData.json')
            fs.unlinkSync('./objects/object.ply')
            //files removed
          } catch(err) {
            console.error(err)
          }
    } else {
        res.send('false')
    }
});

app.get('/starttrain',(req, res) => {
    // To send start trigger to BE
    if(fs.existsSync('./data/traintrigger.txt')) {
        res.send('true')
        //setTimeout(() => console.log('Trigger sent, Blender-Gen will now be triggered'), 1000)
        console.log('Trigger sent, Training will start now!')
        try {
            fs.unlinkSync('./data/traintrigger.txt')
            //files removed
          } catch(err) {
            console.error(err)
          }
    } else {
        res.send('false')
    }
});

app.get('/stoptrain',(req, res) => {
    // To send start trigger to BE
    if(fs.existsSync('./data/trainstop.txt')) {
        res.send('true')
        //setTimeout(() => console.log('Trigger sent, Blender-Gen will now be triggered'), 1000)
        console.log('Trigger sent, Training will start now!')
        try {
            fs.unlinkSync('./data/trainstop.txt')
            if(fs.existsSync('./progress/renderprogress.json')) {
                fs.unlinkSync('./progress/renderprogress.json')
            }
            if(fs.existsSync('./progress/trainprogress.json')) {
                fs.unlinkSync('./progress/trainprogress.json')
            }

            //files removed
          } catch(err) {
            console.error(err)
          }
    } else {
        res.send('false')
    }
});

app.get('/getrenderprogress',(req, res) => {
    // To send start trigger to BE
    if(fs.existsSync('./progress/renderprogress.json')) {
        fs.readFile('./progress/renderprogress.json', 'utf8', function(err, contents) {
            if (err) {
              // we have a problem because the Error object was returned
            } else {
              const data = contents;
              res.send(contents);
            }
        });
    } else {
        res.send('false')
    }
});

app.get('/gettrainprogress',(req, res) => {
    // To send start trigger to BE
    if(fs.existsSync('./progress/trainprogress.json')) {
        fs.readFile('./progress/trainprogress.json', 'utf8', function(err, contents) {
            if (err) {
              // we have a problem because the Error object was returned
            } else {
              const data = contents;
              console.log(contents)
              res.send(contents);
            }
        });
    } else {
        res.send('false')
    }
});

app.get('/dockerrequest',(req, res) => {
    // To send start trigger to BE
    if(fs.existsSync('./data/docker.json')) {
        fs.readFile('./data/docker.json', 'utf8', function(err, contents) {
            if (err) {
              // we have a problem because the Error object was returned
            } else {
              const data = contents;
              res.send(contents);
            }
        });
    } else {
        res.send('false')
    }
    try {
        fs.unlinkSync('./data/docker.json')
        if(fs.existsSync('./progress/renderprogress.json')) {
            fs.unlinkSync('./progress/renderprogress.json')
        }
        if(fs.existsSync('./progress/trainprogress.json')) {
            fs.unlinkSync('./progress/trainprogress.json')
        }
        if(fs.existsSync('./data/trainstop.txt')) {
            fs.unlinkSync('./data/trainstop.txt')
        }
        if(fs.existsSync('./models/model.pth')) {
            fs.unlinkSync('./models/model.pth')
        }
        //files removed
      } catch(err) {
        console.error(err)
      }
});

app.post('/log', (req, res) => {

    console.log('Backend sent the following message:');
    console.log(req.body.msg);
    res.send("Successfully received your data");

});

app.post('/renderprogress', (req, res) => {

    console.log(req.body.current);
    var dir1 = './progress'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }
   
    fs.writeFile('./progress/renderprogress.json', req.body.current, err => {
        if( err ) {
            console.log(err);
        } else {
            console.log('File successfully written!');
            res.send("Successfully received your data");
        }
    });

});

app.post('/trainprogress', (req, res) => {

    console.log(req.body);
    var dir1 = './progress'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }
    var asjson = JSON.stringify(req.body)
    fs.writeFile('./progress/trainprogress.json', asjson, err => {
        if( err ) {
            console.log(err);
        } else {
            console.log('File successfully written!');
            res.send("Successfully received your data");
        }
    });

});

app.post('/loaddocker',(req, res) => {
    console.log(req.body);
    var dir1 = './data'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }
    var asjson = JSON.stringify(req.body)
    fs.writeFile('./data/docker.json', asjson, err => {
        if( err ) {
            console.log(err);
        } else {
            console.log('File successfully written!');
            res.send("Successfully received your data");
        }
    });
    
});

app.post('/uploadcamdata',(req, res) => {
    console.log(req.query.myData);
    var dir1 = './data'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }
   
    fs.writeFile('./data/camData.json', req.query.myData, err => {
        if( err ) {
            console.log(err);
        } else {
            console.log('File successfully written!');
            res.send("Successfully received your data");
        }
    });
    
});

app.post('/uploadlabels',(req, res) => {
    try {
        var dir2 = './data'
        if (!fs.existsSync(dir2)){
            fs.mkdirSync(dir2);
        }

        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "obj3d") to retrieve the uploaded file
            let jsond = req.files.json;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            jsond.mv('./data/labels.json'); 
            
            console.log('Labels successfully uploaded!');
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.post('/receiverendertrigger',(req, res) => {
    console.log(req.query.myData);
    var dir1 = './data'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }    
    fs.writeFile('./data/rendertrigger.txt', req.query.myData, err => {
        if( err ) {
            console.log(err);
        } else {
            console.log('File successfully written!');
            res.send("Successfully received your data");
        }
    });
    
});

app.post('/receivetraintrigger',(req, res) => {
    console.log(req.query.myData);
    var dir1 = './data'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }    
    fs.writeFile('./data/traintrigger.txt', req.query.myData, err => {
        if( err ) {
            console.log(err);
        } else {
            console.log('File successfully written!');
            res.send("Successfully received your data");
        }
    });
    
});

app.post('/receivetrainstop',(req, res) => {
    console.log(req.query.myData);
    var dir1 = './data'
    if (!fs.existsSync(dir1)){
        fs.mkdirSync(dir1);
    }    
    fs.writeFile('./data/trainstop.txt', req.query.myData, err => {
        if( err ) {
            console.log(err);
        } else {
            console.log('File successfully written!');
            res.send("Successfully received your data");
        }
    });
    
});

app.post('/upload3d', async (req, res) => {
    try {
        var dir2 = './objects'
        if (!fs.existsSync(dir2)){
            fs.mkdirSync(dir2);
        }

        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "obj3d") to retrieve the uploaded file
            let obj3d = req.files.obj3d;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            obj3d.mv('./objects/' + 'object.ply'); //obj3d.name
            
            console.log('3D model successfully uploaded!');
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: obj3d.name,
                    mimetype: obj3d.mimetype,
                    size: obj3d.size
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.post('/uploadImg', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
            var dir2 = './real_images'
            if (!fs.existsSync(dir2)){
                fs.mkdirSync(dir2);
            }
            try {
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                    
                    console.log('looped')
                    let photo = req.files.photos[key];
                    
                    //move photo to uploads directory
                    photo.mv('./real_images/' + photo.name);

                    //push file details
                    data.push({
                        name: photo.name,
                        mimetype: photo.mimetype,
                        size: photo.size
                    });

            });
            } catch {
                console.log("failed")
                console.log(err);
                res.status(500).send(err);
            }
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// app.post('/uploadmodel', upload.single('files'), (req, res) => {
//     console.log(req.files)
//     var fileWriteStream = fs.createWriteStream(req.files.originalname);
//     fileWriteStream.on('finish', () => {
//         console.log('file saved successfully');
//         res.send({ message: 'file saved successfully' })
//     })
//     fileWriteStream.end(req.file.buffer)
// })

app.post('/uploadmodel', async (req, res) => {
    try {
        var dir2 = './models'
        if (!fs.existsSync(dir2)){
            fs.mkdirSync(dir2);
        }

        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
           
            //Use the name of the input field (i.e. "obj3d") to retrieve the uploaded file
            let modelfile = req.files.upload_file;
            console.log(req.files.upload_file)
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            modelfile.mv('./models/' + 'model.pth'); //obj3d.name
        
            };
            console.log('3D model successfully uploaded!');
            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                // data: {
                //     name: obj3d.name,
                //     mimetype: obj3d.mimetype,
                //     size: obj3d.size
                // }
            });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log('listening on port ${port} ...'));
