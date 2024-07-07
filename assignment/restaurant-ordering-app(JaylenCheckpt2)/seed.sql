-- Creation of Orders Table
CREATE TABLE orders (
    order_id VARCHAR(10) PRIMARY KEY,
    manager VARCHAR(100),
    status VARCHAR(50),
    branch_number INT,
	items NVARCHAR(MAX),
    item_quantity NVARCHAR(MAX)
);

-- Insertion of data into Orders Table
INSERT INTO orders (order_id, manager, status, branch_number, items, item_quantity)
VALUES ('000001', 'Tan Ah Kao', 'Delivered', 1, 'Japanese Corn (10kg), Broccoli (1kg), Chicken Breasts (10kg), Chicken Thighs (10kg)', '15, 60, 10, 60');

INSERT INTO orders (order_id, manager, status, branch_number, items, item_quantity)
VALUES ('000002', 'Lim Beng Kee', 'Delivering', 2, 'Garlic (10kg), Shitake Mushrooms (5kg), Japanese Beef (10kg), Ginger (10kg)', '30, 40, 20, 30');

INSERT INTO orders (order_id, manager, status, branch_number, items, item_quantity)
VALUES ('000003', 'Ng Cheng Bee', 'Delivering', 3, 'Tomatoes (500g), Shitake Mushrooms (5kg), Chicken Breasts (10kg), Ginger (10kg), Japanese Beef (10kg)', '70, 20, 15, 30, 25');

INSERT INTO orders (order_id, manager, status, branch_number, items, item_quantity)
VALUES ('000004', 'Tan Ah Kao', 'Pending', 1, 'Garlic (10kg), Ginger (10kg), Chicken Thighs (10kg)', '20, 20, 30');

INSERT INTO orders (order_id, manager, status, branch_number, items, item_quantity)
VALUES ('000005', 'Ng Cheng Bee', 'Pending', 3, 'Japanese Corn (10kg), Broccoli (1kg), Japanese Beef (10kg), Chicken Breasts (10kg), Chicken Thighs (10kg)', '50, 30, 35, 25, 25');