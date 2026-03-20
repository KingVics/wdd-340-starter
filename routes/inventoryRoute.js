// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/inv/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view details
router.get("/inv/detail/:inventoryId", utilities.handleErrors(invController.buildByClassificationDetailsById));

module.exports = router