-- Reset data in table after using Postman to test the POST and DELETE functions
INSERT INTO orders (order_id, manager, status, branch_number, items, item_quantity)
VALUES ('000001', 'Tan Ah Kao', 'Delivered', 1, 'Japanese Corn (10kg), Broccoli (1kg), Chicken Breasts (10kg), Chicken Thighs (10kg)', '15, 60, 10, 60');
