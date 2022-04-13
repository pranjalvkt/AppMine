const express = require('express')
const mongoose = require('mongoose');
const User = require('./Models/userModel');
const Admin = require('./Models/adminModel');
const appsData = require('./Models/appModel');
const path = require('path');
const app = express();
const bodyParser = require("body-parser");
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const db = 'mongodb+srv://admin123:PranjalT%400809@cluster1.acwvi.mongodb.net/appmine';

mongoose.connect(db, {
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database is connected");
}).catch(err => console.log("Database connection failed!" + err));


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
    var query = { appOS: "windows" };
    appsData.find(query, function(err, app) {
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
    
    const currEmail = req.body.userSignin_email;
    const currPassword = req.body.userSignin_password;
    
    User.findOne({email: currEmail}, (err, foundUser)=>{
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === currPassword) {
                    res.redirect('/home');
                } else {
                    console.log("Invalid email/password");
                    res.redirect('/userSignIn')
                }
            } else {
                console.log("User doesn't exist, Sign up first");
                res.redirect('/userSignup');
            }
        }
    })

});

//user signup details
app.post('/userSignUp', (req, res) => {
 
    const currEmail = req.body.userSignup_email;
    const currPassword = req.body.userSignup_password;
    const newUser = new User ({
        name: req.body.userSignup_name,
        email : currEmail,
        password: currPassword,
    })
    User.findOne({email: currEmail}, (err, foundUser)=>{
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === currPassword) {
                    console.log("User already exist");
                    res.redirect('/home');
                } else {
                    console.log("User already exist, please Sign in instead");
                    res.redirect('/userSignIn')
                }
            } else {
                newUser.save((err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("New user created");
                        res.redirect('/home')
                    }
                })
            }
        }
    })
    
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
    
    let currAppName = value.slice(10);
    // console.log(currAppName);

    appsData.findOne({name: currAppName}, (err, currApp)=>{
        if(err) {
            console.log(err);
        } else {
            res.render("currApp.ejs", {currApp: currApp});
        }
    });
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

    const currEmail = req.body.adminSignin_email;
    const currPassword = req.body.adminSignin_password;
    
    Admin.findOne({email: currEmail}, (err, foundUser)=>{
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === currPassword) {
                    res.redirect('/publishApp');
                } else {
                    console.log("Invalid email/password");
                    res.redirect('/adminSignIn')
                }
            } else {
                console.log("Admin doesn't exist, Sign up first");
                res.redirect('/adminSignup');
            }
        }
    })
});

//Admin signup details
app.post('/adminSignUp', (req, res) => {

    const currEmail = req.body.adminSignup_email;
    const currPassword = req.body.adminSignup_password;
    const newAdmin = new Admin ({
        name: req.body.adminSignup_name,
        email : currEmail,
        password: currPassword,
    })
    Admin.findOne({email: currEmail}, (err, foundUser)=>{
        if(err) {
            console.log(err);
        } else {
            if(foundUser) {
                if(foundUser.password === currPassword) {
                    console.log("User already exist");
                    res.redirect('/publishApp');
                } else {
                    console.log("user already exist, please Sign in instead");
                    res.redirect('/adminSignIn')
                }
            } else {
                newAdmin.save((err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("New Admin created");
                        res.redirect('/publishApp')
                    }
                })
            }
        }
    })
});

//Admin Home page
app.get('/adminHome', (req, res) => {
    res.sendFile(__dirname + '/adminHome.html')
});

app.get('/deleteApp/:value', async (req, res)=> {
    // DELETE APP CREATED BY CURRENT ADMIN
    let value = req.url;
    let toRemove = value.slice(11);
    let query = { name: toRemove };
    appsData.deleteOne(query, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
        res.sendFile(__dirname + '/deleted.html');
    });
})

app.get('/createdApp', (req, res)=> {
    // APP CREATED BY CURRENT ADMIN
    let currAdmin = 'pranjal123';

    let query = { appAdmin: currAdmin };
    appsData.find(query, function(err, app) {
        if(err) {
            console.log(err);
        } else {
            res.render("currAdminAppAll.ejs", {app: app});
        }
        
    });
})

app.get('/publishApp', (req, res) => {
    // PAGE FOR CREATING NEW APP
    res.sendFile(__dirname + '/PublishApp.html')
});

app.post('/publishApp', (req, res)=>{
    // PAGE FOR CREATING NEW APP
    let appName = req.body.appName;
    let appDesc = req.body.appDesc;
    let appImg = req.body.appImg;
    let appAdmin = req.body.appAdmin;
    let appOS = req.body.appOS;
    // let appOS = tempAppOS.toLowerCase()
    const mong = new appsData ({
        name: appName.toLowerCase(),
        image: appImg,
        para: appDesc,
        title: appName,
        appAdmin: appAdmin,
        appOS: appOS
    });
    

    //*************************** USELESS CODE, REMOVE WHEN COMPLETED */
    appName = appName.toLowerCase();
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
    
    // fs.appendFile('appPages/' + appName + '.html', contentToCopy, function (err) {
    //     if (err) throw err;
    //     console.log('Saved!');
    // });
    //*************************** USELESS CODE, REMOVE WHEN COMPLETED */

    appsData.insertMany([mong], function(err){
        if(err) {
            console.log(err);
        } else {
            console.log("New app detail successfully added !");
            res.redirect('/success');
        }
    });
})


app.listen(80, () => { 
    console.log('server is runnig') 
});