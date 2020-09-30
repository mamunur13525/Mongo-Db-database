const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const password = 'haxp2dt1oYKKHrxI';

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://userData:haxp2dt1oYKKHrxI@cluster0.mde5k.mongodb.net/organicUser?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})) 

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html")
})


client.connect(err => {
  const collection = client.db("organicUser").collection("products");
  app.get('/product', (req, res)=>{
    collection.find({})
    .toArray((error, documents) =>{
        res.send(documents);
    })
  })

  app.post('/addProduct', (req, res)=> {
    const productInfo = req.body;
 
    collection.insertOne(productInfo)
    
    .then(ressult =>{
      res.redirect('/')
    })
  })

  app.get('/product/:id', (req, res)=>{
 
      collection.find({_id:ObjectId(req.params.id)})
      .toArray((error, documents) =>{
        res.send(documents[0])
      })
  })

  app.patch('/update/:id',(req, res)=>{
  
    collection.updateOne(
      {_id:ObjectId(req.body.id)}
      ,
      {$set:{
        price: req.body.price,
        quantity: req.body.quantity
      }}
      )
      .then(result=>{
        res.send(result.modifiedCount> 0)
      })
    
  })


  app.delete('/delete/:id', (req,res) => {
    collection.deleteOne({
      _id:ObjectId(req.params.id)
    })
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
    
  
  })

 
});


app.listen(3000,console.log("3000 post is Live"));