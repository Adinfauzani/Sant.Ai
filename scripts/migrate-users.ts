/**
 * Migrate existing users from Auth.js tables (Users.User + auth.Account)
 * to Better Auth tables (auth.user + auth.account).
 *
 * Run: npx tsx scripts/migrate-users.ts
 */
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL + "?options=-c%20search_path%3Dauth",
});

async function migrate() {
  const client = await pool.connect();

  try {
    // 1. Check for existing Better Auth users to avoid conflicts
    const existingResult = await client.query(`SELECT COUNT(*) FROM "user"`);
    const existingCount = parseInt(existingResult.rows[0].count);
    if (existingCount > 0) {
      console.log(`Better Auth user table already has ${existingCount} users — skipping migration.`);
      return;
    }

    // 2. Fetch all users from the old Users.User table (using default search_path)
    const usersResult = await client.query(
      `SELECT * FROM "Users"."User" ORDER BY "createdAt" ASC`
    );
    const users = usersResult.rows;
    console.log(`Found ${users.length} users to migrate.`);

    // 3. Check old auth.Account records
    const accountsResult = await client.query(
      `SELECT * FROM "auth"."Account"`
    );
    const accounts = accountsResult.rows;
    console.log(`Found ${accounts.length} OAuth accounts to migrate.`);

    // 4. Migrate each user
    for (const user of users) {
      // Insert into Better Auth user table (auth schema)
      await client.query(
        `INSERT INTO "user" ("id", "email", "emailVerified", "name", "image", "username", "studyProgram", "semester", "role", "plan", "avatar", "coverImage", "bio", "website", "location", "reputationPoints", "level", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
         ON CONFLICT ("id") DO NOTHING`,
        [
          user.id,
          user.email,
          false,                                          // emailVerified
          user.name,
          user.avatar || null,                            // image
          user.username || user.name?.toLowerCase().replace(/\s+/g, "-"),
          user.studyProgram || "TI",
          user.semester || 1,
          user.role || "User",
          user.plan || "Free",
          user.avatar || "",
          user.coverImage || "",
          user.bio || "",
          user.website || "",
          user.location || "",
          user.reputationPoints || 0,
          user.level || "Beginner",
          user.createdAt || new Date(),
          new Date(),                                     // updatedAt
        ]
      );
      console.log(`  ✓ Migrated user: ${user.email} (${user.id})`);
    }

    // 5. Set password hash for credential users
    for (const user of users) {
      if (user.password && user.password !== "") {
        // Find the account for this user or create one
        const existingAccount = accounts.find((a) => a.userId === user.id);
        if (!existingAccount) {
          // Create a credential account in Better Auth
          await client.query(
            `INSERT INTO "account" ("id", "userId", "accountId", "providerId", "password", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT DO NOTHING`,
            [
              `cred_${user.id}`,
              user.id,
              user.email,
              "credential",
              user.password, // Already hashed by bcrypt
              user.createdAt || new Date(),
              new Date(),
            ]
          );
          console.log(`  ✓ Created credential account for: ${user.email}`);
        }
      }
    }

    // 6. Migrate OAuth accounts
    for (const account of accounts) {
      await client.query(
        `INSERT INTO "account" ("id", "userId", "accountId", "providerId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "scope", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT DO NOTHING`,
        [
          account.id,
          account.userId,
          account.providerAccountId,
          account.provider,
          account.access_token || null,
          account.refresh_token || null,
          account.id_token || null,
          account.expires_at ? new Date(account.expires_at * 1000) : null,
          account.scope || null,
          account.createdAt || new Date(),
          new Date(),
        ]
      );
      console.log(`  ✓ Migrated OAuth account: ${account.provider} for userId ${account.userId}`);
    }

    console.log("\n✅ Migration complete!");
    console.log(`   ${users.length} users migrated`);
    console.log(`   ${accounts.length} OAuth accounts migrated`);
  } catch (err) {
    console.error("Migration failed:", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
