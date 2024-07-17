const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
require("dotenv").config();
const port = process.env.PORT || 8000;


// middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
     "http://localhost:5174",
      
    ],
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9ecoeol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection = client.db("payEaseDB").collection("users");

    // Function to create JWT token
    const createToken = (user) => {
        return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    };

    //register
    app.post('/register',async(req,res)=>{
        const { name, pin, mobileNumber, email, role } = req.body;

      // Hash the PIN
      const hashedPin = await bcrypt.hash(pin, 10);

     
      const newUser = {
        name,
        pin: hashedPin,
        mobileNumber,
        email,
        role,
        status: 'pending',
        balance: role === 'User' ? 0 : 0,
        createdAt: new Date()
      };

      const isExist = await userCollection.findOne({email});
      if(isExist){
        return res.json({error:"User Exists"})
      }

      const result = await userCollection.insertOne(newUser)
      res.send(result)
    })

    app.post('/login', async (req, res) => {
      const { user, pin } = req.body;
      
      const query = { $or: [{ email: user }, { mobileNumber: user }] };
      const foundUser = await userCollection.findOne(query);

      if (!foundUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPinValid = await bcrypt.compare(pin, foundUser.pin);
      if (!isPinValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = createToken(foundUser);
      res.json({ message: 'Login successful', token });
    });

    app.get('/all-users',async(req,res)=>{
      const result = await userCollection.find().toArray();
      res.send(result)
    })


    // Send a ping to confirm a successful connection
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("payease running");
  });
  
  app.listen(port, () => {
    console.log(`payease is running on port ${port}`);
  });