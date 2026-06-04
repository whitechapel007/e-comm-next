-- Rename Category enum values to Eboya Boi product lines
-- Each DO block checks before renaming so this is safe to re-run

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'Category'::regtype AND enumlabel = 'SHOES'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'SHOES' TO 'KAFTAN'; END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'Category'::regtype AND enumlabel = 'BAGS'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'BAGS' TO 'AGBADA'; END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'Category'::regtype AND enumlabel = 'CLOTHING'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'CLOTHING' TO 'SHIRTS'; END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'Category'::regtype AND enumlabel = 'ACCESSORIES'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'ACCESSORIES' TO 'TWO_PIECE'; END IF;
END $$;

ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'CASUALWEAR';
