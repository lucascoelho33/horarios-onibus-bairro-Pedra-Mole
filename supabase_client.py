import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv('.env.local')

supabase_url = os.getenv('SUPABASE_URL')
supabase_anon_key = os.getenv('SUPABASE_ANON_KEY')

#---------- PRINT TEMPORÁRIO PARA DEBUG--------
print(f"URL lida: {supabase_url}")
print(f"Chave lida (primeiros 30 caracteres): {supabase_anon_key[:30] if supabase_anon_key else 'NÃO'
' ENCONTRADA'}")
#-----------------------------------------------

if not supabase_url or not supabase_anon_key:
    raise EnvironmentError(
        "SUPABASE_URL e SUPABASE_ANON_KEY precisam ser definidos no arquivo .env.local!"
    )

supabase: Client = create_client(supabase_url, supabase_anon_key)