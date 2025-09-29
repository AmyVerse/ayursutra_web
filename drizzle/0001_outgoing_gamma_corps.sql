ALTER TABLE "doctors" ALTER COLUMN "specialization" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "experience" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "experience" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "experience" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "location" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "rating" SET DATA TYPE numeric(2, 1);--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "patients_checked" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "doctors" ADD COLUMN "biography" text;