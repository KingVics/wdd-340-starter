// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validator = require('../utilities/inventory-management')

// Route to build inventory by classification view
router.get("/inv/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view details
router.get("/inv/detail/:inventoryId", utilities.handleErrors(invController.buildByClassificationDetailsById));

// Route to build inventory classification management view 
router.get("/inv", utilities.handleErrors(invController.buildClassificationManagement));


// Route to build add classification view 
router.get("/inv/addClassification", utilities.handleErrors(invController.buildAddClassification));
router.post("/inv/addClassification",
    validator.addClassificationRule(),
    validator.checkClassificationData,
    utilities.handleErrors(invController.buildAddClassificationPost));



// Route to build add inventory view 
router.get("/inv/addInventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/inv/addInventory",
    validator.addNewVehicleRule(),
    validator.checkAddNewVehicleData,
    utilities.handleErrors(invController.buildAddInventoryPost));

module.exports = router