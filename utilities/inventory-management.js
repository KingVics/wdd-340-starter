const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


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


module.exports = validate