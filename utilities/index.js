const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}



/* **************************************
* Build the Inventory Details view HTML
* ************************************ */
Util.buildIventoryDetails = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<div id="inv-details">'
        data.forEach(vehicle => {
            grid += '<div class="details-img">'
                + '<img src="' + vehicle.inv_image
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" />'
            grid += '</div>'
            grid += '<div class="info">'
            grid += '<h3>'
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details'
            grid += '</h3>'
            grid += '<div class="price">'
            grid += '<p>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
            grid += '</div>'
            grid += '<div class="description">'
            grid += '<p>'
                + vehicle.inv_description + '</p>'
            grid += '</div>'
            grid += '<div class="color">'
            grid += '<p>'
                + vehicle.inv_color + '</p>'
            grid += '</div>'
            grid += '<div class="miles">'
            grid += '<p>'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
            grid += '</div>'
        })
        grid += '</div>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}


/* **************************************
* Build the Add New Vehicle Dropdown HTML
* ************************************ */
Util.buildClassificationList = async function (selectedId = "") {
    const data = await invModel.getClassifications();

    let html = `<select name="classification_id" id="classification_id" required>`;
    html += `<option value="">Choose a Classification</option>`;

    data.rows.forEach(row => {
        const selected = String(row.classification_id) === String(selectedId)
            ? "selected"
            : "";

        html += `<option value="${row.classification_id}" ${selected}>
                    ${row.classification_name}
                 </option>`;
    });

    html += `</select>`;
    return html;
};


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => async (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util