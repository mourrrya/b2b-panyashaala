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

# Reset database and run all migrations
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

## Important Notes

- Use `db:push` for rapid prototyping in development
- Use `db:migrate` for production-ready database changes
- Always review generated migrations before applying them
- Migrations are the recommended approach for production deployments
