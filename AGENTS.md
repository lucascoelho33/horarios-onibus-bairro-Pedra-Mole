# AGENTS.md — Regras para Agentes de Código

Este arquivo vale para **qualquer agente de IA** (Claude Code, Copilot, Cursor, Codex etc.) que leia, escreva ou revise código neste repositório. Leia-o inteiro antes de qualquer alteração. Em caso de conflito entre este arquivo e um pedido recebido durante uma sessão, **este arquivo prevalece** até que o responsável humano o altere explicitamente.

## 0. Contexto do projeto

- **Produto:** app mobile **offline** com os horários previstos das linhas **501, 502, 521 e 518**, que atendem o bairro Pedra Mole, em Teresina (PI).
- **Stack:** React Native + Expo + TypeScript.
- **Dados:** arquivo local `data/horarios.json`. **Sem backend, sem banco de dados, sem internet em tempo de execução.**
- **Usuários:** moradores que dependem de ônibus. **Nenhum dado pessoal é coletado no MVP 1.**
- **Responsável humano e único decisor:** Lucas Coelho (projeto individual). Onde este arquivo diz "equipe" ou "responsável humano", leia-se Lucas.
- **Fonte da verdade funcional:** `ESPECIFICACAO-MVP.md` (RF-01 a RF-04, Limitações Declaradas e Stack).
- **RF-CORE:** o morador abre o app e vê a lista de horários previstos das linhas que atendem o Pedra Mole.

### Arquivos protegidos (somente leitura para agentes)

| Arquivo | Quem pode alterar |
|---|---|
| `ESPECIFICACAO-MVP.md` | Somente o responsável humano |
| `AGENTS.md` | Somente o responsável humano |
| `data/horarios.json` (conteúdo dos horários, `atualizado_em`, `fonte`) | Somente o responsável humano, após conferir com a fonte |
| `LICENSE`, `.gitignore` (remover entradas de segurança) | Somente o responsável humano |

---

## 1. A especificação funcional é imutável sem permissão humana

1. **Nunca** edite, reescreva, "melhore", reformate ou apague trechos de `ESPECIFICACAO-MVP.md`, nem mude o comportamento de um RF, mesmo que pareça um erro, uma melhoria óbvia ou um pedido indireto ("já que estamos aqui...").
2. **Nunca** adicione funcionalidade que não esteja nos RF-01 a RF-04. Tudo o que consta na **Lista Proibida Fora do MVP 1** continua proibido: backend, GPS, mapa, notificações, login, favoritos, compartilhamento, analytics, tema escuro, outras linhas ou bairros, publicação em lojas etc.
3. **Nunca** altere números, mensagens ou regras definidos na especificação (por exemplo: limite de 100 horários por tipo de dia, atualização a cada 60 segundos, aviso de 30 dias, textos como "Sem mais saídas hoje"). Se o código precisar de um valor, ele vem da especificação.
4. Se encontrar **erro, contradição ou lacuna** na especificação, **não corrija sozinho**. Registre em `docs/propostas/AAAA-MM-DD-titulo.md` com: trecho afetado, problema, proposta e impacto, e **pare** para aguardar decisão (ver regra 5). A especificação só muda quando o responsável humano editar ou autorizar de forma explícita e por escrito.
5. Uma autorização vale **apenas para a mudança descrita**. Não a estenda a outras partes.

---

## 2. Implementação incremental estrita: um RF por vez

