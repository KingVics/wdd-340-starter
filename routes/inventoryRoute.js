// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const validator = require('../utilities/inventory-management')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view details
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByClassificationDetailsById));

// Route to build the search and filter view
router.get("/search", utilities.handleErrors(invController.buildSearchView));

// Route to build inventory classification management view 
router.get("/",
    utilities.checkRole,
    utilities.handleErrors(invController.buildClassificationManagement));


// Route to build add classification view 
router.get("/addClassification", utilities.handleErrors(invController.buildAddClassification));
router.post("/addClassification",
    utilities.checkRole,
    validator.addClassificationRule(),
    validator.checkClassificationData,
    utilities.handleErrors(invController.buildAddClassificationPost));



// Route to build add inventory view 
router.get("/addInventory", utilities.handleErrors(invController.buildAddInventory));
router.post("/addInventory",
    utilities.checkRole,
    validator.addNewVehicleRule(),
    validator.checkAddNewVehicleData,
    utilities.handleErrors(invController.buildAddInventoryPost));



router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventory));
router.post("/update",
    utilities.checkRole,
    validator.updateVehicleRule(),
    validator.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

module.exports = router
