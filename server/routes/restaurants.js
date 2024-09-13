const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all restaurants
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, COALESCE(AVG(re.rating), 0) AS averagerating
       FROM restaurants r
       LEFT JOIN reviews re ON r.id = re.restaurant_id
       GROUP BY r.id
       ORDER BY r.id`
    );

    console.log(rows);
    res.status(200).json({
      success: true,
      results: rows.length,
      restaurants: rows,
    });
  } catch (error) {
    console.error("Error fetching restaurants with average ratings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a single restaurant by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const { rows } = await db.query("SELECT * FROM restaurants WHERE id = $1", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE restaurant_id = $1",
      [id]
    );

    const averageRating = await db.query(
      "SELECT TRUNC(AVG(rating),1) as averageRating from reviews where restaurant_id = $1",
      [id]
    );

    res.status(200).json({
      success: true,
      restaurant: rows[0],
      reviews: reviews.rows,
      averageRating: averageRating.rows[0],
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new restaurant
router.post("/", async (req, res) => {
  try {
    const { name, location, priceRange } = req.body;

    if (!name || !location || !priceRange) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.query(
      "INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3)",
      [name, location, priceRange]
    );

    res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
    });
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a restaurant by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, priceRange } = req.body;

    if (!name || !location || !priceRange) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.query(
      "UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4",
      [name, location, priceRange, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a restaurant by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

       await db.query("DELETE FROM reviews WHERE restaurant_id = $1", [id]);

    const result = await db.query("DELETE FROM restaurants WHERE id = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

router.post("/:id/addReview", async (req, res) => {
  try {
    const { id } = req.params;

    const { review, name, rating } = req.body;
    console.log(id, req.body);

    const response = await db.query(
      "INSERT INTO reviews(restaurant_id , name , review , rating) VALUES ($1, $2 , $3,$4)",
      [id, name, review, rating]
    );

    res.status(201).json({
      success: true,
      message: "Review posted successfully",
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


