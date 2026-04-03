const utilities = require(".")
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator")
const validate = {}

async function buildUpdateViewData(account_id, account_firstname, account_lastname, account_email) {
    const accountData = account_id ? await accountModel.getAccountById(account_id) : null

    return {
        account_id,
        account_firstname: account_firstname ?? accountData?.account_firstname ?? "",
        account_lastname: account_lastname ?? accountData?.account_lastname ?? "",
        account_email: account_email ?? accountData?.account_email ?? "",
    }
}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() // refer to validator.js docs
            .withMessage("A valid email is required."),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}


/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
        // email is required and must be a valid email
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required."),

        // password is required
        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Password is required."),
    ]
}

/* ******************************
 * Check login data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}


/*  **********************************
  *  Update Account Data Validation Rules
  * ********************************* */
validate.updateRules = () => {
    return [
        // account_id is required and must be a number
        body("account_id")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please provide a valid account ID."),

        // firstname is required and must be string
        body("account_firstname")

            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), 

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), 
        // valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail() 
            .withMessage("A valid email is required.")
            .custom(async (value, { req }) => {
                const currentAccount = await accountModel.getAccountById(req.body.account_id)
                if (!currentAccount) {
                    throw new Error("Invalid account.")
                }

                if (value === currentAccount.account_email) {
                    return true
                }

                const existingAccount = await accountModel.getAccountByEmail(value)
                if (existingAccount && String(existingAccount.account_id) !== String(req.body.account_id)) {
                    throw new Error("That email address already exists. Please use a different email.")
                }

                return true
            }),
    ]
}

/* ******************************
 * Check update data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const viewData = await buildUpdateViewData(account_id, account_firstname, account_lastname, account_email)
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            ...viewData,
        })
        return
    }
    next()
}


/*  **********************************
  *  Update Password Validation Rules
  * ********************************* */
validate.passwordRules = () => {
    return [
        // account_id is required and must be a number
        body("account_id")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isNumeric()
            .withMessage("Please provide a valid account ID."),
        // password is required and must be strong password
        body("account_password")

            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password must be at least 12 characters and include uppercase, lowercase, number, and special character."),
    ]
}

/* ******************************
 * Check password data and return errors or continue to update password
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
    const { account_id, account_password } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const viewData = await buildUpdateViewData(account_id)
        res.render("account/update", {
            errors,
            title: "Update Account",
            nav,
            ...viewData,
        })
        return
    }
    next()
}
module.exports = validate
