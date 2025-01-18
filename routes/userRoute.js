const express = require("express");

const { homePage, getOurSponsersPage, getFAQPage } = require("../controller/userController");
const { registerPage } = require("../controller/userController");
const { eventDetails } = require("../controller/userController");
const { registerUser } = require("../controller/userController");
const { communityGuidelines } = require('../controller/userController')

const userRouter = express.Router();

userRouter.get("/", homePage);
userRouter.get("/home", homePage);
userRouter.get("/register", registerPage);
userRouter.post("/event-details/:id", eventDetails);    
userRouter.post("/registering", registerUser);
userRouter.get('/community-guidelines', communityGuidelines)
userRouter.get('/our-sponsers', getOurSponsersPage)
userRouter.get('/FAQs',getFAQPage)

module.exports = userRouter;