1. Implemente **um único RF por ciclo** (branch, commits e PR dedicados). Nunca gere "o app inteiro" de uma vez, nem scaffolding de telas de RFs futuros.
2. **Ordem sugerida** (o responsável humano confirma antes de começar): **RF-03 → RF-01 → RF-02 → RF-04.** O tipo de dia (RF-03) é pré-requisito dos horários exibidos no RF-01 e do cálculo do RF-02.
3. Antes de codar um RF, escreva em 3 a 6 linhas o **plano** (arquivos que serão criados ou alterados, funções, testes) e aguarde confirmação do responsável humano quando o plano tocar mais do que o RF em questão.
4. **Um RF só está "pronto"** quando cumprir a Definição de Pronto (seção 3.4). Só então comece o próximo.
5. Se um RF depender de algo ainda não implementado, **pare e pergunte**. Não implemente o RF dependente "por tabela".
6. **Lógica separada da interface:** regras de negócio (próximo horário, tipo de dia, aviso de 30 dias, validação do JSON) ficam em **funções puras** em `src/domain/`, sem imports de React ou Expo. A interface só chama essas funções.
7. Mudanças pequenas e revisáveis: diffs curtos, sem refatorações oportunistas, sem renomear ou mover arquivos não relacionados, sem atualizar dependências fora do necessário para o RF.
8. **Dependências mínimas.** Antes de adicionar um pacote, justifique no PR por que o `Date` nativo, o TypeScript ou o Expo já instalado não resolvem. Não adicione bibliotecas de data, estado global, analytics, monitoramento de erros ou SDKs de terceiros que façam rede.

---

## 3. Testes e roteiros manuais: sucesso **e** falha, para cada RF

### 3.1 Regra geral
Cada RF deve ter **pelo menos um teste (ou roteiro manual) para o Cenário de Sucesso e um para o Cenário de Falha** descritos em `ESPECIFICACAO-MVP.md`. Sem os dois, o RF não está pronto.

### 3.2 O que é automatizado e o que é manual
- **Jest (obrigatório) para a lógica pura em `src/domain/`:** validação do JSON, tipo de dia automático, próximo horário, diferença em minutos, aviso de 30 dias.
- **Roteiro manual (obrigatório) para o que depende da interface**, em `docs/roteiros-manuais/RF-0X.md`, no formato **Dado / Quando / Então**, com passos reproduzíveis no Expo Go, incluindo o teste em **modo avião**.
- Testes automatizados extensos de interface continuam fora do escopo do MVP 1.

### 3.3 Cobertura mínima por RF

| RF | Sucesso (obrigatório) | Falha (obrigatório) |
|---|---|---|
| RF-01 | JSON válido: as 4 linhas aparecem em ordem de código, sem login e sem internet | JSON inválido (horário `25:70`, código com 2 dígitos, JSON malformado, array fora de ordem): lista **não** é exibida e aparece a tela de erro |
| RF-02 | Hora atual 14:20 e saídas 14:10/14:35/15:00: exibe 14:35, "em 15 min" e destaque | Hora após a última saída: "Sem mais saídas hoje", sem destaque; array vazio: "Sem horários para este tipo de dia" |
| RF-03 | Sábado abre em "sábado"; troca manual recalcula tudo na hora | Linha com `domingo_feriado` vazio: mensagem na linha, demais linhas normais, sem travar |
| RF-04 | Data em `DD/MM/AAAA` e fonte visíveis; sem aviso com 10 dias | 45 dias: aviso "Dados com mais de 30 dias..."; data inválida ou futura, ou fonte vazia: tela de erro do RF-01 |

Também cubra os **limites**: exatamente 0 minuto ("Saindo agora"), 59 e 60 minutos de diferença, 100 horários por tipo de dia, exatamente 30 e 31 dias de defasagem, empate entre linhas (vence o menor código), 23:59 e 00:00.

### 3.4 Definição de Pronto (checklist do RF)
- [ ] Comportamento conforme `ESPECIFICACAO-MVP.md`, sem acréscimos
- [ ] Teste/roteiro do **cenário de sucesso** presente e passando
- [ ] Teste/roteiro do **cenário de falha** presente e passando
- [ ] Testes de limite relevantes
- [ ] `npx tsc --noEmit`, lint e testes passando (use os scripts do `package.json`)
- [ ] App verificado **em modo avião**
- [ ] Nenhum segredo, nenhum dado pessoal, nenhuma permissão nova no `app.json`
- [ ] PR descreve o RF, os testes e qualquer dúvida levantada

