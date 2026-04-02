// Needed Resources 
const express = require("express")
const router = new express.Router()
const accController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build the account login page
router.get("/login", utilities.handleErrors(accController.buildLogin));
router.post("/login", regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accController.accountLogin));


router.get("/register", utilities.handleErrors(accController.buildRegister));
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount));


router.get('/', utilities.checkLogin, utilities.handleErrors(accController.buildManage))



module.exports = router