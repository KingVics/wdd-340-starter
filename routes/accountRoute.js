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

// Route to build the account registration page
router.get("/register", utilities.handleErrors(accController.buildRegister));
router.post("/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount));


// Route to build the account management page
router.get('/', utilities.checkLogin, utilities.handleErrors(accController.buildManage))

// Route to build the account update page
router.get("/update/:account_id", utilities.checkLogin, accController.buildUpdateAccount)

// Route to update the account information
router.post("/update", utilities.checkLogin, regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accController.updateAccount))


// Route to update the account password
router.post("/update-password",
    utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accController.updatePassword))
router.get("/logout", utilities.handleErrors(accController.accountLogout));

module.exports = router