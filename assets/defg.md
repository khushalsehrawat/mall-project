# Deploy Shrawn Live for Free

This project has:

- Frontend: React + Vite in `FRONTEND/`
- Backend: Spring Boot + Maven in `backend/`
- Database: PostgreSQL
- Redis dependency: configured in production, so use a free Redis provider or remove Redis from production config later

## Best Free Hosting Choice

Use this setup:

- Frontend: Vercel
- Backend: Koyeb free web service
- Database: Neon free PostgreSQL
- Redis: Upstash free Redis

Why this setup:

- Vercel is very good for free static React/Vite hosting.
- Koyeb gives one free web service for backend apps.
- Neon has a permanent free PostgreSQL plan for low-traffic apps.
- Upstash has a free Redis plan.

Important truth: no free platform is perfect for production. Some free services sleep, limit usage, or can change pricing. For a college/project/demo app this setup is good. For real users and guaranteed uptime, paid hosting is the proper answer.

## Files You Need To Make Or Change

### 1. Make this file

Already made:

```text
DEPLOY_LIVE_README.md
```

### 2. Change backend CORS before deploy

Open:

```text
backend/src/main/java/com/expenseTracker/shrawn/auth/infrastrucutre/security/SecurityConfiguration.java
```

Find this:

```java
configuration.setAllowedOrigins(List.of(
        "http://localhost:5173",
        "192.168.1.9:5173"
));
```

Replace it with your deployed frontend URL after Vercel deploys:

```java
configuration.setAllowedOrigins(List.of(
        "http://localhost:5173",
        "https://YOUR-VERCEL-APP.vercel.app"
));
```

Example:

```java
configuration.setAllowedOrigins(List.of(
        "http://localhost:5173",
        "https://shrawn.vercel.app"
));
```

## Step 1: Push Code To GitHub

Create a GitHub repo and push this project.

From `D:\shrawn`:

```powershell
git init
git add .
git commit -m "Initial deploy setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

If git is already connected, just run:

```powershell
git add .
git commit -m "Add deployment guide"
git push
```

## Step 2: Create Free PostgreSQL On Neon

1. Go to `https://neon.tech`.
2. Sign up.
3. Create a new project.
4. Choose PostgreSQL.
5. Copy the connection string.

Neon gives a connection string like:

```text
postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require
```

Spring Boot needs JDBC format:

```text
jdbc:postgresql://HOST.neon.tech/DBNAME?sslmode=require
```

Save these values:

```text
DB_URL=jdbc:postgresql://HOST.neon.tech/DBNAME?sslmode=require
DB_USERNAME=USER
DB_PASSWORD=PASSWORD
```

## Step 3: Create Free Redis On Upstash

1. Go to `https://upstash.com`.
2. Sign up.
3. Create a Redis database.
4. Open database details.
5. Copy host, port, password, and TLS/SSL info.

Use these backend environment variables:

```text
REDIS_HOST=YOUR_UPSTASH_REDIS_HOST
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=YOUR_UPSTASH_REDIS_PASSWORD
REDIS_SSL_ENABLED=true
```

## Step 4: Deploy Backend On Koyeb

1. Go to `https://www.koyeb.com`.
2. Sign up.
3. Create App.
4. Choose GitHub repository.
5. Select this repo.
6. Set root directory:

```text
backend
```

7. Choose Java/Spring Boot build.
8. Set build command:

```bash
./mvnw clean package -DskipTests
```

9. Set run command:

```bash
java -jar target/shrawn-0.0.1-SNAPSHOT.jar
```

10. Set port:

```text
8080
```

11. Add environment variables:

```text
SPRING_PROFILES_ACTIVE=prod
SERVER_PORT=8080

DB_URL=jdbc:postgresql://HOST.neon.tech/DBNAME?sslmode=require
DB_USERNAME=YOUR_NEON_USER
DB_PASSWORD=YOUR_NEON_PASSWORD

REDIS_HOST=YOUR_UPSTASH_REDIS_HOST
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=YOUR_UPSTASH_REDIS_PASSWORD
REDIS_SSL_ENABLED=true

FRONTEND_URL=https://YOUR-VERCEL-APP.vercel.app

JWT_SECRET=MAKE_A_LONG_RANDOM_SECRET_AT_LEAST_64_CHARACTERS_LONG_123456789

EMAIL_ENABLED=false
S3_BUCKET_NAME=dummy
AWS_REGION=us-east-1
```

12. Deploy.

After deployment, Koyeb gives a backend URL like:

```text
https://YOUR-BACKEND.koyeb.app
```

Test backend health:

```text
https://YOUR-BACKEND.koyeb.app/actuator/health
```

You should see a health response.

## Step 5: Deploy Frontend On Vercel

1. Go to `https://vercel.com`.
2. Sign up.
3. Add New Project.
4. Import the same GitHub repo.
5. Set root directory:

```text
FRONTEND
```

6. Framework preset:

```text
Vite
```

7. Build command:

```bash
npm run build
```

8. Output directory:

```text
dist
```

9. Add environment variable:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND.koyeb.app
```

10. Deploy.

Vercel gives a frontend URL like:

```text
https://YOUR-VERCEL-APP.vercel.app
```

## Step 6: Update CORS And Redeploy Backend

After Vercel gives your frontend URL, update:

```text
backend/src/main/java/com/expenseTracker/shrawn/auth/infrastrucutre/security/SecurityConfiguration.java
```

Add the Vercel URL inside `setAllowedOrigins`.

Then commit and push:

```powershell
git add .
git commit -m "Allow deployed frontend origin"
git push
```

Koyeb should redeploy automatically.

## Step 7: Final Test

Open your Vercel frontend URL:

```text
https://YOUR-VERCEL-APP.vercel.app
```

Test:

1. Register a new account.
2. Login.
3. Create a category.
4. Add an expense.
5. Refresh the page and check that data still exists.

If data still exists after refresh, Neon database is working.

## Common Problems

### CORS error in browser

Fix:

- Make sure `SecurityConfiguration.java` contains the exact Vercel URL.
- Make sure the URL includes `https://`.
- Commit and redeploy backend.

### Frontend says network error

Fix:

- Check `VITE_API_BASE_URL` in Vercel.
- It must be the backend URL, not frontend URL.
- Example:

```text
VITE_API_BASE_URL=https://YOUR-BACKEND.koyeb.app
```

### Backend fails on startup

Check Koyeb logs.

Most likely reasons:

- Wrong `DB_URL`
- Wrong `DB_USERNAME`
- Wrong `DB_PASSWORD`
- `JWT_SECRET` is shorter than 64 characters
- Redis env variables are wrong

### Database migration error

The backend uses Flyway migrations from:

```text
backend/src/main/resources/db/migration
```

If migration fails, open Koyeb logs and check the exact SQL error.

## Recommended Free URLs

Use these services:

```text
Frontend: https://vercel.com
Backend:  https://www.koyeb.com
Database: https://neon.tech
Redis:    https://upstash.com
```

## Permanent Live Notes

Free hosting can be long-term, but not guaranteed like paid hosting.

For the most permanent free setup:

- Keep the frontend on Vercel.
- Keep the database on Neon.
- Keep Redis on Upstash.
- Use Koyeb free backend while your traffic is small.

If the backend becomes slow or unreliable, move only the backend to a paid service later. You can keep the same Neon database.
