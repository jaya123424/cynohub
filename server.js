
let express = require('express')
let bcrypt = require('bcryptjs')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
require('dotenv').config()
let jwt = require('jsonwebtoken')
let app = express()
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine','ejs')
app.use(cookieParser())

let mangoose = require('mongoose')
mangoose.connect(process.env.mongoo_URI)

let db = mangoose.connection

db.once('open',()=>{
    console.log('successfully connected to db')
})

db.on('error',(error)=>{
    console.log(error)
})


app.get('/',(req,res)=>{
    let {token} = req.cookies

     if(token){
        let tokenData = jwt.verify(token,process.env.JWT_SECRET_KEY)
      if(tokenData.type == 'user'){
        res.render('home')
    }
     }else{
        res.redirect('/signin')
    }
     
})

app.get('/signin',(req,res)=>{
    res.render('signin')
})


app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.post('/signup',async(req,res)=>{
    let {name,email,password: plainTextPassword} = req.body
     let salt = await bcrypt.genSalt(10)
    let encryptedPassword = await bcrypt.hashSync(plainTextPassword,salt)

    try{
        await user.create({
            name,
            email,
            password : encryptedPassword
        })
        res.redirect('/signin')

    } catch(error){
        console.log(error)
    }
})

app.post('/signin',async(req,res)=>{

    let {email,password} = req.body

    let userObj = await user.findOne({email})

    if(!userObj){
        res.send({error:"user doesn't exit ",status:404})

    }

    try{
        
        if(bcrypt.compare(password,userObj.password)){
            let token = jwt.sign({
                userId: userObj._id,email:email,type: 'user'
            }, process.env.JWT_SECRET_KEY,{expiresIn:'2h'})
               res.cookie('token',token,{maxAge:2*60*60*1000})
              res.redirect('/')
           }
    
    } catch(error){
        console.log(error)
    }

}) 

let userRouter = require('./routes/user')
const user = require('./model/user')

app.use('/users',userRouter)


app.listen(5000)

console.log('server is listening on 5000')