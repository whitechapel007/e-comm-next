-- Rename Category enum values to Eboya Boi product lines.
-- Uses pg_type.typname for exact case-sensitive lookup (Prisma creates
-- the enum as "Category" with capital C, which ::regtype folds to lowercase).
-- Each block is idempotent: if the old value no longer exists, it is skipped.

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'Category' AND e.enumlabel = 'SHOES'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'SHOES' TO 'KAFTAN'; END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'Category' AND e.enumlabel = 'BAGS'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'BAGS' TO 'AGBADA'; END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'Category' AND e.enumlabel = 'CLOTHING'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'CLOTHING' TO 'SHIRTS'; END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname = 'Category' AND e.enumlabel = 'ACCESSORIES'
  ) THEN ALTER TYPE "Category" RENAME VALUE 'ACCESSORIES' TO 'TWO_PIECE'; END IF;
END $$;

ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'CASUALWEAR';
