CREATE TABLE `team_invitations` (
	`id` text PRIMARY KEY NOT NULL,
	`team_id` text NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`invited_by` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`token` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`accepted_at` integer,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`invited_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_invitations_token_unique` ON `team_invitations` (`token`);--> statement-breakpoint
CREATE INDEX `idx_invitations_team_status` ON `team_invitations` (`team_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_invitations_email_status` ON `team_invitations` (`email`,`status`);