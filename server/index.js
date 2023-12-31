import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import  path  from "path";
import { fileURLToPath } from "url";
import { registre } from "./controllers/auth.js"
import { createPost } from "./controllers/posts.js"
import authRoute from "./routes/auth.js"
import userRoute from "./routes/user.js"
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users , posts } from "./data/index.js";

// configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb" , extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb" , extended: true}));
app.use(cors());
app.use("/assets" , express.static(path.join(__dirname , 'public/assets')));

// file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "public/assets");
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

//routes with files
app.post("/auth/registre" , upload.single("picture"), registre);
app.post("/post", verifyToken, upload.single("picture"), createPost);

//router
app.use("/auth", authRoute);
app.use("/users", userRoute);

//mongoose_setup
const PORT = process.env.PORT || 6001; 
mongoose.connect(process.env.MONGOO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT, ()=> console.log(`Server Port: ${PORT}`));

// this is the fake data and add one time
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error)=> console.log(`${error} did not connect`))


