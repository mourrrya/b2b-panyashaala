# Create your first migration

To create your first migration after setting up your Supabase database:

1. First, make sure your DATABASE_URL is properly configured in your `.env` file
2. Run the following command to create and apply your first migration:

```bash
pnpm db:migrate
```

This will:

- Create a `prisma/migrations` directory
- Generate a migration file based on your current schema
- Apply the migration to your Supabase database

## Migration Commands

```bash
# Create a new migration (after schema changes)
pnpm db:migrate

# Deploy migrations (production)
pnpm db:migrate:deploy

# Never run Reset database and run all migrations
pnpm prisma migrate reset

# Check migration status
pnpm prisma migrate status

# Create a migration without applying it
pnpm prisma migrate dev --create-only --name "testing_db_status"

# Execute raw SQL file
pnpm prisma db execute --file prisma/manual_db_update.sql
```

## Important Notes

- Do not use `db:push`
- Use `db:migrate` for production-ready database changes
- Always review generated migrations before applying them
- Migrations are the recommended approach for production deployments

```

```
