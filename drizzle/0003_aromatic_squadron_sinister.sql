CREATE TABLE `loyalty_customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`phone` varchar(50) NOT NULL,
	`name` varchar(255) NOT NULL,
	`birthDate` timestamp,
	`bonusBalance` int NOT NULL DEFAULT 0,
	`discountPercent` decimal(5,2) NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `loyalty_customers_id` PRIMARY KEY(`id`),
	CONSTRAINT `loyalty_customers_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE TABLE `loyalty_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`type` enum('bonus_earned','bonus_spent','discount_applied','manual_adjustment') NOT NULL,
	`amount` int NOT NULL,
	`description` text,
	`orderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `loyalty_transactions_id` PRIMARY KEY(`id`)
);
