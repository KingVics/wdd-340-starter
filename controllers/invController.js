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
    const classificationList = await utilities.buildClassificationList()

    res.render("./inventory/management", {
        title: 'Vehicle Management',
        nav,
        errors: null,
        classificationList

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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


invCont.editInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const inventory_id = parseInt(req.params.inv_id)
    const invData = await invModel.getInventoryByInventoryId(inventory_id)
    const dropdown = await utilities.buildClassificationList(invData[0].classification_id)
    if (invData[0].inv_id) {
        res.render("./inventory/management/editInventory", {
            title: `Edit ${invData[0].inv_make} ${invData[0].inv_model}`,
            nav,
            dropdown,
            errors: null,
            ...invData[0],
            inv_id: invData[0].inv_id,
        })
    }
    else {
        req.flash("notice", "Sorry, the vehicle information could not be found.")
        return res.redirect('/inv')
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const dropdown = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/management/editInventory", {
            title: "Edit " + itemName,
            nav,
            dropdown,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}


/* ***************************
 *  Build inventory search view
 * ************************** */
invCont.buildSearchView = async function (req, res, next) {
    const nav = await utilities.getNav()
    const classificationData = await invModel.getClassifications()
    const filters = {
        keyword: req.query.keyword || "",
        classification: req.query.classification || "",
        minPrice: req.query.minPrice || "",
        maxPrice: req.query.maxPrice || "",
        minYear: req.query.minYear || "",
        maxMiles: req.query.maxMiles || "",
        sort: req.query.sort || "price-asc",
    }
    const searchResults = await invModel.searchInventory(filters)
    const hasActiveFilters = Object.entries(filters).some(([key, value]) => key !== "sort" && value !== "")

    res.render("./inventory/search", {
        title: "Search Inventory",
        nav,
        errors: null,
        classifications: classificationData.rows,
        searchResults,
        resultsCount: searchResults.length,
        hasActiveFilters,
        filters,
    })
}


module.exports = invCont
