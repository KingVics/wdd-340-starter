const utilities = require("../utilities/")
const accountModel = require('../models/account-model')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const e = require("connect-flash")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: null
    })
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("./account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if (process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("./account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        console.error(error)
        throw new Error('Access Forbidden')
    }
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    return res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null
    })

}

async function registerAccount(req, res) {
    let nav = await utilities.getNav()

    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password
    } = req.body


    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(account_password, salt)
    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        return res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        return res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null
        })
    }
}


async function buildManage(req, res, next) {
    let nav = await utilities.getNav()
    const accountData =  res.locals.accountData

    return res.status(501).render("./account", {
        title: "Account Management",
        nav,
        accountData,
        errors: null
    })
}


/* ****************************************
 *   Account update request
 * ************************************ */

async function buildUpdateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = req.params.account_id
    const accountData = await accountModel.getAccountById(account_id)

    return res.status(501).render("./account/update", {
        title: "Update Account",
        nav,
        errors: null,
        account_id: accountData.account_id,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email
    })
}

async function updateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body
    const updateResult = await accountModel.updateAccount(
        account_id,
        account_firstname,
        account_lastname,
        account_email
    )
    if (updateResult && updateResult.rowCount) {
        req.flash("notice", "Account information updated successfully.")
        return res.status(201).render("./account", {
            title: "Account Management",
            nav,
            accountData: res.locals.accountData,
            errors: null
        })
    }
    else {
        req.flash("notice", typeof updateResult === "string" ? updateResult : "Sorry, the update failed.")
        return res.status(501).render("./account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id,
            account_firstname,
            account_lastname,
            account_email
        })
    }
}

async function updatePassword(req, res, next) {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(account_password, salt)
    const updateResult = await accountModel.updatePassword(
        account_id,
        hashedPassword
    )
    if (updateResult && updateResult.rowCount) {
        req.flash("notice", "Password updated successfully.")
        return res.status(201).render("./account", {
            title: "Account Management",
            nav,
            accountData: res.locals.accountData,
            errors: null
        })
    }
    else {
        const accountData = await accountModel.getAccountById(account_id)
        req.flash("notice", "Sorry, the password update failed.")
        return res.status(501).render("./account/update", {
            title: "Update Account",
            nav,
            errors: null,
            account_id,
            account_firstname: accountData.account_firstname,
            account_lastname: accountData.account_lastname,
            account_email: accountData.account_email
        })
    }
}


async function accountLogout(req, res) {
    res.clearCookie("jwt")
    res.locals.loggedin = false
    res.locals.accountData = null
    return res.redirect("/")
}
module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    buildManage,
    accountLogin,
    buildUpdateAccount,
    updateAccount,
    updatePassword,
    accountLogout
}
