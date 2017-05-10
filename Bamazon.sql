CREATE DATABASE Bamazon_DB;

USE Bamazon_DB;

CREATE TABLE products (
    item_id INT NOT NULL,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(1,2) NOT NULL,
    stock_quantity INT
    PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("iphone","electronics",650.00,25),("macbook","electronics",1200.00,12),("fitbit","electronics",120.00,25),("popcap mini","toys",8.00,200),("running shoes","footwear",55.00,150),("viking axe","weaponry",125.00,5),("recurve bow","outdoors",180.00,55),("soccer ball","sports",30.00,200),("for honor","video games",60.00,250),("doritos","food",3.50,5000);

SELECT * FROM products;