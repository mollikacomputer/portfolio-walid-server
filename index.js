const express = require('express');
const app = express();
const env = require('dotenv').config();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());
app.get('/', (req, res) =>{
    res.send('portfolio walid is testing')
});
//user walid2
// password UQGEQvGi2hZIsW2R

const uri = "mongodb+srv://walid2:UQGEQvGi2hZIsW2R@cluster0.lj1zpkv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const verifyJWT=(req, res, next)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:"UnAuthorized access"});
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
    if(err){
      return res.status(403).send({message:"Forbidden access"})
    }
    req.decoded = decoded;
    next();
  });
}

async function run(){
    try{
      await client.connect();
      const serviceCollection = client.db('walid2').collection('service');
      const commentCollection = client.db('walid2').collection('comment');
      const userCollection = client.db('walid2').collection('user');
       
      // All user section update
      app.get('/users/', async(req, res)=>{
        // const authorization = req.headers.authorization;
        // console.log('auth headers', authorization);
        const users = await userCollection.find().toArray();
        res.send(users);
      });
      // Admin user section update
      app.put('/users/admin/:email', verifyJWT, async(req, res)=>{
        const email = req.params.email;
        const requester = req.decoded.email;
        const requesterAccount = await userCollection.findOne({email:requester});
        if(requesterAccount.role === 'admin'){
          const filter = {email:email};
          const updatedDoc={
            $set:{role:'admin'},
          };
          const result = await userCollection.updateOne(filter, updatedDoc)
          res.send(result);
        }
        else{
          res.status(403).send({message:'Forbidden'})
        }
       
      });
      app.get('/admin/:email', async(req, res) => {
        const email = req.params.email;
        const user = await userCollection.findOne({email:email});
        const isAdmin = user.role === 'admin';
        res.send({admin:isAdmin});
      })
        // delete user data
        app.delete('/users/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await userCollection.deleteOne(query);
          res.send(result);
      });
      // user section update
      app.put('/user/:email', async(req, res)=>{
        const email = req.params.email;
        const user = req.body;
        const filter = {email:email};
        const options = {upsert:true};
        const updatedDoc={
          $set:user,
        };
        const result = await userCollection.updateOne(filter, updatedDoc, options)
        const token = jwt.sign({email:email}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        res.send({result, token});
      });
      // step 1 add new service or post data
      app.post('/service', async(req, res) => {
        const newService = req.body;
        console.log('adding new service', newService);
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
      });
      
      // step 2 get existing all data from database
      app.get('/service/', async(req, res) => {
        const query = {};
        const cursor = serviceCollection.find(query);
        const service = await cursor.toArray();
        res.send(service);
      });
      // delete service data
      app.delete('/service/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await serviceCollection.deleteOne(query);
        res.send(result);
    });
    // delete service data
    app.delete('/comment/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await commentCollection.deleteOne(query);
      res.send(result);
  });
// update comment step 1
  app.get('/dashboard/updatecomment/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id:ObjectId(id)};
    const result = await commentCollection.findOne(query);
    res.send(result);
  });
  //update comment step 2
  app.put('/dashboard/updatecomment/:id', async(req, res)=>{
    const id = req.params.id;
    const updateComment = req.body;
    const filter = {_id:ObjectId(id)};
    const options = {upsert:true};
    const updateDoc={
      $set:{
        name: updateComment.name,
        description: updateComment.description,
        rating:updateComment.rating,
        location:updateComment.location,
        image:updateComment.image,
      }
    };
    const result = await commentCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  } )
    // for update service step 1
    app.get('/dashboard/updateservice/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });
    // update service step 2
      app.put('/dashboard/updateservice/:id', async(req, res)=>{
        const id = req.params.id;
        const updateService = req.body;
        const filter = {_id:ObjectId(id)};
        const options = {upsert:true};
        const updateDoc={
          $set:{
            name: updateService.name,
            description: updateService.description,
            budget:updateService.budget,
            image:updateService.image,
            
          }
        };
        const result = await serviceCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      } )

      app.post('/comment', async(req, res) => {
        const newComment = req.body;
        console.log('adding new comment', newComment);
        const result = await commentCollection.insertOne(newComment);
        res.send(result);
      });
      app.get('/comment/', async(req, res) => {
        const query = {};
        const cursor = commentCollection.find(query);
        const comment = await cursor.toArray();
        res.send(comment);
      });
      //  comment section crud
      
    }finally{
      
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listening to port, ${port}`)
})