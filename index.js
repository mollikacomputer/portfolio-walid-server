const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
// const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('portfolio walid is testing')
});
//user portfoliowalid
// password zENlRw8osW6EYNxZ


const uri = "mongodb+srv://portfoliowalid:zENlRw8osW6EYNxZ@cluster0.ok6zpfz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      await client.connect();
      const serviceCollection = client.db('portfoliowalid').collection('service');

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

      
    }finally{

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listening to port, ${port}`)
})