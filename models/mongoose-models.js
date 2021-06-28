const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.l9nib.mongodb.net/alhadimart?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    password: String,
    verified: Boolean,
    accountType: String,
    canManageProduct: Boolean,
    canManageUser: Boolean,
    canManageOrder: Boolean,
    address1: String,
    address2: String
});

exports.usermodel = mongoose.model("User", userSchema);

const verificationSchema = mongoose.Schema({
    phone: String,
    code: String,
    valid: Number
});

exports.verificationmodel = mongoose.model("Verification", verificationSchema);

const catagorySchema = new mongoose.Schema({
   name: String
});

exports.catagorymodel = new mongoose.model('Catagory', catagorySchema);

const subcatagorySchema = new mongoose.Schema({
    name: String,
    image: String,
    catagory: catagorySchema
});

exports.subcatagorymodel = new mongoose.model('Subcatagory', subcatagorySchema);

const productsSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    sale: Number,
    rating: Number,
    colors: Array,
    sizes: Array,
    details: String,
    stock: Number,
    totalItemsSold: Number,
    subcatagory: subcatagorySchema
});

exports.productmodel = new mongoose.model('Product', productsSchema);

const cartSchema = new mongoose.Schema({
    user: userSchema,
    items: [{
        product: productsSchema,
        extraDetail: String,
        quantity: Number
    }]
});

exports.cartmodel = new mongoose.model('Cart', cartSchema);

const orderSchema = new mongoose.Schema({
    phone: String,
    cart: cartSchema,
    address: String,
    totalPrice: Number,
    delieveryCharges: Number,
    status: String
});

exports.ordermodel = new mongoose.model('Order', orderSchema);