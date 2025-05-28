const { Router } = require("express");
const { userMiddleware } = require("../middleware/user");
const { purchaseModel, courseModel } = require("../db")
const { purchaseModel } = require("../db");

const courseRouter = Router();


    courseRouter.post("/purchase",userMiddleware,async function(req,res){
        const userId = req.userId;
        const courseId = req.body.courseId;

        //check if user paid the price
        await purchaseModel.create({
            userId,
            courseId
        })
    res.json({
        message:"Ypu have successfully bought the course"
    })
})

courseRouter.post("/preview",async function(req,res){
    const courses = await courseModel.find({});
    res.json({
        courses
    })
})

module.export = {
    courseRouter : courseRouter
}


