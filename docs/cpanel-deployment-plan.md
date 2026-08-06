# cPanel Deployment Plan

This plan targets a conventional cPanel account running Apache and a supported PHP version. It assumes Laravel is deployed after the migration phases in `docs/migration-plan.md`; it does not change the current Cloudflare/Nitro frontend now.

## Hosting Assumptions To Confirm

- PHP version supported by the selected Laravel version.
- MySQL version and available database/user privileges.
- SSH access or cPanel Terminal availability.
- Composer availability; otherwise build dependencies locally and deploy `vendor` only if hosting policy permits.
- Node/npm availability on cPanel. If not available, build Vite assets in CI/local and upload `public/build`.
- Ability to set the domain document root to Laravel `public/`.
- Cron job support at one-minute or five-minute intervals.
- Queue worker support. Shared hosting may require database queue plus cron instead of a daemon.
- Mail SMTP credentials and outbound mail policy.
- Storage capacity and upload limits for project/media/CV assets.

## Recommended Production Layout

Preferred layout when the domain document root can be changed:

```text
/home/CPANEL_USER/
├── larz-app/                 # Laravel project, not directly public
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/
│   ├── vendor/
│   └── .env
└── public_html/              # document root
    ├── index.php             # points to ../larz-app/public/index.php or is Laravel public/
    ├── build/
    ├── storage -> ../larz-app/storage/app/public
    └── .htaccess
```

Preferred deployment is to set the domain document root directly to `/home/CPANEL_USER/larz-app/public`, avoiding a hand-maintained copied `index.php`.

If the host cannot change the document root, use a carefully reviewed public_html bridge. Do not expose `.env`, `vendor`, `storage/app`, source files, or migration files.

## Build And Release Process

### Local/CI build

1. Run frontend type/lint checks.
2. Run PHP tests and Laravel static checks after Laravel exists.
3. Run `npm ci` or the approved package manager.
4. Run `npm run build` to generate `public/build`.
5. Run `composer install --no-dev --prefer-dist --optimize-autoloader` for production dependencies.
6. Create a release archive containing application source, `vendor`, and `public/build`, excluding local secrets and development artifacts.

### cPanel release

1. Upload a versioned release directory outside the document root.
2. Copy or symlink the approved `.env` configuration into the release.
3. Run database migrations using a controlled maintenance window or deployment script.
4. Run seeders only for explicitly approved idempotent seeders; never run destructive demo seeders in production.
5. Link storage with `php artisan storage:link` if symlinks are allowed.
6. Run `php artisan optimize` or the individual config/route/view cache commands.
7. Switch the `current` symlink or document root to the new release.
8. Run smoke tests.
9. Keep the previous release available for rollback.

## Required Environment Variables

Minimum production settings to define in `.env`:

```text
APP_NAME=LARZ
APP_ENV=production
APP_KEY=...
APP_DEBUG=false
APP_URL=https://example.com

LOG_CHANNEL=stack
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=...
DB_USERNAME=...
DB_PASSWORD=...

SESSION_DRIVER=database
SESSION_DOMAIN=...
SESSION_SECURE_COOKIE=true

CACHE_STORE=database
QUEUE_CONNECTION=database

FILESYSTEM_DISK=public

MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=...
MAIL_FROM_NAME="LARZ Developments"
```

Additional values may include WhatsApp number, analytics IDs, map provider key, media disk credentials, and monitoring DSN. Secrets must never be committed.

## Apache And Rewrite Requirements

- `public/.htaccess` must route all non-file requests to `public/index.php`.
- `mod_rewrite` must be enabled.
- PHP must be configured with required extensions: PDO MySQL, mbstring, XML, ctype, JSON, fileinfo, tokenizer, OpenSSL, curl, and GD/Imagick if image transformations are used.
- Set upload limits sufficient for approved media/CV files, but enforce Laravel validation limits independently.
- Configure HTTPS redirect at Apache/cPanel level.

## Storage And Media

