const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const handlebars = require("express-handlebars");

const flash = require('express-flash');

const indexRouter = require("./routes/index");

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

app.set("views", path.join(__dirname, "views"));

// app.get('/', (req, res) => {
//     res.render('layouts/layout'); // Render the "layout" view directly
// });


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("csc648T05"));

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use((req,res,next) => {
    next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})



// app.get('/', (req, res) => {
//     res.render('layout');
// });

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
