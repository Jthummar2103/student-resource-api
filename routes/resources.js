const express = require("express");
const router = express.Router();

const db = require("../config/db");
const auth = require("../middleware/authMiddleware");
router.get("/", (req, res) => {

  const sql = `
    SELECT resources.*, 
           users.name AS user_name, 
           categories.name AS category_name
    FROM resources
    JOIN users ON resources.user_id = users.id
    JOIN categories ON resources.category_id = categories.id
  `;

  db.query(sql, (err, data) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(data);

  });

});

router.post("/", auth, (req, res) => {

  const { title, description, link, category_id } = req.body;
  const user_id = req.user.id;

  const sql = `
    INSERT INTO resources
    (title, description, link, user_id, category_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, link, user_id, category_id], (err) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Resource Created"
    });

  });

});

router.put("/:id", auth, (req, res) => {

  const resourceId = req.params.id;
  const userId = req.user.id;
  const { title, description, link, category_id } = req.body;

  const checkSql = `
    SELECT * FROM resources 
    WHERE id = ? AND user_id = ?
  `;

  db.query(checkSql, [resourceId, userId], (err, data) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (!data.length) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    const updateSql = `
      UPDATE resources
      SET title = ?, description = ?, link = ?, category_id = ?
      WHERE id = ?
    `;

    db.query(
      updateSql,
      [title, description, link, category_id, resourceId],
      (err) => {

        if (err) {
          return res.status(500).json(err);
        }

        res.status(200).json({
          message: "Resource Updated"
        });

      }
    );

  });

});

router.delete("/:id", auth, (req, res) => {

  const resourceId = req.params.id;
  const userId = req.user.id;

  const sql = `
    DELETE FROM resources 
    WHERE id = ? AND user_id = ?
  `;

  db.query(sql, [resourceId, userId], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Not authorized"
      });
    }

    res.status(200).json({
      message: "Resource Deleted"
    });

  });

});


module.exports = router;