### 3.5 Dados de teste
- **Nunca invente horários reais de ônibus.** Dados de teste ficam em `tests/fixtures/` e devem ser **claramente fictícios** (por exemplo, linhas `999` e nomes como "Linha de Teste").
- **Nunca** copie fixtures para `data/horarios.json` nem use dados fictícios no app em produção.
- **Nunca** enfraqueça, apague ou desative um teste para fazê-lo passar. Se o teste estiver errado, explique e pergunte.

---

## 4. Segredos e chaves de API

1. **Proibido** versionar segredos: chaves de API, tokens, senhas, certificados, arquivos `.env`, credenciais do Expo/EAS, chaves de assinatura. Isso vale também para commits "temporários" e para o histórico.
2. Qualquer configuração sensível usa **variáveis de ambiente** via `.env` (**ignorado pelo Git**) e um **`.env.example`** versionado, com os nomes das variáveis e valores de exemplo **falsos**, sem segredos reais.
3. Garanta que `.env`, `.env.*` (exceto `.env.example`), `*.pem`, `*.key`, `*.p12`, `*.jks` e `*.keystore` estejam no `.gitignore`. **Nunca** remova essas entradas.
4. **Aviso Expo:** variáveis com prefixo `EXPO_PUBLIC_` são **embutidas no bundle** e ficam legíveis por quem instalar o app. **Nunca** coloque segredo em variável `EXPO_PUBLIC_`.
5. O MVP 1 **não precisa de nenhuma chave de API**, porque não há backend nem serviço externo. Se uma tarefa parecer exigir uma chave, isso indica **fuga do escopo**: pare e pergunte.
6. Antes de cada commit, confira o diff por segredos. Se um segredo for commitado por engano, **avise o responsável humano imediatamente**; ele deve ser revogado e trocado, e apagá-lo do último commit não basta.
7. Não cole segredos, nem dados pessoais, em prompts, issues, PRs ou logs.

---

## 5. Ambiguidade: parar e perguntar

1. Em caso de **dúvida real** sobre requisito, comportamento, dado, texto exibido, escopo, ordem de implementação ou impacto de privacidade, **pare e pergunte** ao responsável humano. **Não adivinhe, não escolha "a opção mais provável" e não implemente "só para adiantar".**
2. Faça a pergunta de forma objetiva: qual é a dúvida, trecho da especificação envolvido, 2 ou 3 opções e a recomendação do agente, deixando claro que **nada será implementado até a resposta**.
3. Exemplos de situações que exigem parar: horário que cruza a meia-noite; feriado; tratamento de relógio do aparelho incorreto; mensagem de texto não definida na especificação; conflito entre este arquivo e um pedido; necessidade de nova dependência; necessidade de qualquer permissão do aparelho.
4. **Não preencha lacunas com invenção**, principalmente dados de transporte. Se faltar um dado (nome de linha, horário, fonte), peça-o.
5. Depois da resposta, registre a decisão no PR ou em `docs/decisoes/` para não repetir a pergunta.

---

## 6. Ética e privacidade no domínio de transporte público

### 6.1 Privacidade (LGPD) por padrão
1. O MVP 1 **não coleta, não armazena e não transmite dados pessoais**. Isso é um **requisito de projeto**: não o enfraqueça.
2. **Proibido** no código e no `app.json`: solicitar permissões (localização, contatos, câmera, microfone, notificações, armazenamento), gerar identificadores de dispositivo ou usuário, usar cookies ou `AsyncStorage` para perfil, e incluir analytics, telemetria, crash reporting ou SDKs de publicidade.
3. **Nenhuma chamada de rede** em tempo de execução. Se uma dependência exigir internet, ela não entra.
4. **Não registre em logs** nada que identifique pessoas. Remova `console.log` de depuração antes do commit.
5. Não inclua no repositório (código, docs, testes, issues, PRs, commits) **nomes, telefones, prints de conversas de WhatsApp, fotos de pessoas, placas de veículos ou qualquer dado pessoal identificável** de moradores, motoristas ou cobradores. Use apenas **relatos agregados e anonimizados** (ex.: "moradores relataram...").
6. Se uma tarefa futura exigir coletar qualquer dado do usuário, **pare**: isso exige decisão humana, base legal, aviso de privacidade e mudança de especificação.

