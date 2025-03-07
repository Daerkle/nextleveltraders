-- Aktiviere RLS für die Tabellen
alter table watchlists enable row level security;
alter table watchlist_items enable row level security;

-- Lösche existierende Policies
drop policy if exists "Enable insert for authenticated users" on watchlists;
drop policy if exists "Enable select for authenticated users" on watchlists;
drop policy if exists "Enable update for authenticated users" on watchlists;
drop policy if exists "Enable delete for authenticated users" on watchlists;

drop policy if exists "Enable insert for authenticated users" on watchlist_items;
drop policy if exists "Enable select for authenticated users" on watchlist_items;
drop policy if exists "Enable delete for authenticated users" on watchlist_items;

-- Erstelle neue Policies für Watchlists
create policy "Enable all access for anonymous users"
  on watchlists
  for all
  using (true)
  with check (true);

-- Erstelle neue Policies für Watchlist Items
create policy "Enable all access for anonymous users"
  on watchlist_items
  for all
  using (true)
  with check (true);

-- Gib Rechte für den anon Benutzer
grant all privileges on table watchlists to anon;
grant all privileges on table watchlist_items to anon;