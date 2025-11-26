CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(18, 6) NOT NULL,
	"stock" integer DEFAULT 1 NOT NULL,
	"image_url" text,
	"seller_address" varchar(42) NOT NULL,
	"seller_name" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
