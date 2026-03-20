const express = require("express")
const router = new express.Router()
const errorBuilder = require("../controllers/errorController")


// Route to build to test error
router.get("/error-test", errorBuilder);

module.exports = router