const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.leesidy.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

async function run() {
    try {
        const usersCollection = client.db('todoApp').collection('users');
        const todosCollection = client.db('todoApp').collection('todos')

        //users collection
        app.post('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const getUser = await usersCollection.find(filter).toArray();
            if (getUser.length > 0) {
                return res.send({ acknowledged: true })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // todos collection 

        app.get('/todos', async (req, res) => {
            const email = req.query.email;
            const filter = { email }
            let allTodos = await todosCollection.find(filter).toArray();
            res.send(allTodos);
        })

        app.post('/todos', async (req, res) => {
            const todo = req.body;
            const result = await todosCollection.insertOne(todo);
            res.send(result);
        });

        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const result = await todosCollection.deleteOne(filter);
            res.send(result);
        })

        app.put('/todos/:id', async (req, res) => {
            const id = req.params.id;
            const doc = req.body;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: doc
            }
            const result = await todosCollection.updateOne(filter, updateDoc);
            res.send(result);

        })


    }
    catch {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Welcome to todoApp server!");
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})