import { use } from "react";
import { userMiddleware } from "../middleware/user";

const { Router } = require("express");
const { userModel, purchaseModel, courseModel} = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_USER_PASSWORD } = reqire("../config");

const userRouter = Router();

    userRouter.post("/signup", async function(req,res){
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

        await userModel.create({
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
    });

    userRouter.post("/signin", async function(req,res){
        const { email,password } = req.body;

        //hashing
        const user = await userModel.findOne({
            email:email,
            password:password
        });

        if(user) {
            const token = jwt.sign({
                id:user._id
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

    userRouter.get("/purchases",userMiddleware,async function(req,res){
        const userId = req.userId;

        const purchases = await purchaseModel.find({
            userId
        });

        let purchasedCourseIds = [];

        for(let i = 0; i < purchases.length; i++) {
            purchasedCourseIds.push(purchases[i].courseId)
        }

        const coursesData = await courseModel.find({
            _id: {$in: purchases.map(x => x.courseId)}
        })

        res.json({
            purchases,
            coursesData
        })
    })


module.export = { userRouter: userRouter }