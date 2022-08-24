const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
app.use(cors());
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('portfolio walid is testing')
});
//user portfoliowalid
// password zENlRw8osW6EYNxZ


const uri = "mongodb+srv://portfoliowalid:zENlRw8osW6EYNxZ@cluster0.ok6zpfz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("portfoliowalid").collection("service");
  // perform actions on the collection object
  client.close();
});


async function run(){
    try{
      await client.connect();
      const serviceCollection = client.db('portfoliowalid').collection('service');
      
    }finally{

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listening to port, ${port}`)
})