CREATE TABLE `assessments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`framework_id` text NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`responses` text DEFAULT '[]' NOT NULL,
	`total_score` integer,
	`max_score` integer,
	`level` text,
	`recommendations` text,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`framework_id`) REFERENCES `frameworks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `coach_conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`session_id` text,
	`messages` text DEFAULT '[]' NOT NULL,
	`context` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `frameworks` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`color` text NOT NULL,
	`mode_count` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `frameworks_slug_unique` ON `frameworks` (`slug`);--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`team_id` text,
	`session_id` text,
	`category` text NOT NULL,
	`name` text NOT NULL,
	`value` integer NOT NULL,
	`unit` text NOT NULL,
	`recorded_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `modes` (
	`id` text PRIMARY KEY NOT NULL,
	`framework_id` text NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`purpose` text NOT NULL,
	`trigger` text NOT NULL,
	`flow_name` text NOT NULL,
	`fields_schema` text NOT NULL,
	`ai_coach_prompts` text NOT NULL,
	`done_signal` text NOT NULL,
	`metrics_schema` text NOT NULL,
	`composability_hooks` text NOT NULL,
	`time_estimate_minutes` integer DEFAULT 15 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`framework_id`) REFERENCES `frameworks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `modes_slug_unique` ON `modes` (`slug`);--> statement-breakpoint
CREATE TABLE `proactive_observations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`trigger_type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`suggested_mode_slug` text,
	`dismissed` integer DEFAULT false NOT NULL,
	`acted_on` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `progress` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`completion_ring` integer DEFAULT 0 NOT NULL,
	`consistency_streak` integer DEFAULT 0 NOT NULL,
	`growth_score` integer DEFAULT 0 NOT NULL,
	`modes_completed_this_period` integer DEFAULT 0 NOT NULL,
	`modes_recommended_this_period` integer DEFAULT 5 NOT NULL,
	`period_start` integer NOT NULL,
	`period_end` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`team_id` text,
	`mode_id` text NOT NULL,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`fields_data` text DEFAULT '{}' NOT NULL,
	`current_field_index` integer DEFAULT 0 NOT NULL,
	`decision` text,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mode_id`) REFERENCES `modes`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`team_id` text NOT NULL,
	`user_id` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`joined_at` integer NOT NULL,
	PRIMARY KEY(`team_id`, `user_id`),
	FOREIGN KEY (`team_id`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`owner_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `training_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`duration_days` integer NOT NULL,
	`frameworks_required` text NOT NULL,
	`mode_sequence` text NOT NULL,
	`target_stage` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `training_programs_slug_unique` ON `training_programs` (`slug`);--> statement-breakpoint
CREATE TABLE `user_frameworks` (
	`user_id` text NOT NULL,
	`framework_id` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`activated_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `framework_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`framework_id`) REFERENCES `frameworks`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user_programs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`program_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`start_date` integer NOT NULL,
	`current_day` integer DEFAULT 1 NOT NULL,
	`completed_modes` text DEFAULT '[]' NOT NULL,
	`metrics_snapshot` text,
	`completed_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`program_id`) REFERENCES `training_programs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`avatar_url` text,
	`stage` text DEFAULT 'solo' NOT NULL,
	`team_size` integer DEFAULT 1 NOT NULL,
	`onboarding_completed` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);