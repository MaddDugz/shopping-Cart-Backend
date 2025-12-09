const ProductSchema = require("../module/productsModule.js");
const multer = require('multer'); // for multipart/form-data (file upload)
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Cloudinary = require("cloudinary").v2;

//for storage on cloud
Cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// config for file upload
const storage = new CloudinaryStorage({
  cloudinary: Cloudinary,
  params: {
    folder: "my_uploads", // cloud folder name
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

//handle deletion from cloudinary
function handleDeletion(url){
    const parts = url.split("/")
    const filename = parts.pop()
    const folder = parts.slice(7).join("/")
    return folder + "/" + filename.split(".")[0]
}

const upload = multer({ storage });


//Display all Products
const DisplayProducts = async (req, res) => {
  try{
    const products = await ProductSchema.find();
     if(products.length === 0){
     return res.json([]);
    }
    res.status(200).json({ products });
  }catch(err){
    console.error("Error:" + err.message);
  }
}

// Add Product
const AddProduct = async (req, res) => {
  try {
    const newProduct = await ProductSchema.create({
        ...req.body,
       imageUrl: req.file ? req.file.path : null // set image url to file path if file is uploaded
    }
    );
    res.status(200).json({
     id: newProduct._id,
     message: "Product Added Successfully"
    });
  }
  catch (err) {
    console.error("Error:" + err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

//Update Product
const UpdateProduct = async (req, res) => {
  try{
   const id = req.params.id 
   const updateData = {
    ...req.body,
   }

    if(req.file){
      updateData.imageUrl = req.file.path;
    }

    const updatedProduct = await ProductSchema.findByIdAndUpdate(id, updateData, { 
      new: true,  //return Updated document
      runValidators: true  //enforece schema validations
     });

    if(!updatedProduct){
     return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  }catch(err){
    console.error("Error:" + err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

//delte Product
const deleteProduct = async (req, res) => {
  try{
    const id = req.params.id 
    const Product = await ProductSchema.findById(id)
    console.log(id.imageUrl)
    const ProductImage =  handleDeletion(id.imageUrl)

      //delete image from cloudinary
      const result = await Cloudinary.uploader.destroy(ProductImage);
      console.log(result)

    const newProduct = await ProductSchema.findByIdAndDelete(id); // delete rest from db
    res.status(200).send("Product Deleted");
  }catch(err){
    console.error("Error:" + err.message);

    res.status(500).json({ message: "Server Error" });
  }
}

//find Product by name
const findProduct = async (req, res) => {
  try{
    const {q} = req.query
    const Product = await ProductSchema.find({
    name: { $regex: '^' + q, $options: 'i' }
  }).lean();

    if(Product.length === 0){
      return res.json([]);
    }

    res.status(200).json(Product);
  }
  catch(err){
    console.error("Error:" + err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

//find Product by id
const findProductById = async (req, res) => {
  try{
    const id = req.params.id
    const product = await ProductSchema.findById(id);

    if(!product){
     return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  }
  catch(err){
    console.error("Error:" + err.message);
    res.status(500).json({ message: "Server Error" });
  }
}

module.exports = { DisplayProducts, AddProduct, upload, UpdateProduct, deleteProduct, findProduct, findProductById };