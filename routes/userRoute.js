const express = require("express");
const Event = require('../model/events')

const { homePage, getOurSponsersPage, getFAQPage, getFavouritesPage } = require("../controller/userController");
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
userRouter.post('/home', homePage)
userRouter.get('/events-by-categories', (req, res)=> res.render('eventsByCategory', {pageTitle: "Fuck"}))

module.exports = userRouter;
