const router = require("express").Router();
const auth = require("../Middleware/auth")
const post = require("../Model/postModel")
const jwt = require("jsonwebtoken");





router.post("/addPost", auth,async (req, res)=> {
    const {access_token} = req.cookies;
    try {
        const {title, description } = req.body;
        const userID = jwt.decode(access_token)
        // console.log("=======",userID)
        if(!title) return res.status(400).json({
            errorMessage:"Title is required"
        })
        const newPost = new post({
            title, description,users:userID.user
        })
        const savedPost = await newPost.save()
        res.json(savedPost).send()

    } catch (error) {
        res.status(500).send();
    }
})

router.get("/getAllPost", auth, async (req, res)=> {
    const {access_token} = req.cookies;
    try {
        const userID = jwt.decode(access_token)
        const allpost = await post.find({users:userID.user}, {title:1,description:1 }).populate()
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
        const allpost = await post.findOne({users:userID.user, _id:id}, {title:1,description:1 }).populate()
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