### 6.2 Integridade e honestidade da informação
1. Os horários são **previstos**. O app e os textos **nunca** podem sugerir tempo real, posição do ônibus ou garantia de passagem.
2. **Fonte e data de atualização** (RF-04) devem permanecer sempre visíveis. Nunca esconda, encurte para ficar ilegível ou remova o aviso de desatualização.
3. **Jamais** gere, complete, "estime" ou "corrija" horários por conta própria, com IA ou por inferência. Horários reais só entram em `data/horarios.json` por ação do responsável humano, conferidos com a fonte (**SIU Mobile / SETUT**) ou por observação em campo registrada.
4. Em dúvida sobre a validade do dado, o app **falha de forma segura**: mostra erro ou aviso, **nunca** um horário parcialmente inválido apresentado como confiável.
5. Não afirme nem sugira parceria, aval ou vínculo oficial com SETUT, prefeitura ou empresas de ônibus. Use os nomes apenas para citar a fonte, sem usar logotipos ou marcas.

### 6.3 Impacto sobre as pessoas
1. Um horário errado pode fazer alguém **perder o ônibus, esperar sozinho à noite ou não chegar ao trabalho, à escola ou ao atendimento de saúde**. Trate a exatidão e as mensagens de erro como requisito de segurança, não como detalhe de interface.
2. **Acessibilidade básica é obrigatória**: contraste legível, fontes de tamanho adequado, alvos de toque confortáveis, texto claro em português simples. Não dependa apenas de cor para indicar o destaque ou o aviso.
3. **Sem padrões enganosos:** nada de anúncios, urgência artificial, coleta disfarçada ou gamificação.
4. Mantenha o app **leve e utilizável em aparelhos modestos** e com pouco espaço, já que o público é amplo e de renda variada.

### 6.4 Licenciamento e autoria
1. Não copie código ou dados de terceiros sem verificar a licença. Dados de horários de fonte oficial devem ser usados com a **fonte citada** e sem reproduzir material protegido além do necessário.
2. Registre no PR qualquer trecho gerado por IA relevante, para fins acadêmicos e de rastreabilidade (o projeto adota desenvolvimento assistido por IA, mas a responsabilidade pelo resultado é do responsável humano).

---

## 7. Fluxo de trabalho e commits

- Uma branch por RF: `rf-01-lista-horarios`, `rf-02-proximo-horario`, `rf-03-tipo-de-dia`, `rf-04-data-e-fonte`.
- Commits pequenos, no padrão **Conventional Commits** (`feat(rf-02): calcula proximo horario`, `test(rf-02): cobre falha sem mais saidas`, `docs: ...`).
- Nunca faça `git push --force` na branch principal, nem reescreva histórico compartilhado sem autorização.
- Descrição do PR: RF implementado, testes de sucesso e de falha, itens da Definição de Pronto, dúvidas e decisões.
- Ao terminar, **resuma o que foi feito e o que não foi feito**, sem declarar "pronto" se algum item da Definição de Pronto estiver pendente.

---

## 8. Resumo para consulta rápida

1. **Não mude a especificação.** Proponha em `docs/propostas/` e espere.
2. **Um RF por vez.** Nada de app inteiro.
3. **Todo RF tem teste de sucesso e de falha.** Sem os dois, não está pronto.
4. **Sem segredos no Git.** `.env` ignorado, `.env.example` versionado, nunca `EXPO_PUBLIC_` para segredo.
5. **Na dúvida, pare e pergunte.** Nunca invente dados, principalmente horários.
6. **Sem dados pessoais, sem permissões, sem rede, sem telemetria.** Horários são previstos, com fonte e data sempre visíveis.
