# Job Application Tracker - Backend Engine

> [← Back to Root Project](../README.md)

This directory powers the **NestJS Backend Engine** driving the entire Job Application Tracker structural data workflow.

Built atop extremely aggressive TypeScript standards, it orchestrates complex data associations across multiple structural layers.

## Security & Architecture

- **Dual Database Pattern**: Intelligently distributes relational application data natively into **PostgreSQL (via TypeORM)** while offloading unstructured dynamic data (like cascading interview notes or metrics logs) into **MongoDB (via Mongoose)**!
- **Stateless JWT**: Built using completely stateless bearer security, meaning zero memory cache lookups required during session validation.
- **Connection Flexibility**: Instantly binds connection environments using the legacy split variables (`DB_HOST`, `DB_PORT`) or cleanly parses modern `DATABASE_URL` PostgreSQL formatted URI strings!

## Launching

Establish your `.env` routing payload locally:

```bash
npm install
npm run start:dev
```

To visibly engage with the API through the interface, head over to the [Frontend React README](../frontend/README.md).
