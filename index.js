const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb')


require('dotenv').config()

const app = express()
const port = process.env.PORT || 8000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tv1bc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()

        const database = client.db('spicy-restaurant')
        const foodImageCollection = database.collection('food_image')
        const menuCollection = database.collection('menu')
        const featureDishCollection = database.collection('feature-dish')

        // getting gallery image 
        app.get('/gallery', async(req, res) => {
            const cursor = await foodImageCollection.find({})
            const foodImage = await cursor.toArray()
            res.send(foodImage)
        })

        // getting menu 
        app.get('/menu', async(req, res) => {
            const cursor = await menuCollection.find({})
            const menu = await cursor.toArray()
            res.send(menu)  
        })

        // getting feature dish
        app.get('/feature-dish', async(req, res) => {
            const cursor = await featureDishCollection.find({})
            const featureDish = await cursor.toArray()
            res.send(featureDish)
        })
    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Server Running...')
})

// Listing port 

app.listen(port, () => {
    console.log('Server is running at', port)
})