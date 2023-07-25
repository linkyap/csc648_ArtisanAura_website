const express = require("express");
const pool = require("../conf/database");

const router = express.Router();

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the email is already subscribed
    const [existingSubscribers] = await pool.query(
      "SELECT * FROM newsletter WHERE email = ?",
      [email]
    );

    if (existingSubscribers.length > 0) {
      // Respond with error message
      return res.status(400).json({ error: "Already subscribed." });
    }

    // Insert the new subscriber into the database
    await pool.query("INSERT INTO newsletter (email) VALUES (?)", [email]);

    // Respond with success message
    return res.status(200).json({ message: "Subscribed successfully." });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "An error occurred while subscribing." });
  }
});

module.exports = router;
