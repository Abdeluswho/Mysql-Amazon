let inquirer = require("inquirer");
let mysql = require("mysql");




let connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	user: "root",

	password:"",
	database: "bamazon"
});

connection.connect(function (err) {
	// body...
	if (err) throw err;
	console.log('connect as ID: ', connection.threadId);
	promptManager();
	// test(3);

	// setTimeout(promptUser, 2000);
});

function checkInput(value) {
    var sign = Math.sign(value);

    if (sign === 1) {
        return true;
    } else {
        return 'Please enter a positive number.';
    }
}

function promptManager() {
	// Prompt the manager to select an option
    inquirer.prompt([
        {
            type: 'list',
            name: 'option',
            message: 'Please select an option:',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product'],
            filter: function (val) {
                if (val === 'View Products for Sale') {
                    return 'showInventory';
                } else if (val === 'View Low Inventory') {
                    return 'lowInventory';
                } else if (val === 'Add to Inventory') {
                    return 'addInventory';
                } else if (val === 'Add New Product') {
                    return 'newProduct';
                }
            }
        }
    ]).then(function(ManInput) {
    		

    		let ManagerInput = ManInput.option;



    	switch(ManagerInput){

    		case 'showInventory':
    			return  displayInventory();
    		case 'lowInventory':
    			return dsplayLowInventory();
    		case 'addInventory':
    			return addInventory();
    		case 'newProduct':
    			return newProduct();
    	}

    })
}


function displayInventory() {
	// body...
	connection.query("SELECT * from products ", function(err,res){
		if (err) throw err;

		 console.log('\nExisting Inventory: ');
         console.log('------------------ --------------------------- ----------------------- ----------------\n');

        var strOut = '';
        for (var i = 0; i < res.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + res[i].item_id + '  || ';
            strOut += 'Product Name: ' + res[i].product_name + '  || ';
            strOut += 'Department: ' + res[i].department_name + '  ||  ';
            strOut += 'Price: $' + res[i].price_usd + '  ||  ' ;
            strOut += 'Stock: '  + res[i].stock_quantity +'\n'

            console.log(strOut);
        }

        console.log("--------------------- -------------------------- ---------------------- -----------------\n");
		
		
	})
    promptManager();
}

function dsplayLowInventory() {
	// body...
	let $query = "SELECT * FROM products WHERE stock_quantity <= 5";

	connection.query($query, function (err, res) {
		// body...
		if (err) throw err;

		 console.log('\nExisting Inventory: ');
         console.log('------------------ --------------------------- ----------------------- --------------------------\n');

        var strOut = '';
        for (var i = 0; i < res.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + res[i].item_id + '  || ';
            strOut += 'Product Name: ' + res[i].product_name + '  || ';
            strOut += 'Department: ' + res[i].department_name + '  ||  ';
            strOut += 'Price: $' + res[i].price_usd + '  ||  ' ;
            strOut += 'Stock: '  + res[i].stock_quantity +'\n'

            console.log(strOut);
        }

        console.log("--------------------- -------------------------- ---------------------- ------------------------------\n");

	})
    promptManager();
}

function addInventory() {
	// body...
	inquirer.prompt([
        {
            
            name: 'productID',
            message: 'Please Enter the product ID that you would like to add Inventory to?',
            validate: checkInput,
            filter: Number
        },
        {

            name: 'quantity',
            message: 'How many would you like to add?',
            validate: checkInput,
            filter: Number
        },
    ]).then(function(Input) {
        let data = 0;
        
    	let id = Input.productID;
        let value = Input.quantity;

    	let $query = 'SELECT * FROM products WHERE item_id = ' +id;

            	    connection.query($query, function (err, res) {
            	       
                       
                           // body...
                                   console.log("Updating...");
                                value += res[0].stock_quantity;     
                                strOut = '';
                                strOut += 'Item ID: ' + res[0].item_id + '  || ';
                                strOut += 'Product Name: ' + res[0].product_name + '  || ';
                                strOut += 'Department: ' + res[0].department_name + '  ||  ';
                                strOut += 'Price: $' + res[0].price_usd + '  ||  ' ;
                                strOut += 'Stock: '  + res[0].stock_quantity +'\n';

                                console.log(strOut);
                       
                      
                       

                        $query = "UPDATE products SET stock_quantity = "+ value +" WHERE item_id="+id;

                    connection.query($query, function (err, res) {
                            // body...
                            if (err) throw err;
                               connection.query('SELECT * FROM products WHERE item_id= '+ id,function (err, res) {
                                   // body...
                                   if (err) throw err; 

                                   console.log('- - - - - - Database Updated- - - - - ')
                                    strOut = '';
                                    strOut += 'Item ID: ' + res[0].item_id + '  || ';
                                    strOut += 'Product Name: ' + res[0].product_name + '  || ';
                                    strOut += 'Department: ' + res[0].department_name + '  ||  ';
                                    strOut += 'Price: $' + res[0].price_usd + '  ||  ' ;
                                    strOut += 'Stock: '  + res[0].stock_quantity +'\n';

                                    console.log(strOut);

                               })

                           
                           

                    })
            	            		
            	    })
            
	            
    })

    promptManager();
}


function newProduct() {
    // body...
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'Please enter the new product name.',
        },
        {
            type: 'input',
            name: 'department_name',
            message: 'Which department does the new product belong to?',
        },
        {
            type: 'input',
            name: 'price_usd',
            message: 'What is the price per unit?',
            validate: checkInput
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many items are in stock?',
            validate: checkInput
        }
    ]).then(function(input) {

        console.log('Adding New Item: \n    product_name = ' + input.product_name + '\n' +
            '    department_name = ' + input.department_name + '\n' +
            '    price_USD = ' + input.price_usd + '\n' +
            '    stock_quantity = ' + input.stock_quantity);

        console.log('-------------------')
      
         // Create the insertion query string
        var queryInv = 'INSERT INTO products SET ?';

        // Add new product to the db
        connection.query(queryInv, input, function (error, results) {
            if (error) throw error;

            console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
            console.log("\n---------------------------------------------------------------------\n");

          promptManager();
        });
    })
}






function test(val){
	            	
	            	let $query = 'SELECT * FROM products WHERE item_id = ' +id;
	            	return connection.query($query, function (err, res) {
	            		console.log(res);
	            		
	            	})
	            }


























