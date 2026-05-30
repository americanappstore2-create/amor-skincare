CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`customerPhone` varchar(50) NOT NULL,
	`deliveryAddress` text NOT NULL,
	`paymentMethod` enum('kaspi_red','cash') NOT NULL,
	`items` json NOT NULL,
	`totalAmount` decimal(10,2) NOT NULL,
	`status` enum('new','confirmed','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'new',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`brand` varchar(100) NOT NULL,
	`category` enum('serum','cream','toner','mask','cleanser','eye_care','sunscreen','other') NOT NULL,
	`description` text,
	`ingredients` text,
	`usage` text,
	`price` decimal(10,2) NOT NULL,
	`imageUrl` varchar(500),
	`inStock` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
