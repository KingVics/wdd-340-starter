const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, query, validationResult } = require("express-validator")
const validate = {}

function formatSearchKeyword(keyword = "") {
    if (keyword.length <= 24) {
        return keyword
    }

    return `${keyword.slice(0, 24)}...`
}


/*  **********************************
  *  Validate Add Cassification
  * ********************************* */
validate.addClassificationRule = () => {
    return [
        // classification_name is required and must be string
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Name must be alphanumeric characters only")

            .isLength({ min: 3 })
            .withMessage("Name must be alphanumeric characters only")

            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Name must be alphanumeric characters only")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/management/addClassification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }

    next()
}




/*  **********************************
  *  Validate Add New Vehicle
  * ********************************* */
validate.addNewVehicleRule = () => {
    return [
        body("classification_id")
            .trim()
            .notEmpty().withMessage("Classification is required")
            .isInt({ min: 1 }).withMessage("Classification must be a valid number"),

        body("inv_make")
            .trim()
            .notEmpty().withMessage("Make is required")
            .isLength({ min: 2 }).withMessage("Make must be at least 2 characters"),

        body("inv_model")
            .trim()
            .notEmpty().withMessage("Model is required")
            .isLength({ min: 2 }).withMessage("Model must be at least 2 characters"),

        body("inv_price")
            .trim()
            .notEmpty().withMessage("Price is required")
            .isFloat({ min: 0 }).withMessage("Price must be a valid number"),

        body("inv_color")
            .trim()
            .notEmpty().withMessage("Color is required")
            .isLength({ min: 3 }).withMessage("Color must be at least 3 characters"),

        body("inv_description")
            .trim()
            .notEmpty().withMessage("Description is required")
            .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

        body("inv_image")
            .trim()
            .notEmpty().withMessage("Image path is required"),

        body("inv_thumbnail")
            .trim()
            .notEmpty().withMessage("Thumbnail path is required"),

        body("inv_miles")
            .trim()
            .notEmpty().withMessage("Miles is required")
            .isInt({ min: 0 }).withMessage("Miles must be a valid number"),

        body("inv_year")
            .trim()
            .notEmpty().withMessage("Year is required")
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage("Enter a valid 4-digit year")
    ];
};

validate.checkAddNewVehicleData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const dropdown = await utilities.buildClassificationList(req.body.classification_id)
        res.render("./inventory/management/addInventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            dropdown,
            ...req.body
        })
        return
    }

    next()
}



/*  **********************************
  *  Validate Update Vehicle
  * ********************************* */
validate.updateVehicleRule = () => {
    return [
        body("classification_id")
            .trim()
            .notEmpty().withMessage("Classification is required")
            .isInt({ min: 1 }).withMessage("Classification must be a valid number"),


        body("inv_id")
            .trim()
            .notEmpty().withMessage("Inv Id is required")
            .isInt({ min: 1 }).withMessage("Inv Id must be a valid number"),


        body("inv_make")
            .trim()
            .notEmpty().withMessage("Make is required")
            .isLength({ min: 2 }).withMessage("Make must be at least 2 characters"),

        body("inv_model")
            .trim()
            .notEmpty().withMessage("Model is required")
            .isLength({ min: 2 }).withMessage("Model must be at least 2 characters"),

        body("inv_price")
            .trim()
            .notEmpty().withMessage("Price is required")
            .isFloat({ min: 0 }).withMessage("Price must be a valid number"),

        body("inv_color")
            .trim()
            .notEmpty().withMessage("Color is required")
            .isLength({ min: 3 }).withMessage("Color must be at least 3 characters"),

        body("inv_description")
            .trim()
            .notEmpty().withMessage("Description is required")
            .isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),

        body("inv_image")
            .trim()
            .notEmpty().withMessage("Image path is required"),

        body("inv_thumbnail")
            .trim()
            .notEmpty().withMessage("Thumbnail path is required"),

        body("inv_miles")
            .trim()
            .notEmpty().withMessage("Miles is required")
            .isInt({ min: 0 }).withMessage("Miles must be a valid number"),

        body("inv_year")
            .trim()
            .notEmpty().withMessage("Year is required")
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage("Enter a valid 4-digit year")
    ];
};

validate.checkUpdateData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const dropdown = await utilities.buildClassificationList(req.body.classification_id)
        res.render("./inventory/management/editInventory", {
            errors,
            title: "Update Vehicle",
            nav,
            dropdown,
            ...req.body
        })
        return
    }

    next()
}

/*  **********************************
  *  Validate Search Filters
  * ********************************* */
validate.searchRules = () => {
    const currentYear = new Date().getFullYear() + 1

    return [
        query("keyword")
            .optional({ checkFalsy: true })
            .trim()
            .isLength({ max: 40 })
            .withMessage("Keyword must be 40 characters or fewer."),

        query("classification")
            .optional({ checkFalsy: true })
            .trim()
            .isInt({ min: 1 })
            .withMessage("Classification must be a valid number."),

        query("minPrice")
            .optional({ checkFalsy: true })
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Minimum price must be 0 or greater."),

        query("maxPrice")
            .optional({ checkFalsy: true })
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Maximum price must be 0 or greater.")
            .custom((value, { req }) => {
                if (!req.query.minPrice || value === "") {
                    return true
                }
                if (parseFloat(value) < parseFloat(req.query.minPrice)) {
                    throw new Error("Maximum price must be greater than or equal to minimum price.")
                }
                return true
            }),

        query("minYear")
            .optional({ checkFalsy: true })
            .trim()
            .isInt({ min: 1900, max: currentYear })
            .withMessage(`Minimum year must be between 1900 and ${currentYear}.`),

        query("maxMiles")
            .optional({ checkFalsy: true })
            .trim()
            .isInt({ min: 0 })
            .withMessage("Maximum miles must be 0 or greater."),

        query("sort")
            .optional({ checkFalsy: true })
            .trim()
            .isIn(["price-asc", "price-desc", "year-desc", "miles-asc"])
            .withMessage("Please choose a valid sort option."),
    ]
}

validate.checkSearchData = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        const nav = await utilities.getNav()
        const classificationData = await invModel.getClassifications()

        return res.render("./inventory/search", {
            title: "Search Inventory",
            nav,
            errors,
            classifications: classificationData.rows,
            searchResults: [],
            resultsCount: 0,
            hasActiveFilters: Object.entries(req.query).some(([key, value]) => key !== "sort" && value !== ""),
            displayKeyword: formatSearchKeyword(req.query.keyword || ""),
            filters: {
                keyword: req.query.keyword || "",
                classification: req.query.classification || "",
                minPrice: req.query.minPrice || "",
                maxPrice: req.query.maxPrice || "",
                minYear: req.query.minYear || "",
                maxMiles: req.query.maxMiles || "",
                sort: req.query.sort || "price-asc",
            },
        })
    }

    next()
}


module.exports = validate
