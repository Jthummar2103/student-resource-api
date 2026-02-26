const express = require("express");
const router = express.Router();

const db = require("../config/db");
const auth = require("../middleware/authMiddleware");


// GET ALL CATEGORIES

router.get("/", (req, res) => {

  db.query("SELECT * FROM categories", (err, data) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(data);

  });

});


// CREATE CATEGORY

router.post("/", auth, (req, res) => {

  const { name } = req.body;

  db.query(

    "INSERT INTO categories(name) VALUES(?)",

    [name],

    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Category Created"
      });

    }

  );

});


// UPDATE CATEGORY

router.put("/:id", auth, (req, res) => {

  const id = req.params.id;
  const { name } = req.body;

  db.query(

    "UPDATE categories SET name=? WHERE id=?",

    [name, id],

    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json({
        message: "Category Updated"
      });

    }

  );

});


// DELETE CATEGORY

router.delete("/:id", auth, (req, res) => {

  const id = req.params.id;

  db.query(

    "DELETE FROM categories WHERE id=?",

    [id],

    (err) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json({
        message: "Category Deleted"
      });

    }

  );

});

module.exports = router;