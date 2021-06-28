// imports & middlewares

require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const Verification = require('./models/verification');
const session = require('express-session');
const path = require('path');
const MongoDBStore = require('connect-mongodb-session')(session);
const random = require('./util/random');


// mongodb+srv://admin:admin@cluster0.l9nib.mongodb.net/alhadimart?retryWrites=true&w=majority

const store = new MongoDBStore({
   uri: "mongodb+srv://admin:admin@cluster0.l9nib.mongodb.net/alhadimart?retryWrites=true&w=majority",
   collection: 'store'
});
const fileStorage = multer.diskStorage({
   destination: (req, file, cb)=>{
     cb(null, 'public/images');
   },
   filename: (req, file, cb)=>{
     cb(null, random.generateRandomString(10) + '-' + file.originalname)
   }
 });
const fileFilter = (req, file, cb)=>{
   if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
     cb(null, true);
   }else{
     cb(null, false);
   }
 }

app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(session({secret: 'EswyY5JiDFBEiObU', resave: false, saveUninitialized: false, store: store}));
app.set('view engine', 'ejs');

const userController = require('./controllers/user-controller');

// routes
const adminRoutes = require('./routes/admin-routes');
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const apiRoutes = require('./routes/api-routes');

app.use(authRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use('/api', apiRoutes);

// 404 error

app.use(userController.error404);

app.listen(process.env.PORT, ()=>{
   console.log("server started at 3000");
});
