CREATE TABLE IF NOT EXISTS installs(id TEXT PRIMARY KEY, first_seen TEXT, last_seen TEXT, first_version TEXT, version TEXT, country TEXT, os TEXT, gpu TEXT, screens TEXT, pings INTEGER DEFAULT 0);
CREATE TABLE IF NOT EXISTS events(ts TEXT, day TEXT, id TEXT, version TEXT, country TEXT, kind TEXT, data TEXT);
CREATE INDEX IF NOT EXISTS events_day ON events(day);
CREATE TABLE IF NOT EXISTS checks(day TEXT, version TEXT, country TEXT, n INTEGER DEFAULT 0, PRIMARY KEY(day, version, country));
CREATE TABLE IF NOT EXISTS downloads(ts TEXT, day TEXT, version TEXT, country TEXT, city TEXT, ua TEXT, ref TEXT, visitor TEXT, kind TEXT, org TEXT);
CREATE TABLE IF NOT EXISTS kv(k TEXT PRIMARY KEY, v TEXT);
