const express = require("express");
const router = express.Router();
const multer  = require("multer");
const controller = require("../../controllers/admin/category.controller");

const upload = multer();

router.get("/",controller.index);
router.get("/create",controller.create);
router.post("/create",upload.single("thumbnail"),controller.createPost);
router.get("/edit/:id",controller.edit);
router.patch("/edit/:id",upload.single("thumbnail"),controller.editPatch);
router.delete("/delete/:id",controller.deleteItem);
module.exports = router;