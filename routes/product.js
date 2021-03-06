const express = require("express");
const { add_product, check_product } = require("../middlewares/product");
const { Product } = require("../models/product");
const { product_Validation } = require("../validations/product");
const router = express.Router();

router.post('/add', add_product, async (req, res) => {
    const result = product_Validation(req.body)
    if (result.error != null) {
        return res.json
            ({
                success: false,
                message: (result.error.details[0].message)
            })
    }
    const new_product = new Product({
        barcode: req.body.barcode,
        product_name: req.body.product_name,
        details: req.body.details,
        category: req.body.category,
        product_per_carton: req.body.product_per_carton,
        sale_price: req.body.sale_price,
        supplier_price: req.body.supplier_price,
        supplier_name: req.body.supplier_name,
    })

    console.log("before saving")
    const add_product = await new_product.save();
    console.log("after saving")

    return res.json
        ({
            success: true,
            message: "product added successfully",
            data: add_product,
        })
})

router.put('/update/:product_id', check_product, async (req, res) => {

    const result = product_Validation(req.body)
    if (result.error != null) {
        return res.json
            ({
                success: false,
                message: (result.error.details[0].message)
            })
    }
    const get_product = await Product.findOneAndUpdate(
        {
            _id: req.params.product_id
        },
        {
            product_name: req.body.product_name,
            supplier_name: req.body.supplier_name,
            buy_date: req.body.buy_date,
            product_per_carton: req.body.product_per_carton,
            quantity: req.body.quantity,
            buy_price: req.body.buy_price,
            sale_price: req.body.sale_price,
        },
        { new: true })
    //apply condionif supplier updated then fo followimg
    return res.json({
        success: true,
        message: "product Updated Successfully...",
        data: get_product
    })
    // }
    // catch (err) {
    //     res.json({
    //         success: false,
    //         message: err
    //     })
    //}
})

router.get("/get_all", async (req, res) => {
    try {
        const get_product = await Product.find({})
        if (get_product.length == 0)
            return res.json
                ({
                    success: false,
                    error: "No product in list",
                })
        if (get_product.length > 0)
            return res.json
                ({
                    success: true,
                    data: get_product
                })
    }
    catch (ex) {
        res.json({
            success: false,
            message: "Server error occur",
        })
    }
})

router.get('/get/:product_id', check_product, async (req, res) => {
    try {
        return res.json
            ({
                success: true,
                data: req.product,
            })
    }
    catch (ex) {
        res.json({
            success: false,
            message: "Server error occur",
        })
    }
})

router.delete('/delete/:product_id', check_product, async (req, res) => {
    try {
        const get_product = await Product.findOneAndRemove({ _id: req.params.product_id },
            { new: true })
        return res.json
            ({
                success: false,
                error: "product deleted successfully",
            })
    }
    catch (ex) {
        res.json({
            success: false,
            message: "Server error occur",
        })
    }
})

router.get('/total', async (req, res) => {
    try {
        const get_product = await Product.countDocuments({})
        if (get_product == 0)
            return res.json
                ({
                    success: false,
                    error: "No product in list",
                })
        if (get_product > 0)
            return res.json
                ({
                    success: true,
                    data: get_product
                })
    }
    catch (ex) {
        res.json({
            success: false,
            message: "Server error occur",
        })
    }
})


module.exports = router;
