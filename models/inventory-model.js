const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


/* ***************************
 *  Get an inventory item by inventory_id
 * ************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inv_id = $1`,
      [inventory_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* *****************************
*   Create new Classification
* *************************** */
async function createClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}


/* *****************************
*   Add new vehicle
* *************************** */
async function addNewVehicle({ inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id }) {
  try {
    const sql = `INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [
      inv_make,
      inv_model,
      parseInt(inv_year),
      inv_description,
      inv_image,
      inv_thumbnail,
      parseFloat(inv_price),
      parseInt(inv_miles),
      inv_color,
      parseInt(classification_id)])
  } catch (error) {
    return error.message
  }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}



/* ***************************
 *  Get a small inventory snapshot for discovery views
 * ************************** */
async function getInventorySnapshot(limit = 6) {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name
       FROM public.inventory AS i
       JOIN public.classification AS c
       ON i.classification_id = c.classification_id
       ORDER BY i.inv_year DESC, i.inv_price ASC
       LIMIT $1`,
      [limit]
    )
    return data.rows
  } catch (error) {
    console.error("getInventorySnapshot error " + error)
    return []
  }
}

/* ***************************
 *  Search inventory with optional filters
 * ************************** */
async function searchInventory(filters = {}) {
  try {
    const conditions = []
    const values = []
    const keyword = filters.keyword ? `%${filters.keyword.toLowerCase()}%` : null

    if (keyword) {
      const placeholderStart = values.length + 1
      values.push(keyword, keyword, keyword, keyword)
      conditions.push(
        `(LOWER(i.inv_make) LIKE $${placeholderStart} OR LOWER(i.inv_model) LIKE $${placeholderStart + 1} OR LOWER(i.inv_description) LIKE $${placeholderStart + 2} OR LOWER(c.classification_name) LIKE $${placeholderStart + 3})`
      )
    }

    if (filters.classification) {
      values.push(parseInt(filters.classification))
      conditions.push(`i.classification_id = $${values.length}`)
    }

    if (filters.minPrice) {
      values.push(parseFloat(filters.minPrice))
      conditions.push(`i.inv_price >= $${values.length}`)
    }

    if (filters.maxPrice) {
      values.push(parseFloat(filters.maxPrice))
      conditions.push(`i.inv_price <= $${values.length}`)
    }

    if (filters.minYear) {
      values.push(parseInt(filters.minYear))
      conditions.push(`i.inv_year >= $${values.length}`)
    }

    if (filters.maxMiles) {
      values.push(parseInt(filters.maxMiles))
      conditions.push(`i.inv_miles <= $${values.length}`)
    }

    const sortMap = {
      "price-asc": "i.inv_price ASC",
      "price-desc": "i.inv_price DESC",
      "year-desc": "i.inv_year DESC, i.inv_price ASC",
      "miles-asc": "i.inv_miles ASC, i.inv_price ASC",
    }

    const orderBy = sortMap[filters.sort] || sortMap["price-asc"]

    let sql = `SELECT i.*, c.classification_name
      FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id`

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(" AND ")}`
    }

    sql += ` ORDER BY ${orderBy}`

    const data = await pool.query(sql, values)
    return data.rows
  } catch (error) {
    console.error("searchInventory error " + error)
    return []
  }
}


module.exports = {
  createClassification,
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  getInventorySnapshot,
  searchInventory,
  addNewVehicle,
  updateInventory
}
