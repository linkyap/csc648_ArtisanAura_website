const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const handlebars = require("express-handlebars");

const flash = require('express-flash');

const sessions = require('express-session')
const mysqlStore = require('express-mysql-session')(sessions);

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const searchRouter = require("./routes/search");

const app = express();

const hbs = handlebars.create({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "layout",//for now
    helpers: {
      neo: function(obj){ //when not a empty object = neo
        return obj && obj.constructor === Object && Object.keys(obj).length > 0;
      }
    }
});



app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

const sessionStore= new mysqlStore({/* default options */}, 
require('./conf/database'));


app.set("views", path.join(__dirname, "views"));

// app.get('/', (req, res) => {
//     res.render('layouts/layout'); // Render the "layout" view directly
// });


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("csc648T05"));

app.use("/public", express.static(path.join(__dirname, "public")));


app.use(sessions({
  secret: "csc648T05",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: false
  }
}));


app.use(flash());
app.use(function(req, res, next){
  console.log(req.session);
  if(req.session.account){
    res.locals.isLoggedIn = true;//
    res.locals.account = req.session.account;
  }
  next();
})
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/search", searchRouter);



app.use((req,res,next) => {
    next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
