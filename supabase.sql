-- Cole tudo no SQL Editor do Supabase e clique em RUN
create table if not exists lb (
  id text primary key,
  k  text not null,
  n  text, w int default 0, g int default 0, a int default 0, f text
);
alter table lb enable row level security;

create or replace view ranking as
  select id, n, w, g, a, f from lb order by w desc limit 50;
grant select on ranking to anon;

create or replace function submit(p_id text, p_k text, p_n text, p_w int, p_g int, p_a int, p_f text)
returns void language plpgsql security definer as $$
begin
  insert into lb(id,k,n,w,g,a,f)
  values (p_id, p_k, left(p_n,16), p_w, p_g, p_a, left(coalesce(p_f,''),2))
  on conflict (id) do update
    set n=excluded.n, w=excluded.w, g=excluded.g, a=excluded.a, f=excluded.f
    where lb.k = p_k;
end $$;
grant execute on function submit(text,text,text,int,int,int,text) to anon;
