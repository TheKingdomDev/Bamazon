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
            getOrder();
        } else {
            admin();
        }
    });
};

//function to show the storefront for the customer

// var showStore = function() {
//     connection.query("SELECT * FROM products", function(err, result) {
//         if (err) throw err;

//         inquirer.prompt([
//             {
//                 name: "choice",
//                 type: "rawlist",
//                 choices: function() {
//                     var choiceArray = [];
//                     for (var i = 0; i < results.length; i++) {
//                         choiceArray.push(result[i].item_id, result[i].product_name, result[i].price);
//                     }
//                     return choiceArray;
//                 },
//                 message: "Which item would you like to buy?"
//             }
//         ])
//     }).then(function(answer) {
//         var chosenProduct;
//         for(var i = 0;i < result.length; i++) {
//             if(result[i].product_name === answer.choice) {
//                 chosenProduct = result[i];
//             }
//         }
//     });
// }

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
	connection.query('SELECT stock_quantity,price FROM products WHERE ?',{itemID:productID},function(err,results){
		if(err) throw err;
		availableQuantity = results[0].stock_quantity;
		price = parseInt(results[0].price);

		//check enough stock is available to place order
		if(availableQuantity < quantity){
			console.log("Insufficient quantity!");
			connection.end();
		}else{

		var quantityRemaining = availableQuantity - quantity;

		// updates products table(stockQuantity column) and departments table(total Sales column)
				connection.query('UPDATE products,departments SET products.StockQuantity = ? , departments.TotalSales = departments.TotalSales + ? WHERE products.item_iD = ? AND products.DepartmentName = departments.DepartmentName',[quantityRemaining, price*quantity,productID],function(err){
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