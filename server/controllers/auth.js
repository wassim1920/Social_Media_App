import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import User from "../models/User.js"

export const registre = async (req, res)=>{
    try{
        //to hide the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
    
        const newUser = new User({
            ...req.body,
            password: hash,
            viewedProfile : Math.floor(Math.random() * 10000),
            impressions :  Math.floor(Math.random() * 10000),
        })
        await newUser.save()
        res.status(201).send("user has been created");
    }catch(err){
        res.status(500).json({ message: err.message});
    }
}

export const login = async (req, res)=>{
    try{
        const {email , password}= req.body;
        const user = await User.findOne({email : email});
        if(!user) return res.status(400).json({msg:"User does not exist"});
        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch) return res.status(400).json({msg: "wrong password"});
        const token = jwt.sign({id : user._id}, process.env.TOKEN_SECRET);

        // res.cookie("access_token", token, {httpOnly: true}).status(200).json({user});

        res.status(200).json({token , user});
    }catch(err){
        res.status(501).json({ message: err.message})
    }
}