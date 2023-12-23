const express = require('express');
const mongoose = require('mongoose');
const app = express();
const morgan = require('morgan');
const cors= require('cors');
const dotenv= require("dotenv");
const { errorMiddleware } = require('./error.middleware');
dotenv.config();

app.use(express.json());
app.use(morgan('dev'))
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err.message));

const mobileSchema = new mongoose.Schema({
    name: String,
    type: String,
    processor: String,
    memory: Number,
    OS: String,
    price: Number, 
    image: [String], 

});


const Mobile = mongoose.model('Mobile', mobileSchema);

app.get('/api/mobiles', async (req, res) => {
    try {
        
        let mobiles = await Mobile.find({});
        const { name, type, processor, memory, OS, price } = req.query;
        if (name) mobiles = mobiles.filter(m => m.name.split(" ")[0] === name);
        if (type) mobiles = mobiles.filter(m => m.type === type);
        if (processor) mobiles = mobiles.filter(m => m.processor === processor);
        if (memory) mobiles = mobiles.filter(m => m.memory === memory);
        if (OS) mobiles = mobiles.filter(m => m.OS === OS);
        if (price) mobiles = mobiles.filter(m => m.price >= price.split("-")[0] && m.price <= price.split("-")[1]);
        return res.status(200).json({
            status: 'success',
            results: mobiles.length,
            data: {
                mobiles
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
});


app.post('/api/mobiles/bulk', async (req, res) => {
    const mobiles = req.body.mobiles;
    if(!mobiles) {
        return res.status(400).send('Please provide mobiles');
    }
    for(let mobile of mobiles) {
        if(!mobile.name || !mobile.type || !mobile.processor || !mobile.memory || !mobile.OS || !mobile.price || !mobile.image) {
            return res.status(400).send('Please fill all the fields for each mobile');
        }
    }
    const result = await Mobile.insertMany(mobiles);
    return res.status(200).json({
        status: 'success',
        data: {
            mobiles: result
        }
    });
});




app.get('/api/mobiles/:id', async (req, res) => {
    if(!req.params.id) {
        return res.status(400).json({
            success: false ,
            message: 'Please provide id'
        
        })
    }
    const mobile = await Mobile.findById(req.params.id);
    if (!mobile) return res.status(404).json({
        success: false ,
        message: 'The mobile with the given ID was not found.'
    })
    return res.status(200).json({
        status: 'success',
        data: {
            mobile
        }
    
    })
});



app.get("/search" , async (req ,res )  =>   {
    try {
        const { search } = req.query;
        let mobiles;
        if (search) {
            mobiles = await Mobile.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { type: { $regex: search, $options: 'i' } },
                    { processor: { $regex: search, $options: 'i' } },
                    { OS: { $regex: search, $options: 'i' } },
                ]
            });
        } else {
            mobiles = await Mobile.find({});
        }
        return res.status(200).json({
            status: 'success',
            results: mobiles.length,
            data: {
                mobiles
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({

            success: false,
            message: error.message
        })
    }
})

app.use("*" , (req , res ) => {
    res.send("404 not found")

})



const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));