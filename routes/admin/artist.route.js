const express = require("express");
const router = express.Router();
const multer  = require("multer");
var path = require('path')
const controller = require("../../controllers/admin/artist.controller");

const upload = multer();

router.get("/",controller.index);
router.get("/create",controller.create);
router.post("/create",upload.single("thumbnail"),controller.createPost);
router.get("/edit/:id",controller.edit);
router.patch("/edit/:id",upload.single("thumbnail"),controller.editPatch);
router.delete("/delete/:id",controller.deleteItem);
// router.patch("/change-status/:status/:id",controller.changeStatus);
module.exports = router;