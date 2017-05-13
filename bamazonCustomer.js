//init

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "Bamazon_DB"
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
        if(answer.customerOrAdmin === "customer") {
           	showStore();
        } else {
            admin();
        }
    });
};

// function to show the storefront for the customer

var showStore = function() {
    //display all prducts availabe for sale
	console.log(" ");
	console.log("Welcome to My Store");
	console.log(" ");
	console.log("******************************");
	console.log("Available Products");
	console.log("******************************");
	console.log(" ");

	showProducts();
};

function showProducts(res){
	connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
		console.log("ID | Name | Department | Price(USD) | Stock Quantity");

		var availableProducts = [];
		
		for(var i = 0; i < res.length; i++) {
			var productObj = {'id': res[i].ID, 'product': res[i].product_name, 'price': "$" + res[i].price.toFixed(2)};
			availableProducts.push(productObj);
		}
		console.log(availableProducts);
        });
	
		getOrder();
};

// gets the information of a product from user
function getOrder(){
	inquirer.prompt([{name:"productID",message:"Enter the itemID of the product you want to purchase: ", validate: naturalNumber},{name:"quantity",message:"Enter quantity: ",validate: naturalNumber}])
		.then(function(answer){

		processOrder(answer.productID,parseInt(answer.quantity));
		
	});

}


// processes order. Gives purchase cost. Also adds to totalSales in departments table for that department.
function processOrder(productID,quantity){
	//new available quantity after customer order
	var availableQuantity,price;
	connection.query('SELECT stock_quantity,price FROM products WHERE ?',{ID:productID},function(err,res){
		if(err) throw err;
		availableQuantity = res[0].stock_quantity;
		price = parseInt(res[0].price);

		//check enough stock is available to place order
		if(availableQuantity < quantity){
			console.log("Insufficient quantity!");
			connection.end();
		}else{

		var quantityRemaining = availableQuantity - quantity;

		// updates products table(stockQuantity column)
				connection.query("UPDATE products SET products.stock_quantity = ?",[quantityRemaining, price*quantity,productID],function(err){
				if(err) throw err;
			
				console.log('The total cost of purchase is $', price*quantity);
				connection.end()
			});
		}

	});
}


// checks if value is natural number
function naturalNumber(value){
	if(parseInt(value)>0){
		return true;
	}
}

start();