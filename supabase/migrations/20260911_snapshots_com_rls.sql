-- =============================================================================
-- Orlando 2026 — Fase 6, etapa 1
-- Aplicada em 11/09/2026 no projeto orlando-2026 (ref ahpuqxztdbfzfdrqsomy, sa-east-1).
--
-- Espelho do estado local dos dois celulares. Uma linha por aparelho: cada um dá
-- upsert só na própria linha e lê as dos outros. O merge campo a campo continua
-- acontecendo no cliente, em js/estado.js — aqui não há resolução de conflito.
-- =============================================================================

create table if not exists public.snapshots (
  user_id       uuid        not null references auth.users (id) on delete cascade,
  dispositivo   text        not null check (char_length(dispositivo) between 3 and 64),
  estado        jsonb       not null check (jsonb_typeof(estado) = 'object'),
  atualizado_em timestamptz not null default now(),
  primary key (user_id, dispositivo)
);

comment on table public.snapshots is
  'Espelho do estado local do app Orlando 2026. Uma linha por aparelho. O grupo pessoais (apólice do seguro) nunca sobe: o cliente filtra antes de enviar.';

create index if not exists snapshots_por_usuario
  on public.snapshots (user_id, atualizado_em desc);

-- search_path travado: função de trigger com search_path mutável é achado de segurança.
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists snapshots_tocar on public.snapshots;
create trigger snapshots_tocar
  before update on public.snapshots
  for each row execute function public.tocar_atualizado_em();

alter table public.snapshots enable row level security;

drop policy if exists "ler o proprio estado" on public.snapshots;
drop policy if exists "inserir o proprio estado" on public.snapshots;
drop policy if exists "atualizar o proprio estado" on public.snapshots;
drop policy if exists "apagar o proprio estado" on public.snapshots;

create policy "ler o proprio estado" on public.snapshots
  for select to authenticated using (auth.uid() = user_id);

create policy "inserir o proprio estado" on public.snapshots
  for insert to authenticated with check (auth.uid() = user_id);

create policy "atualizar o proprio estado" on public.snapshots
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "apagar o proprio estado" on public.snapshots
  for delete to authenticated using (auth.uid() = user_id);

-- Conferido em 11/09/2026, com a chave publicável e sem sessão:
--   GET  /rest/v1/snapshots  -> 200 []            (RLS não devolve linha nenhuma)
--   POST /rest/v1/snapshots  -> 401, 42501        (new row violates row-level security)
