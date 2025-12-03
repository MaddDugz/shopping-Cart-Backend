const {DisplayProducts, AddProduct, upload, UpdateProduct, deleteProduct, findProduct, findProductById} = require("../controllers/products.js");
const express = require("express");
const router = express.Router();

router.get("/products",  DisplayProducts);
router.post("/user/product", upload.single('image'), AddProduct);
router.delete("/products/delete/:id", deleteProduct);
router.put("/products/update/:id", upload.single('image'), UpdateProduct);
router.get("/products/product", findProduct);
router.get("/products/productById/:id", findProductById);



module.exports = router;