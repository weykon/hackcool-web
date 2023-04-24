create table hackcool_users { 
    id uuid references auth.users not null primary key,
    username text,
    avatar_url text
};

alter table hackcool_users enable row level security;
create policy "Can view own user data." on hackcool_users for select using (auth.uid() = id);
create policy "Can update own user data." on hackcool_users for update using (auth.uid() = id);

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.hackcool_users (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();