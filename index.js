const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;
const {MongoClient, ServerApiVersion} = require('mongodb');

const cors = require('cors');
app.use(cors());
app.use(express.json())

app.get('/', (req, res) =>{
    res.send('portfolio walid is testing')
});

async function run(){

}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Listening to port, ${port}`)
})