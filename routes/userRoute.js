const express = require("express");
const Event = require('../model/events')

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
// userRouter.post('/testSubmit', (req, res)=>{ 
//     const countryName = req.body.Country;
//     Event.fetchByCountryName(countryName).then(res=>{
//         console.log(res)
//     })
// })
userRouter.post('/testSubmit', async (req, res)=>{ 
    const countryName = req.body.Country;
    
    const countryAPIresponse =await  fetch('https://api.first.org/data/v1/countries')
    const responseData = await countryAPIresponse.json();
    const countries = Object.values(responseData.data).map((entry) => entry.country);
    console.log(countries); // Output country names
    

})

module.exports = userRouter;
