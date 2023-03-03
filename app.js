require('dotenv').config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    const firstName = req.body.firstName; //já que essas 'variáveis' nunca serão alteradas no decorrer do programa, elas podem ser declaradas como const ao invés de var
    const lastName = req.body.lastName;
    const emailAddress = req.body.emailAddress;

    //console.log(res.statusCode);

    const userData = {
        members: [
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(userData);
    const url = "https://" + process.env.SERVER_NUMBER + ".api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

    const options = {
        method: "POST",
        auth: "victor:" + process.env.API_KEY, //na documentação do site do mailchimp, eles falaram para usar o método auth do módulo https e o username não é usado, tanto faz. é só colocar um username aleatório, separar por : e aí colocar a chave de autenticação deles
    }

    const request = https.request(url, options, function(response){

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

        //console.log(response.statusCode, "haha");
        if (response.statusCode == 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");   
        }

    });

    request.write(jsonData);

    request.end();
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000,function(){//o símbolo || significa ou
    console.log("Server running on Cyclic.");
})