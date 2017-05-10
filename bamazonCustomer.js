//init

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "",
    database: Bamazon_DB
});

connection.connect(function(err) {
    if (err) throw err;
});


//function to start the application, asking what type of user
var start = function() {
    inquirer.prompt({
        name: "customerOrAdmin",
        type: "rawlist",
        message: "Hello, are you a [customer] or [admin]",
        choices: ["customer", "admin"]
    }).then(function(answer) {
        if(answer.customerOrAdmin.toLowerCase() === "customer") {
            showStore();
        } else {
            admin();
        }
    });
};

//function to show the storefront for the customer

var showStore = function() {
    connection.query("SELECT * FROM products", function(err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "choice",
                type: "rawlist",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(result[i].item_id, result[i].product_name, result[i].price);
                    }
                    return choiceArray;
                },
                message: "Which item would you like to buy?"
            }
        ])
    }).then(function(answer) {
        var chosenProduct;
        for(var i = 0;i < result.length; i++) {
            if(result[i].product_name === answer.choice) {
                chosenProduct = result[i];
            }
        }
    });
}

start();