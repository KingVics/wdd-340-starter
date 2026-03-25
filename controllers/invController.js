const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}


/* ***************************
 *  Build inventory by classification detials view
 * ************************** */
invCont.buildByClassificationDetailsById = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    const grid = await utilities.buildIventoryDetails(data)
    let nav = await utilities.getNav()
    const className = data[0].inv_year + ' ' + data[0].inv_make + ' ' + data[0].inv_model
    res.render("./inventory/details", {
        title: className,
        nav,
        grid,
    })
}


/* ***************************
 *  Build inventory by classification detials view
 * ************************** */
invCont.buildClassificationManagement = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
        title: 'Vehicle Management',
        nav,
        errors: null

    })
}


/* ***************************
 *  Build inventory by classification  view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/management/addClassification", {
        title: 'Add Classification',
        nav,
        errors: null
    })
}

invCont.buildAddClassificationPost = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { classification_name } = req.body
    const result = await invModel.createClassification(classification_name)
    if (result) {
        req.flash(
            "notice",
            `The ${classification_name} classification has been added successfully.`
        )
        return res.redirect('/inv')
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        return res.status(501).render("./inventory/management/addClassification", {
            title: "Add Classification",
            nav,
            classification_name
        })
    }



}


/* ***************************
 *  Build inventory by classification  view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
    let nav = await utilities.getNav()

    const dropdown = await utilities.buildClassificationList()
    res.render("./inventory/management/addInventory", {
        title: 'Add New Vehice',
        nav,
        dropdown,
        errors: null,
        // classification_id: "",
        // inv_make: "",
        // inv_model: "",
        // inv_description: "",
        // inv_image: "/images/vehicles/no-image.png",
        // inv_thumbnail: "/images/vehicles/no-image.png",
        // inv_price: "",
        // inv_year: "",
        // inv_miles: "",
        // inv_color: ""

    })
}

invCont.buildAddInventoryPost = async function (req, res, next) {
    let nav = await utilities.getNav()
    const dropdown = await utilities.buildClassificationList(req.body.classification_id)

    const result = await invModel.addNewVehicle(req.body)
    if (result) {
        req.flash(
            "notice",
            `The ${req.body.inv_make} ${req.body.inv_model} was added successfully.`
        )
        return res.redirect('/inv')
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        return res.status(501).render("./inventory/management/addInventory", {
            title: "Add New Vehicle",
            nav,
            dropdown,
            ...req.body
        })
    }



}

module.exports = invCont
