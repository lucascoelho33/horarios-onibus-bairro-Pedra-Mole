from supabase_client import supabase

def cadastrar_registro(dados: dict) -> dict:
    """Insere um registro na tabela do MVP com tratamento defensivo."""
    try:
        # Validação prévia (Fail Fast)
        if not dados or len(dados) == 0:
            return {"sucesso": False, "erro": "Os dados não podem estar vazios."}

        # Inserção na tabela (substitua 'consultas_horarios' pelo nome exato da sua tabela)
        response = supabase.table("consultas_horarios").insert(dados).execute()

        return {"sucesso": True, "dados": response.data}

    except Exception as e:
        print(f"[Erro Supabase Python]: {e}")
        return {"sucesso": False, "erro": str(e)}