const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: "Custom Title 2", message: "my message here"});
});

module.exports = router;