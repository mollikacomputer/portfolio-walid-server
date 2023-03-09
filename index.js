const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('portfolio walid is testing')
});
//user walid2
// password UQGEQvGi2hZIsW2R

const uri = "mongodb+srv://walid2:UQGEQvGi2hZIsW2R@cluster0.lj1zpkv.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect();
      const serviceCollection = client.db('walid2').collection('service');
      const commentCollection = client.db('walid2').collection('comment');
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
      // app.delete('/service/:id', async(req, res) =>{
      //   const id = req.params.id;
      //   const query = {_id:ObjectId(id)};
      //   const result = await serviceCollection.deleteOne(query);
      //   res.send(result);
      // });
      // comment collection section
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
    }finally{
      
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listening to port, ${port}`)
})