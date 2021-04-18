const express = require('express')
const app = express();
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const port = process.env.PORT || 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m99d8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());
app.use(express.static('services'));
app.use(fileUpload());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  
  const adminCollection = client.db("assignment11").collection("admin");
  const servicesCollection = client.db("assignment11").collection("services");
  const reviewCollection = client.db("assignment11").collection("review");
  const bookingCollection = client.db("assignment11").collection("booking");

  console.log('replying from the database');


app.post('/addService',(req,res)=>{
  const file = req.files.file;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;
  console.log(name,description,price,file);
  file.mv(`${__dirname}/services/${file.name}`,err =>{
    if(err){
      console.log(err);
      return res.send.status(500).send({msg:'failed to upload image'});
    }
    servicesCollection.insertOne({ name, description,price, img: file.name }).then((result) => {
      res.send(result.insertedCount > 0);
  });
  });
});

app.post('/makeAdmin',(req,res)=>{
  const email = req.body.email;

    adminCollection.insertOne({ email }).then((result) => {
    res.send(result.insertedCount > 0);
});
})

app.post('/review',(req,res)=>{
  const name = req.body.name;
  const review = req.body.review;

    reviewCollection.insertOne({ name,review }).then((result) => {
    res.send(result.insertedCount > 0);
});
})

app.post('/book',(req,res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const price = req.body.price;

    bookingCollection.insertOne({ name,email,price }).then((result) => {
    res.send(result.insertedCount > 0);
});
});

app.get('/book',(req,res)=>{
  bookingCollection.find()
  .toArray((err,items)=>{
    res.send(items);
  })
})

app.get('/review', (req, res) => {
  reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
  });
});

// app.get('/admin', (req, res) => {
//   console.log(req.query.email);
//   // adminCollection.find({email: req.query.email})
//   // .toArray((err,documents)=>{
//   //   res.send(documents);
//   // })
//   const email = req.body.email;
//   adminCollection.find({email:email})
//   .toArray((err,documents)=>{
//     if(documents.length ==0){
//     filter.email = email;
//     }
//   })
// });

app.post('/isAdmin',(req,res)=>{
  const email = req.body.email;
  adminCollection.find({email:email})
  .toArray((err,admin)=>{
    res.send(admin.length>0);
  })
})

app.get('/deals',(req,res)=>{
  bookingCollection.find({email: req.query.email})
  .toArray((err,documents)=>{
    res.send(documents);
  })
})


app.get('/services', (req, res) => {
  servicesCollection.find({}).toArray((err, documents) => {
      res.send(documents);
  });
});

app.get('/book/:id',(req,res)=>{
  console.log(req.params.id,'this is booking');
  servicesCollection.find({_id:ObjectId(req.params.id)})
  .toArray((err,items)=>{
    res.send(items);
  })
})

app.delete('/delete/:id',(req,res)=>{
  console.log(req.params.id);
  servicesCollection.deleteOne({_id:ObjectId(req.params.id)})
  .then((result)=>{
    console.log(result);
  })
})

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(process.env.Port||port)