const mongoose = require('mongoose')

const connectdb = async()=>{
    try{
      await mongoose.connect('mongodb+srv://jayakrishnajk56:m-LeukEktKmkNW4@cluster0.ytrac.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        console.log('db connected')
    }catch(error){
        console.log(error)
    }
} 

module .exports = connectdb