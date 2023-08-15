const router = require("express").Router();
const auth = require("../Middleware/auth")
const post = require("../Model/postModel")
const jwt = require("jsonwebtoken");
const multer = require("multer")


const storage = multer.diskStorage({
    destination:(req, res, cb)=>{
        cb(null ,'uploads/')
    },
    filename:(req, file, cb)=>{
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage:storage
})


router.post("/imageUpload",auth, upload.single("image"), async (req, res)=>{
    const file = (req.file)
    const {title, description } = req.body;
    const {access_token} = req.cookies;
    try {
        const userID = jwt.decode(access_token)
        if(!title) return res.status(400).json({
            errorMessage:"Title is required"
        })
        if(!file) return res.status(400).json({
            errorMessage:"Image is required"
        })
        const newPost = new post({
            title, description,
            imageUrl:file.path,
            users:userID.user,
        })
        const savedPost = await newPost.save()
        res.json(savedPost).send()
        
    } catch (error) {
        res.status(500).send(error);
    }

})

router.post("/addPost", auth,async (req, res)=> {
    const {access_token} = req.cookies;
    try {
        const {title, description } = req.body;
        const userID = jwt.decode(access_token)
        console.log("=======",userID)
        if(!title) return res.status(400).json({
            errorMessage:"Title is required"
        })
        const newPost = new post({
            title, description,users:userID.user
        })
        const savedPost = await newPost.save()
        res.json(savedPost).send()

    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/getAllPost", auth, async (req, res)=> {
    const {access_token} = req.cookies;
    try {
        const userID = jwt.decode(access_token)
        const allpost = await post.find({users:userID.user}, {title:1,description:1 , imageUrl:1}).populate()
        res.json(allpost)
    } catch (error) {
        res.status(500).send();
    }
})

router.get("/getSpecificPost", auth, async (req, res)=> {
    const {access_token} = req.cookies;
    const {id} = req.query;
    try {
        const userID = jwt.decode(access_token)
        const allpost = await post.findOne({users:userID.user, _id:id}, {title:1,description:1, imageUrl:1 }).populate()
        res.json({status:true,data:allpost})
    } catch (error) {
        res.status(500).send();
    }
})


router.delete("/deletePost/:id", auth, async (req, res)=> {

    const postID = (req.params.id)
    const {access_token} = req.cookies;
   try {
    const userID = jwt.decode(access_token)
    if(!postID) return res.status(400).json({errorMessage:"No post selected to be deleted"})

    const response = await post.findOneAndDelete({_id:postID,users:userID.user })
    console.log("dataata",userID.user + "  /  " + "data" + postID)
    
    if(response === null){
        return res.status(400).json({status:false,errorMessage:"Post with this ID does not exist"})
    }else{
        return res.json({status:true,errorMessage:"Post deleted successfully"})

    }
    res.json({status:true,data:response})


   } catch (error) {
    res.status(500).send();
   }


})




module.exports = router;