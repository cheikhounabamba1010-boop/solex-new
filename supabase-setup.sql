-- À exécuter UNE SEULE FOIS dans Supabase : SQL Editor -> New query -> Run

-- 1) Table qui contient toutes les données du site (produits, devis, réglages, admin)
create table if not exists public.solex_store (
  id         integer primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- Sécurité : aucun accès public. Seul le serveur (clé service_role) peut lire/écrire.
alter table public.solex_store enable row level security;

-- 2) Bucket public pour les images envoyées depuis l'admin
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;
