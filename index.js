const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const app = express()
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://myFirstMogo:${process.env.DB_PASS}@cluster0.2xl13.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("GeniusCarMachanic");
        const servicesCollection = database.collection("services");
        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await servicesCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })
        // get specific api
        app.get('/services/:serviceId', async (req, res) => {
            const id = req.params.serviceId;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query)
            res.send(service)
        })
        // upate api
        app.put('/services/:serviceId', async (req, res) => {
            const id = req.params.serviceId;
            const updatedService = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedService.name,
                    price: updatedService.price,
                    img: updatedService.img,
                    description: updatedService.description
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
        // delete api
        app.delete('/services/:serviceId', async (req, res) => {
            const id = req.params.serviceId;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result)
        })
        // Get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const service = await cursor.toArray()
            res.send(service)
        })
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('server hiting')
})
app.listen(port, () => {
    console.log(`listening from http://localhost:${port}`)
})