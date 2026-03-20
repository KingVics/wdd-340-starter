const utilities = require("../utilities/")


/* ***************************
 *  Build inventory by classification view
 * ************************** */
const errorBuilder = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./errors/error", {
        title: "Internal server error",
        nav,
    })
}



module.exports = errorBuilder
