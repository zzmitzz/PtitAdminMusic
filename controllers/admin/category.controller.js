const Category = require("../../models/category.model");
var admin = require("firebase-admin");
const fs = require('fs');
const systemConfig = require("../../config/system");
const options = {
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000 * 365 // 1 day
};
const bucket = admin.storage().bucket();
module.exports.index = async (req,res)=>{
    
    const records = await Category.find();
    res.render("admin/pages/category/index",{
        pageTitle: "Category",
        records: records
    });
}
module.exports.create = async (req,res) => {

    res.render("admin/pages/category/create",{
        pageTitle: "Add Category",
    });
}

module.exports.createPost = async(req,res) =>{
    try{
        const imageFile = req.file
        var fileName = `${Date.now()}_${imageFile.originalname}`;
        const imageFilePath = `images/${fileName}`;
        let filePath = `uploads/${fileName}`
        fs.writeFile(filePath, imageFile.buffer, 'binary', (err) => {
            if (err) {
                console.error('Error saving image:', err);
            } else {
                console.log('Image saved successfully!');
            }
        });
        await bucket.upload(filePath, { destination: imageFilePath });
        let signedUrl = await bucket.file(imageFilePath).getSignedUrl(options);
        image_url = signedUrl[0]; 
        req.body.image = image_url;
        req.body.Category = req.body.title;
        var tmplist = []
        req.body.commonName.forEach(element => {
            if(element != ""){
                tmplist.push(new Object(element))
            }
            
        });
        req.body.tracks = tmplist;
        await Category.create(req.body);
        req.flash("success", "OK");
        res.redirect(`${systemConfig.prefixAdmin}/category`);
    }
    catch(error){
        req.flash("error","Not OK");
        res.redirect("back");
    }
}

module.exports.edit = async (req,res) => {

    
    let find = {
        _id: req.params.id
    };
    const data = await Category.findOne(find);
    // c
    res.render("admin/pages/category/edit",{
        pageTitle: "Edit Category",
        data: data
    });
}

module.exports.editPatch = async (req,res) => {
    if(req.file != null){
        const imageFile = req.file
        console.log(imageFile)
        var fileName = `${Date.now()}_${imageFile.originalname}`;
        const imageFilePath = `images/${fileName}`;
        let filePath = `uploads/${fileName}`
        fs.writeFile(filePath, imageFile.buffer, 'binary', (err) => {
            if (err) {
                console.error('Error saving image:', err);
            } else {
                console.log('Image saved successfully!');
            }
        });
        await bucket.upload(filePath, { destination: imageFilePath });
        let signedUrl = await bucket.file(imageFilePath).getSignedUrl(options);
        image_url = signedUrl[0]; 
        req.body.image = image_url;
    }
    req.body.Category = req.body.title;
    var tmplist = []
    req.body.commonName.forEach(element => {
        if(element != "" && element.length == 24){
            tmplist.push(new Object(element))
        }
        
    });
    req.body.tracks = tmplist;
    try{ 
        await Category.updateOne({_id: req.params.id}, {
            ...req.body
        });
        req.flash("success", "OK");
        
    }
    catch(error){
        req.flash("error","Not OK");
        res.redirect("back")
    }
    res.redirect(`${systemConfig.prefixAdmin}/category`);
}

module.exports.deleteItem = async (req, res) =>{
    try{
        await Category.deleteOne({_id : req.params.id});
        req.flash("success","Delete Successfully");
    }
    catch(error){
        console.log(error);
        req.flash("error","Delete Unsuccessfully");
    }   
    res.redirect("back");
}

