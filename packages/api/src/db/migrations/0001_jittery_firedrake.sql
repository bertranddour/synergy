CREATE INDEX `idx_assessments_user_framework` ON `assessments` (`user_id`,`framework_id`);--> statement-breakpoint
CREATE INDEX `idx_metrics_user_category` ON `metrics` (`user_id`,`category`,`recorded_at`);--> statement-breakpoint
CREATE INDEX `idx_metrics_user_name` ON `metrics` (`user_id`,`name`,`recorded_at`);--> statement-breakpoint
CREATE INDEX `idx_observations_user_dismissed` ON `proactive_observations` (`user_id`,`dismissed`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user_status` ON `sessions` (`user_id`,`status`,`completed_at`);