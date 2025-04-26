CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`cost` integer NOT NULL,
	`timestamp` text DEFAULT (current_timestamp) NOT NULL
);
