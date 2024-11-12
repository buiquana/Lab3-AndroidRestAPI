var express = require('express');
var router = express.Router();

const Distributors = require('../models/distributors');
const Fruits = require('../models/fruits');

router.post('/add-distributors', async (req, res) => {
    try {
        const data = req.body;
        
        if (!data.name) {
            return res.status(400).json({
                "status": 400,
                "message": "Thiếu tên nhà phân phối",
                "data": []
            });
        }

        const newDistributor = new Distributors({
            name: data.name
        });

        const result = await newDistributor.save();

        return res.status(201).json({
            "status": 201,
            "message": "Thêm thành công",
            "data": result
        });
    } catch (error) {
        console.log('Error in /add-distributors:', error);
        return res.status(500).json({
            "status": 500,
            "message": "Có lỗi xảy ra trong quá trình xử lý",
            "data": []
        });
    }
});

router.post('/add-fruits', async (req, res) => {
    try {
        const data = req.body;

        // Kiểm tra các trường bắt buộc của `Fruits`
        if (!data.name || !data.quantity || !data.price || !data.id_distributors) {
            return res.status(400).json({
                "status": 400,
                "message": "Thiếu thông tin cần thiết về trái cây",
                "data": []
            });
        }

        const newFruit = new Fruits({
            name: data.name,
            quantity: data.quantity,
            price: data.price,
            status: data.status,
            image: data.image,
            description: data.description,
            id_distributors: data.id_distributors
        });

        const result = await newFruit.save();
        
        return res.status(201).json({
            "status": 201,
            "message": "Thêm thành công",
            "data": result
        });
    } catch (error) {
        console.log('Error in /add-fruits:', error);
        return res.status(500).json({
            "status": 500,
            "message": "Có lỗi xảy ra trong quá trình xử lý",
            "data": []
        });
    }
});

router.get('/get-list-fruit', async (req, res) => {
    try {
        const fruits = await Fruits.find();
        console.log(fruits);  

        if (!fruits || fruits.length === 0) {
            return res.status(404).json({
                "status": 404,
                "message": "Không tìm thấy quả",
                "data": []
            });
        }

        res.status(200).json({
            "status": 200,
            "message": "Danh sách Fruit",
            "data": fruits
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            "status": 500,
            "message": "Có lỗi xảy ra trong quá trình xử lý",
            "data": []
        });
    }
});

router.get('/get-detail-fruit/:id', async (req, res) => {
    try {
        const fruitId = req.params.id; // Lấy id từ URL
        const fruit = await Fruits.findById(fruitId);

        if (!fruit) {
            return res.status(404).json({
                "status": 404,
                "message": "Không tìm thấy quả",
                "data": []
            });
        }

        return res.status(200).json({
            "status": 200,
            "message": "Danh sách Fruit",
            "data": fruit
        });
    } catch (error) {
        console.error('Error in /get-detail-fruit/:id:', error);
        return res.status(500).json({
            "status": 500,
            "message": "Có lỗi xảy ra trong quá trình xử lý",
            "data": []
        });
    }
});

router.get('/get-list-fruits', async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const filter = {};
        if (minPrice) filter.price = { $gte: Number(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

        const fruits = await Fruits.find(filter)
            .select('name quantity price id_distributors') 
            .sort({ quantity: -1 }); 

        return res.status(200).json({
            "status": 200,
            "message": "Danh sách Fruit",
            "data": fruits
        });
    } catch (error) {
        console.error('Error in /get-list-fruits:', error);
        return res.status(500).json({
            "status": 500,
            "message": "Có lỗi xảy ra trong quá trình xử lý",
            "data": []
        });
    }
});

// Cập nhật Fruit bằng ID
router.put('/update-fruit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const updatedFruit = await Fruits.findByIdAndUpdate(id, data, {
            new: true, 
            runValidators: true
        });

        if (!updatedFruit) {
            return res.status(404).json({
                "status": 404,
                "message": "Không tìm thấy quả",
                "data": []
            });
        }

        return res.status(200).json({
            "status": 200,
            "message": "Cập nhật thành công",
            "data": updatedFruit
        });
    } catch (error) {
        console.error('Error in /update-fruit:', error);
        return res.status(500).json({
            "status": 500,
            "message": "Có lỗi xảy ra trong quá trình xử lý",
            "data": []
        });
    }
});


module.exports = router;
