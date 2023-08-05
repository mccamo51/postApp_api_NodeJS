const router = require("express").Router()
const User = require("../Model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post("/register", async (req, res)=>{

    try {
        const {phone, password, name} = req.body;
        if(!phone || !password||!name) return res.status(400).json({errorMessage:"Please enter the required field"})
        const checkPhoneExist = await User.findOne({phone:phone})

        //Checking if phone exist
        if(checkPhoneExist) return res.status(400).json({errorMessage:"Phone number already exist"})

        // Hashing password
        
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

        //Save user details
        // console.log("hashed password", hashPassword)
        const newUser = new User({phone:phone, password:hashedPassword, name:name})
        const savedUser = await newUser.save()

        //Sign Token
        const token = jwt.sign(
            {
                user:savedUser.id
            },
            process.env.JWT_SECRET
        )
        res.cookie("access_token", token, {
            httpOnly: true
        }).send();
        // res.json({
        //     "token":token,
        //     "data":{
        //         "phone":savedUser.phone,
        //         "name":savedUser.name
        //     }
        // }).send()

        
            
    } catch (error) {
        console.error(error)

        res.status(500).send();
    }

})

router.post("/login", async (req, res)=>{
    try {
        const {phone, password} = req.body;
        if(!phone || !password) return res.status(400).json({errorMessage:"Please enter the required field"})
        const checkPhoneExist = await User.findOne({phone:phone}) 
        if(!checkPhoneExist) return res.status(400).json({errorMessage:"Phone or password incorrect"})
        const passwordCorrect = await bcrypt.compare(
            password,
            checkPhoneExist.password
          );
        if(passwordCorrect){
            const token = jwt.sign({
                user: checkPhoneExist.id
            }, process.env.JWT_SECRET)

            res.cookie("access_token", token, {
                httpOnly: true,
              });
              res.json({
                status: 200,
                userDetails: {
                  phon: checkPhoneExist.phone,
                },
              });
        }else{

            return  res.status(400).json({errorMessage:"Phone or password incorrect"})
        }


    } catch (error) {
        console.error(error)
        res.status(500).send();
    }
})



//Logout
router.get("/logout", (req, res)=>{
    res.cookie("access_token", "", {
        httpOnly:true,
        expires:new Date(0)
    }).send()
})


module.exports= router;