-- RPC-Funktion um Vault-Secrets server-seitig abzurufen
-- Muss mit SECURITY DEFINER laufen damit der Service-Role-Key Zugriff hat
CREATE OR REPLACE FUNCTION get_vault_secret(secret_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  secret_value TEXT;
BEGIN
  SELECT decrypted_secret INTO secret_value
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;

  RETURN secret_value;
END;
$$;

-- Nur Service Role darf aufrufen
REVOKE ALL ON FUNCTION get_vault_secret FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_vault_secret TO service_role;
