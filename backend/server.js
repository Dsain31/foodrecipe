var {mongoose} = require('./connection/connec');
var {user} = require('./models/model');
const express = require('express');
const app = express();
var fs = require('fs');
var {recipe} = require('./models/recipe');

const bodyParser = require('body-parser');
//set headers for http request
app.use(function(req,res,next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, PATCH');
    next();
});

app.use(bodyParser.json({limit: '50mb'})); //json data limit 50mb
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); //encoded url 50mb

app.post('/register', (req, res) => {
    // user.findOne({email: req.body.email}).then((useR)=> {
    //     //if it is returned null document
    //     if(useR.length == 0){
    //         console.log('documents return null');
    //         return res.send(true);
    //     }
    //     // check user exist or not
    //     if(useR.length >= 1) {
    //         if(useR[0].email == req.body.email) {
    //             // return res.status(409).json({
    //             //     response: 'you are already register!'
    //             // })
    //             console.log('already registerd');
    //             return res.send(true);
    //         }
    //     } else {
            
    //     }
    // }).catch((err)=> {
    //     res.send(err);
    // })
    var data = new user({
        email: req.body.email,
        pswd: req.body.pswd,
        name: req.body.name
    })
    data.save().then((resp)=> {
        console.log('registered!');
        res.send(resp._id);
    }).catch((error)=> {
        res.send(error);
    })
})

app.get('/login', (req, res) => {
    let data = JSON.parse(req.query.data); // change object to string
    user.find({email: data.email }).then((useR) => {
        //if user document is null then
        if(useR.length === 0) {
            res.status(401).json({
                error: 'User not exist'
            })
        } else {
            if(useR[0].email == data.email && useR[0].pswd == data.pswd) {
                console.log("seccessfully login");
                res.send(useR[0]._id);
            } else {
                res.json({
                    msg: "user not exist"
                })
            }
        }
    }).catch((err) => {
        res.status(401).json({
            msg: 'user not exist!'
        });
    });
});

app.get('/getData', (req, res)=> {
    //check id is valid or not
    if (req.query._id.match(/^[0-9a-fA-F]{24}$/)) {
        user.findById(req.query._id).then((result)=> {
            res.json({
                email: result.email,
                name: result.name
            })
        }).catch((error)=> {
            console.log(error);
        })
      }
})

app.post('/uploadRecipe', (req, res)=> {
    let imageName = req.body.id + req.body.imgName + '.' + req.body.ext;
    //check valid id or not
    if (req.body.id.match(/^[0-9a-fA-F]{24}$/)) {
        user.findById(req.body.id).then((result)=> {
            recipe.findById(result._id).then((r)=> {
                if(r != undefined) {
                } else {
                    var data = new recipe({
                        foreign_id: req.body.id,
                        title: req.body.title,
                        categoryName: req.body.category,
                        imgName: imageName,
                        ingrediants: req.body.ingreds
                    })
                    data.save().then((rt)=> {
                        let buffer = Buffer.from(req.body.imgUrl, 'base64');
                          fs.writeFile('./database/'+ imageName, buffer, (err, response)=> {
                            //   console.log(response);
                              if(err) {
                                  res.send(err);
                              } else {
                                console.log('uploaded');
                                  res.json({
                                      response: 'suceessfully uploaded'
                                  })
                              }
                          });
                    }).catch((error)=> {
                        console.log(error);
                    })
                }
            }).catch((err)=> {
                console.group(err);
            })
        }).catch((er)=> {
            console.log(er);
        })
      }
});

app.get('/getImages', (req, res)=> {
    fs.readFile( './database/' + req.query.imgname, 'base64', (error, buffer)=> {
        if (error) {
            res.send(error);
        } else {
            let img =  buffer.toString('base64');
            let imager = { 'imageUrl': img };
            res.send(imager);
        }
    });
})

app.get('/myRecipe', (req, res)=> {
    user.findById(req.query.id).then((result)=> {
        recipe.find({foreign_id:result._id}).then((respo)=> {
            // console.log(respo);
            res.send(respo);
        }).catch((err)=> {
            console.log(err);
        })
    }).catch((er)=>{
        console.log(er);
    })
})

app.get("/recipe", (req,res)=>{
    recipe.findById(req.query.id).then((respo)=> {
        // console.log(respo);
        res.send(respo);
    }).catch((err)=> {
        console.log(err);
    })
})

app.post('/updateRecipe', (req, res)=> {
    //delete the fields in document
    recipe.findOneAndUpdate({_id: req.body.recipeId}, {$unset: {ingrediants: 1}}, {
        multi: true
    }).then((docs)=> {
        recipe.findOneAndUpdate({_id:req.body.recipeId}, {$push: {
            'ingrediants': req.body.ingrediants
        }}).then((doc)=> {
            //if oldimage has not changed then
            if(doc.imgName == req.body.imgname) {
                res.json({
                    response: 'recipe updated'
                })
            } else {
                let newImageName = req.body.id + req.body.imgname + '.' + req.body.imgext;
                recipe.findOneAndUpdate({imgName: req.body.oldImage}, {$set: {
                    imgName: newImageName
                }}).then((resp)=> {
                    //delete the file from storage
                    fs.unlink('./database/'+ req.body.oldImage, (errors, repss)=> {
                        if(errors){
                            throw errors;
                        } else {
                            console.log('delete image');
                            let buffer = Buffer.from(req.body.imgurl, 'base64');
                          fs.writeFile('./database/'+ newImageName, buffer, (err1, response)=> {
                              if(err1) {
                                  res.send(err1);
                              } else {
                                console.log('uploaded');
                                  res.json({
                                      response: 'suceessfully updated'
                                  })
                              }
                          });
                        }
                    })
                }).catch((error)=> {
                    console.log(error);
                })
            }
        }).catch((er)=> {
            console.log(doc);
        })
    }).catch((err)=> {
        console.log(err);
    })
})

app.post('/deleteRecipe', (req, res)=> {
    recipe.findById(req.body.recipeId).then((docs)=> {
        //delete file from storage
        fs.unlink('./database/'+ docs.imgName, (errors, repss)=> {
            if(errors){
                throw errors;
            } else {
                //delete document
                recipe.deleteMany({_id: req.body.recipeId}).then((resp)=> {
                    res.json({
                        response: 'Recipe is deleted!'
                    })
                }).catch((err)=> {
                    console.log(err);
                })
            }
        })
    }).catch((err)=> {
        console.log(err);
    })
})

app.get('/recipes', (req,res)=> {
    recipe.find({}).then((docs)=> {
        res.json({
            obj: docs
        })
    }).catch((er)=> {
        console.log(er);
    })
})

app.get('/searchRecipe', (req,res)=> {
    //create index of document fields for text search on mongoDB shell
    // db.store.createIndexes({title: "text", categoryName: "text"})
    recipe.find({$text: {$search: req.query.keyword}}).then((docs)=> {
        console.log(docs);
        res.send(docs);
    }).catch((er)=> {
        console.log(er);
    })
})

app.listen(8000, function() {
    console.log('server is running on 8000');
});