const express = require("express");
const {loginPage, addToFavourite, getFavouritesPage, deleteFavourite} = require("../controller/hostController");
const {loginUser} = require("../controller/hostController");
const {createEventPage} = require('../controller/hostController')
const {toLogOut} = require('../controller/hostController')
const {createEvent} =  require('../controller/eventsController')

const hostRouter = express.Router();


hostRouter.get('/login', loginPage)
hostRouter.post('/logining', loginUser)
hostRouter.get('/createEvent/:id', createEventPage);  
hostRouter.get('/loggedOut/:id', toLogOut)
hostRouter.post('/createEvent/creating-event/:name', createEvent)
hostRouter.post('/addToFavourite/:eventId/:userId', addToFavourite)
hostRouter.post('/addToFavourite/:eventId/', loginPage)
hostRouter.get('/favouritesPage/:userId/', getFavouritesPage); 
hostRouter.post('/favourites/delete/:userId/:eventId' , deleteFavourite)


module.exports = hostRouter;
