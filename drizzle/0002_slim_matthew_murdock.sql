ALTER TABLE `orders` MODIFY COLUMN `deliveryAddress` text;--> statement-breakpoint
ALTER TABLE `orders` ADD `deliveryMethod` enum('delivery','pickup') DEFAULT 'delivery' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `pickupLocation` varchar(255);