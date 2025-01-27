const express = require("express");
const {loginPage, spotAdded, addToFavourite, getFavouritesPage, deleteFavourite, getMyEventsPage, getMyProfile, getMyTicketPages} = require("../controller/hostController");
const {loginUser} = require("../controller/hostController");
const {createEventPage} = require('../controller/hostController')
const {toLogOut} = require('../controller/hostController')
const {createEvent } =  require('../controller/eventsController')
const {deleteMyEvent} = require('../controller/eventsController')
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
hostRouter.get('/my-profile/:userId', getMyProfile)
hostRouter.get('/find-my-tickets/:userId', getMyTicketPages);
hostRouter.post('/spot-added/:userId', spotAdded)
hostRouter.get('/my-events/:userId', getMyEventsPage);
hostRouter.post('/myEvents/delete/:userId/:eventId', deleteMyEvent)


module.exports = hostRouter;
