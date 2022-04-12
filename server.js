const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


const db = 'mongodb+srv://admin123:PranjalT%400809@cluster1.acwvi.mongodb.net/appmine';
// ?retryWrites=true&w=majority

mongoose.connect(db, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database is connected");
}).catch(err => console.log("Database connection failed!" + err));

const appSchema = new mongoose.Schema({
    image: String, 
    title: String,
    para: String,
    name: String
});

const appsData = mongoose.model("app", appSchema);





app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
});

app.get('/success', (req, res) => {
    res.sendFile(__dirname + '/success.html');
});

// HOME PAGE FOR WINDOWS
app.get('/windowsHome', (req, res)=>{
    appsData.find(function(err, app) {
        if(err) {
           console.log(err);
        } else {
            res.render("windowsHome.ejs", {app: app});
        }
    })
});


// **************************User Part***********************************//

//User Sign-in
app.get('/userSignIn', (req, res) => {
    res.sendFile(__dirname + '/userSignIn.html')
});

//User Sign-up
app.get('/userSignUp', (req, res) => {
    res.sendFile(__dirname + '/userSignUp.html')
});

//user signin details
app.post('/userSignIn', (req, res) => {

    let userSignin = {
        email : req.body.userSignin_email,
        password: req.body.userSignin_password,
    }
    console.log(userSignin);
});

//user signup details
app.post('/userSignUp', (req, res) => {

    let userSignup = {
        name: req.body.userSignup_name,
        email : req.body.userSignup_email,
        password: req.body.userSignup_password,
    }
    console.log(userSignup);
});

//List of Apps
app.get('/home', (req, res) => {
    // let os = req.rawHeaders[11];
    let os = req.rawHeaders
    os.forEach(element => {
        if(element.startsWith('Mozilla')) {
            console.log(element);
            if(element.includes("Windows")) {
                // res.sendFile(__dirname + '/cards.html')
                res.redirect('/windowsHome')
            } else if(element.includes("Android")){
                res.sendFile(__dirname + '/androidAppList.html')
            } else {
                res.send("<h1> Not able to detect your OS, enter manually !</h1>"); 
            }
        }
    }); 
});

//Individual app page
app.get("/appPages/:value", (req, res) => {
    value = req.url;
    // console.log(value);
    res.sendFile(__dirname+value);
});


app.get('/download/:value',function(req,res){
    value = req.url;
    res.download(__dirname +value,'app.exe');
})


// **************************Admin Part***********************************//
//Admin Sign-in
app.get('/adminSignIn', (req, res) => {
    res.sendFile(__dirname + '/adminSignIn.html')
});

//Admin Sign-up
app.get('/adminSignUp', (req, res) => {
    res.sendFile(__dirname + '/adminSignUp.html')
});

//Admin Signin details
app.post('/adminSignIn', (req, res) => {

    let adminSignin = {
        email : req.body.adminSignin_email,
        password: req.body.adminSignin_password,
    }
    console.log(adminSignin);
});

//Admin signup details
app.post('/adminSignUp', (req, res) => {

    let adminSignup = {
        name: req.body.adminSignup_name,
        email : req.body.adminSignup_email,
        password: req.body.adminSignup_password,
    }
    console.log(adminSignup);
});

//Admin Home page
app.get('/adminHome', (req, res) => {
    res.sendFile(__dirname + '/adminHome.html')
});

app.get('/publishApp', (req, res) => {
    res.sendFile(__dirname + '/PublishApp.html')
});

app.post('/publishApp', (req, res)=>{

    let appName = req.body.appName;
    let appDesc = req.body.appDesc;
    let contentToCopy = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
        <script src = "https://socket.io/socket.io.js"></script>
        <title>${appName}</title>
    </head>
    <body>
        
            
        <center><h1>${appName}</center>
       <center><img src="https://images.sftcdn.net/images/t_app-logo-xl,f_auto/p/bbdedd58-96bf-11e6-ab2f-00163ed833e7/2782924292/adobe-photoshop-icon.png"></center>
        <pre>
            
        <center>
            <button id = "btn_download">Download</button>
        </center>
        <pre>
        <center><h1>Description</h1></center>
        <center>
            <p>${appDesc}</p>
        </center>
        <script type="text/javascript">
            $("#btn_download").click(function(){
                window.open('/download/${appName}.exe');
            })
        </script>
    </body>
    </html>`
    
    fs.appendFile('appPages/' + appName + '.html', contentToCopy, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
})


app.listen(80, () => { 
    console.log('server is runnig') 
});