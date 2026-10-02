# Admin and history access

New registrations always receive role `USER` from the database default. Role cannot be changed through registration or profile requests. Approval endpoints require a current, approved `ADMIN` account. HTTP and realtime history use the current database role, not JWT role claims.

History ownership uses `user_id`, backfilled by matching existing unique card IDs. Rows whose owner cannot be matched remain visible only to admins. The `(user_id, Timestamp DESC, id DESC)` index supports user history lookup. Public Supabase REST roles cannot read the history table; application access goes through the backend.

For the existing manually created database without Prisma migration history, run from `sijaga-be` with Node.js 24:

```powershell
npx prisma generate
node --env-file=.env scripts/apply-access-schema.ts
node --env-file=.env scripts/configure-admin.ts farras@emailcom
```

The schema script applies the checked-in access migration in a transaction and verifies the generated Prisma queries. The admin script promotes only an existing account with the exact supplied email and approves it. It does not create an account or infer a corrected email.

For a database with consistent Prisma migration history, use `npx prisma migrate deploy` instead of the schema script.

Restart the backend after applying the schema. Existing JWTs remain valid for approved accounts; current roles are loaded on each request. Socket clients must send `auth.token`. Private history events revalidate the account and revoked tokens before delivery.
