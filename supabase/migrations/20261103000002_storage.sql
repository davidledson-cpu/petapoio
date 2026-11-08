-- Buckets de arquivos
--   avatars        público  — fotos dos psicólogos       (pasta = id do psicólogo)
--   documents      privado  — CRP e documentos de verificação (pasta = id do psicólogo)
--   products       público  — fotos dos produtos da loja (só admin envia)
--   order-uploads  privado  — fotos enviadas para personalizar pedidos

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', false, 10485760, array['image/jpeg', 'image/png', 'application/pdf']),
  ('products', 'products', true, 8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('order-uploads', 'order-uploads', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
on conflict (id) do nothing;

-- Foto do psicólogo: cada um escreve só na própria pasta.
create policy avatars_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_owner_update on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Documentos: o dono envia e lê; admin lê. Ninguém mais.
create policy documents_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy documents_owner_read on storage.objects for select to authenticated
  using (bucket_id = 'documents' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- Produtos: só admin gerencia.
create policy products_admin_write on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and public.is_admin());
create policy products_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'products' and public.is_admin());
create policy products_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'products' and public.is_admin());

-- Fotos de personalização: o envio é feito pelo servidor (service_role) com URL assinada;
-- leitura só pela administração.
create policy order_uploads_admin_read on storage.objects for select to authenticated
  using (bucket_id = 'order-uploads' and public.is_admin());
