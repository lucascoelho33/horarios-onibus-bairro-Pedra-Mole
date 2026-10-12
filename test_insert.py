from inserir_registro import cadastrar_registro

if __name__ == "__main__":
    print("Executando Smoke Test de persistência...")

    # Substitua os campos abaixo pelos da sua tabela real
    teste = cadastrar_registro({
        "tipo_dia": "dia_util",
        "linha_codigo": "501"
    })

    print("Resultado:", teste)

    if teste["sucesso"]:
        print("[OK] Sucesso! Abra o Table Editor do Supabase para conferir a nova linha.")
    else:
        print(f"[ERRO] Falha na persistência: {teste['erro']}")