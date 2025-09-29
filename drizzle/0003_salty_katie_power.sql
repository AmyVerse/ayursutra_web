ALTER TABLE "doctors" RENAME COLUMN "user_id" TO "ayursutra_id";--> statement-breakpoint
ALTER TABLE "doctors" DROP CONSTRAINT "doctors_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "ayursutra_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "doctors" ALTER COLUMN "rating" SET DATA TYPE text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "doctors" ADD CONSTRAINT "doctors_ayursutra_id_users_ayursutra_id_fk" FOREIGN KEY ("ayursutra_id") REFERENCES "public"."users"("ayursutra_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
