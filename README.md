# Postgres Sandbox

PostgreSQL(PostGIS)をDockerで起動して、動作検証を行うための環境。

## 起動

```bash
pnpm start
```

## psql ログイン

```bash
pnpm psql
```

## PostGIS を有効にする

```bash
CREATE EXTENSION IF NOT EXISTS postgis;
```

