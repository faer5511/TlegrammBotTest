# Security policy

## Privacy-first approach

This project intentionally avoids collecting personal data. The bot does not ask for names, phone numbers, email addresses, passport data, or files.

## Secrets

- Telegram bot tokens must be kept in a local `.env` file.
- `.env` files are listed in `.gitignore` and must never be committed to GitHub.
- Tokens should be rotated if they become exposed.

## Session handling

- The bot works with temporary in-memory session data only.
- Session data is cleared when the user resets or the process restarts.
- Logs should never contain raw user identity data.

## Recommendations

- Restrict the bot to your own chat IDs when running in production.
- Disable public access to the bot if it is not required.
- Review logs before publishing to GitHub.