- Public website images may use `storage/app/public` with `storage:link`.
- CVs and private lead attachments must use a private disk outside direct web access.
- Use stable media IDs/paths, not source import filenames.
- Generate thumbnails and responsive variants during upload or queue processing.
- Restrict executable file types and inspect uploaded files.
- Schedule orphan media detection rather than automatically deleting referenced files.

## Cron And Queues

### Scheduler

Configure cPanel Cron:

```text
* * * * * cd /home/CPANEL_USER/larz-app && php artisan schedule:run >> /dev/null 2>&1
```

Use the scheduler for:

- Scheduled publishing.
- Newsletter processing.
- Notification retries.
- Cleanup/retention.
- Orphan media reports.

### Queue

Preferred shared-hosting approach:

- `QUEUE_CONNECTION=database`.
- Cron every minute:

```text
* * * * * cd /home/CPANEL_USER/larz-app && php artisan queue:work --stop-when-empty --tries=3 --timeout=90 >> storage/logs/queue.log 2>&1
```

If cPanel supports a persistent worker, use Supervisor or the host’s application manager instead. Do not assume Supervisor exists on shared hosting.

## Database Operations

- Create a dedicated MySQL database/user with least privilege.
- Use UTF-8/`utf8mb4` and an appropriate collation.
- Run migrations before application cutover.
- Import current content through idempotent seed/import commands.
- Back up before every production migration batch.
- Test restore into a separate database monthly.
- Never run `migrate:fresh` or destructive seeders in production.

## Cache And Optimization

After configuration is correct:

```text
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Use `php artisan optimize:clear` during rollback or when changing environment/configuration. Do not cache config before `.env` is final.

## Security Checklist

- `APP_DEBUG=false`.
- `.env`, `vendor`, source, storage private files, and database exports inaccessible from the web.
- HTTPS and secure cookies enabled.
- Laravel CSRF enabled.
- Login rate limiting and password reset mail tested.
- Admin routes protected by auth, role middleware, and policies.
- CV and inquiry downloads authorization-checked and logged.
- File upload MIME/size/content validation active.
- Database user has only required privileges.
- cPanel backups and offsite backup policy active.
- Error messages do not expose stack traces or SQL.

## Smoke Tests After Deployment

### Public

- `/`, `/about`, `/projects`, `/projects/{slug}`, `/contact`, `/careers`, `/careers/{slug}`, `/media`.
- Header desktop and mobile menu.
- Footer links and contact links.
- Every approved screenshot viewport.
- Images, fonts, carousel autoplay/manual controls, virtual tour modal, WhatsApp link.
- 404 behavior and unpublished content behavior.

### Forms

- Contact inquiry validation and persistence.
- Project inquiry and brochure request association.
- Newsletter duplicate/consent handling.
- Job/internship/general CV upload security and admin visibility.
- Notification queue and failure retry.

### CMS

- Login/logout/password reset.
- Role restrictions for each module.
- Draft/review/publish/archive transitions.
- Media upload, alt text, ordering, and deletion safeguards.
- Activity log entries.
- SEO updates and public output.

## Rollback

1. Stop scheduled deployment changes if possible.
2. Switch document root/current release to previous release.
3. Restore previous `public/build` if asset manifest changed.
4. Do not automatically roll back database migrations; use a documented backward migration or restore a verified database backup only after impact assessment.
5. Record failed release, migration batch, logs, and user-facing impact.
6. Keep the old TanStack frontend artifact available until the Laravel migration is fully accepted.

## cPanel-Specific Unresolved Questions

- Can the domain document root be set to Laravel `public/`?
- Which PHP/Laravel versions are supported?
- Is SSH/Terminal available for Composer and Artisan?
- Are symlinks allowed for `storage:link`?
- Is a persistent queue worker available, or must database queues run by cron?
- What are MySQL size, connection, and backup limits?
- What SMTP provider and sender domain will be used?
- Are server-side image tools such as GD or Imagick installed?
- Is there a staging subdomain and separate database available?
