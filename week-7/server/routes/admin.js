const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
const jwt = require("jsonwebtoken");
const { adminMiddleware } = require("../middleware/admin");

const { JWT_ADMIN_PASSWORD } = reqire("../config");

    adminRouter.post("/signup", async function(req,res){
        try {
            const requiredBody = z.object ({
                email:z.string().min(3).max(100).email(),
                firstname:z.string().min(3).max(100),
                lastname:z.string().min(3).max(100),
                password:z.string().min(3).max(30)
            })

            const parsedDataWithSuccess = requiredBody.safeParse(req.body);
            if(!parsedDataWithSuccess.success) {
                res.json({
                    message:"Incorrect format",
                    error:parsedDataWithSuccess.error
                })
                return
            }
        const {email,password,firstName,lastName} = req.body; //add zod validation
        //hash and try block
        const hashedPassword = await bcrypt.hash(password,10);
        console.log(hashedPassword);

        await adminModel.create({
            email:email,
            password: password,
            firstName:firstName,
            lastName:lastName
        })

        res.json({
            message:"Signup endpoint"
        })
    } catch(e) {
        res.status(500).strictContentLength({
            message:"Error while signing up"
        })
    }
    })

    adminRouter.post("/signin", async function(req,res){
         const { email,password } = req.body;
        
                //hashing
                const admin = await adminModel.findOne({
                    email:email,
                    password:password
                });
        
                if(admin) {
                    const token = jwt.sign({
                        id:admin._id
                    }, JWT_USER_PASSWORD);
                    //do cookie logic
        
                    res.json({
                        token:token
                    })
                } else {
                    res.status(403).json({
                        message:"Incorrect credentials"
                    })
                }
    })

    adminRouter.post("/course", adminMiddleware,async function(req,res){
        const adminId = req.userId;
        const {title, description, imageeUrl, price} = req.body;

        const course = await courseModel.create ({
            title:title,
            description:description,
            imageUrl:imageUrl,
            price:price,
            creatorId:adminId
        })
        res.json({
            message:"course created",
            courseId: course._id
        })

    })

    adminRouter.put("/course",adminMiddleware,async function(req,res){
        const adminId = req.userId;
        const {title, description, imageeUrl, price} = req.body;

        const course = await courseModel.updateOne ({
            _id: courseId,
            creatorId:adminId
        },{
            title:title,
            description:description,
            imageUrl:imageUrl,
            price:price,
        })
        res.json({
            message:"course updated",
            courseId: course._id
        })

    })

    adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
        const adminId = req.userId;
         const courses = await courseModel.find ({
            creatorId:adminId
        });
        res.json({
            message:"course updated",
            courses
        })

    })

    module.exports = {
        adminRouter:adminRouter
    }