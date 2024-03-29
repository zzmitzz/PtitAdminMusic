const Artist = require("../../models/artist.model");
var admin = require("firebase-admin");
const fs = require('fs');
const systemConfig = require("../../config/system");
const { ObjectId } = require('mongodb');
const options = {
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000 * 365 // 1 day
};
const bucket = admin.storage().bucket();
module.exports.index = async (req,res)=>{
    
    const records = await Artist.find();
    // console.log(typeof(records[0].id_albums))
    // for(item in records){
    //     console.log(typeof(item.id_albums))
    //     if(typeof(item.id_albums) == "string"){
    //         records[item].id_albums = [item.id_albums]
    //     }
    // }
    res.render("admin/pages/artist/index",{
        pageTitle: "Artist",
        records: records
    });
}
module.exports.create = async (req,res) => {

    res.render("admin/pages/artist/create",{
        pageTitle: "Add Artist",
    });
}

module.exports.createPost = async(req,res) =>{
    try{
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
        req.body.name_Artist = req.body.title;
        var tmplist = []
        req.body.commonName.forEach(element => {
            if(element != ""){
                tmplist.push(new ObjectId(element))
            }
            
        });
        req.body.id_albums = tmplist;
        console.log(req.body);
        await Artist.create(req.body);
        req.flash("success", "OK");
        res.redirect(`${systemConfig.prefixAdmin}/artist`);
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
    const data = await Artist.findOne(find);
    // c
    res.render("admin/pages/artist/edit",{
        pageTitle: "Edit Artist",
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
    req.body.name_Artist = req.body.title;
    var tmplist = []
    req.body.commonName.forEach(element => {
        if(element != "" && element.length == 24){
            tmplist.push(new ObjectId(element))
        }
        
    });
    
    req.body.id_albums = tmplist;
    try{ 
        await Artist.updateOne({_id: req.params.id}, {
            ...req.body
        });
        req.flash("success", "OK");
        
    }
    catch(error){
        req.flash("error","Not OK");
        res.redirect("back")
    }
    res.redirect(`${systemConfig.prefixAdmin}/artist`);
}

module.exports.deleteItem = async (req, res) =>{
    try{
        await Artist.deleteOne({_id : req.params.id});
        req.flash("success","Delete Successfully");
    }
    catch(error){
        console.log(error);
        req.flash("error","Delete Unsuccessfully");
    }   
    res.redirect("back");
}

