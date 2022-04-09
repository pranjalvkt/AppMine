const express = require('express')
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));




app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/about.html');
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
                res.sendFile(__dirname + '/cards.html')
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


app.listen(80, () => { 
    console.log('server is runnig') 
});