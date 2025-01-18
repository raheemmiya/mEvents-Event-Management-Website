const path = require('path')

const rootdir = require('./utility/pathUtility');

const express = require('express');
const app = express();  

const userRouter = require('./routes/userRoute');
const hostRouter = require('./routes/hostRoute');

app.set('view engine', 'ejs'); 

app.set('views', 'views')

app.use("/static",express.static(path.join(rootdir, 'public')))

app.use(express.urlencoded({ extended: true })); //bpdyparsher  (meaning it gives us what is userdialed in the input)

app.use(userRouter);
app.use(hostRouter);



// app.use(pageNotFound);


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})