ESPECIFICAÇÃO DO MVP 1 — Horários de Ônibus do Pedra Mole
> Painel mobile offline com os horários previstos das linhas **501, 502, 521 e 518**, que atendem o bairro Pedra Mole, em Teresina (PI).
> Fonte dos dados: **SIU Mobile / SETUT**.
RF-CORE: o morador abre o app e vê a lista de horários previstos das linhas que atendem o Pedra Mole.
---
0. Convenções deste documento
Ator "Morador": usuário final, opera o app. Não há login nem perfil.
Ator "Mantenedor": integrante da equipe que edita `data/horarios.json` no repositório. Atua fora do app, antes do build.
Sem banco de dados e sem backend. Onde o template pede "o que é salvo no banco", a resposta do MVP 1 é: nada é persistido em banco. Os dados vêm de um arquivo JSON empacotado no app, somente leitura.
Sem formulários de envio. O app só consulta. Por isso, as "Entradas" de cada RF são os campos do JSON e o relógio do aparelho, e os cenários de falha descrevem dados inválidos ou ausentes no carregamento, não envio de formulário.
Hora de referência: relógio local do aparelho (Teresina não adota horário de verão). Comparações são feitas em minutos inteiros desde 00:00.
0.1 Contrato do arquivo `data/horarios.json`
```json
{
  "atualizado_em": "AAAA-MM-DD",
  "fonte": "SIU Mobile / SETUT",
  "linhas": [
    {
      "codigo": "501",
      "nome": "<nome/itinerário da linha>",
      "horarios": {
        "dia_util": ["HH:MM"],
        "sabado": ["HH:MM"],
        "domingo_feriado": ["HH:MM"]
      }
    }
  ]
}
```
> Os valores acima são o **formato**, não dados reais. Os horários de cada linha devem ser levantados e conferidos com a fonte antes da semana 2.
Campo	Tipo	Formato aceito	Limite máximo
`atualizado_em`	string	`AAAA-MM-DD`, data real e não futura	10 caracteres
`fonte`	string	texto livre, não vazio	60 caracteres
`linhas`	array	exatamente as linhas 501, 502, 521 e 518, sem repetição	4 itens
`linhas[].codigo`	string	3 dígitos numéricos (`^\d{3}$`)	3 caracteres
`linhas[].nome`	string	texto livre, não vazio	60 caracteres
`linhas[].horarios.<tipo_de_dia>`	array de strings	`HH:MM`, 24h, `00:00` a `23:59`, ordem crescente, sem duplicatas	100 horários por tipo de dia
Um array de horários vazio é válido e significa "esta linha não opera neste tipo de dia".
---
RF-01 (CORE) — Listar os horários previstos das linhas do Pedra Mole
Ator: Morador.
Entradas
Entrada	Origem	Formato	Limite
Lista de linhas	`data/horarios.json` (empacotado no app)	conforme seção 0.1	4 linhas, 100 horários por linha e tipo de dia
Ação do usuário	abrir o app	nenhuma digitação	0 campos
Regras de Negócio
A lista é exibida na tela inicial, sem login, sem cadastro e sem conexão com a internet (0 interações para ver as linhas).
Cada linha exibe: código, nome e todos os horários do tipo de dia selecionado (ver RF-03).
As linhas aparecem em ordem crescente de código, de forma estável (a ordem não muda ao longo do dia).
O JSON é validado uma vez, na abertura, contra o contrato da seção 0.1. Se qualquer regra do contrato for violada, a lista não é exibida (nunca se mostra um dado parcialmente inválido como se fosse confiável).
Os horários são previstos. O app não afirma posição nem atraso do ônibus.
O app deve abrir e funcionar com o aparelho em modo avião.
Saída Observável
Tela: lista com as 4 linhas e seus horários. Em caso de falha de validação, tela de erro com a mensagem "Não foi possível carregar os horários. Reinstale ou atualize o aplicativo."
Persistência: nenhuma. Nada é gravado em banco, arquivo ou armazenamento local. O JSON é somente leitura.
Cenário de Sucesso (BDD)
Dado que o `horarios.json` empacotado cumpre o contrato e o aparelho está sem internet,
Quando o morador abre o app,
Então a tela inicial exibe as linhas 501, 502, 521 e 518 em ordem de código, cada uma com seus horários do tipo de dia atual, sem pedir login.
Cenário de Falha (BDD)
Dado que o `horarios.json` está inválido (por exemplo, um horário `25:70`, código com 2 dígitos ou JSON malformado),
Quando o app tenta carregar os dados na abertura,
Então a lista não é exibida e o app mostra a tela de erro "Não foi possível carregar os horários", sem exibir horários parciais.
---
RF-02 — Mostrar o próximo horário de cada linha
Ator: Morador.
Entradas
Entrada	Origem	Formato	Limite
Hora atual	relógio local do aparelho	minutos desde 00:00 (0 a 1439)	—
Horários da linha	`horarios.<tipo_de_dia>` selecionado	array `HH:MM` ordenado	100 itens
Regras de Negócio
Próximo horário = o primeiro horário do dia selecionado cujo valor em minutos seja maior ou igual à hora atual em minutos.
Diferença de 0 minuto é exibida como "Saindo agora". Diferença de 1 a 59 minutos: "em N min". Diferença de 60 minutos ou mais: "em XhYY" (ex.: "em 1h05").
Se não existir horário igual ou posterior ao atual no dia selecionado, a linha exibe "Sem mais saídas hoje".
Se o array do tipo de dia estiver vazio, a linha exibe "Sem horários para este tipo de dia".
Entre todas as linhas que têm próximo horário, a de menor diferença recebe o destaque visual. Em caso de empate, destaca-se a de menor código. Se nenhuma linha tiver próximo horário, nenhum destaque é exibido.
O cálculo é refeito a cada 60 segundos com o app aberto e sempre que o app volta ao primeiro plano.
O app usa a data e a hora do aparelho como verdade. Não há verificação de relógio incorreto (ver Limitações).
Saída Observável
Tela: em cada linha, o próximo horário e o tempo restante (ou a mensagem de "sem saídas"/"sem horários"), com uma linha destacada.
Persistência: nenhuma. O resultado é calculado em memória a cada atualização.
Cenário de Sucesso (BDD)
Dado que são 14:20 em dia útil e a linha 501 tem saídas às 14:10, 14:35 e 15:00,
Quando o morador está na tela inicial,
Então a linha 501 exibe "14:35 — em 15 min" e, se nenhuma outra linha sai antes, ela aparece em destaque.
Cenário de Falha (BDD)
Dado que são 23:50 e o último horário da linha 502 no dia selecionado é 22:40,
Quando o app recalcula os próximos horários,
Então a linha 502 exibe "Sem mais saídas hoje", não recebe destaque e não exibe nenhum horário passado como "próximo".
---
RF-03 — Alternar o tipo de dia
Ator: Morador.
Entradas
Entrada	Origem	Formato	Limite
Dia da semana atual	data local do aparelho	0 (domingo) a 6 (sábado)	—
Seleção manual	toque em seletor com 3 opções	`dia_util`, `sabado`, `domingo_feriado`	3 valores possíveis, sem digitação
Regras de Negócio
Ao abrir o app, o tipo de dia é escolhido automaticamente: segunda a sexta = `dia_util`; sábado = `sabado`; domingo = `domingo_feriado`.
O app não possui calendário de feriados. Em feriados, o morador deve selecionar manualmente "Domingo e feriado".
O seletor exibe sempre as 3 opções, com a opção ativa claramente indicada.
Ao trocar a opção, a lista (RF-01) e os próximos horários (RF-02) são recalculados imediatamente, sem recarregar o app.
A seleção manual vale apenas enquanto o app estiver aberto. Ao reabrir, volta a valer a regra automática (regra 1).
Se o aparelho cruzar a meia-noite com o app aberto e o morador não tiver feito seleção manual, o tipo de dia automático é reavaliado na próxima atualização de 60 segundos. Se houver seleção manual, ela é mantida.
Saída Observável
Tela: seletor com 3 opções, a opção ativa destacada, e a lista de linhas refletindo o tipo de dia selecionado.
Persistência: nenhuma. A escolha manual existe apenas em memória.
Cenário de Sucesso (BDD)
Dado que hoje é sábado e o app foi aberto,
Quando o morador toca em "Domingo e feriado",
Então o seletor passa a indicar "Domingo e feriado" e todas as linhas exibem os horários e os próximos horários desse tipo de dia imediatamente.
Cenário de Falha (BDD)
Dado que a linha 518 tem o array `domingo_feriado` vazio no JSON,
Quando o morador seleciona "Domingo e feriado",
Então a linha 518 exibe "Sem horários para este tipo de dia", as demais linhas continuam normais e o app não trava nem exibe tela de erro.
---
RF-04 — Exibir data de última atualização e fonte dos dados
Ator: Morador (consulta). O Mantenedor atualiza os campos no JSON antes do build.
Entradas
Entrada	Origem	Formato	Limite
`atualizado_em`	`data/horarios.json`	`AAAA-MM-DD`, não futura	10 caracteres
`fonte`	`data/horarios.json`	texto não vazio (valor esperado: "SIU Mobile / SETUT")	60 caracteres
Data atual	relógio local do aparelho	data	—
Regras de Negócio
A tela principal exibe, sempre visível sem rolagem para outra tela, o texto: "Horários atualizados em DD/MM/AAAA. Fonte: SIU Mobile / SETUT."
A data é exibida no formato brasileiro `DD/MM/AAAA`, convertida a partir de `AAAA-MM-DD`.
Aviso de desatualização: se a diferença entre a data atual e `atualizado_em` for maior que 30 dias, o app exibe junto à data o aviso "Dados com mais de 30 dias. Confirme no ponto antes de sair." O limite de 30 dias é uma constante única no código, fácil de ajustar.
Se `atualizado_em` estiver ausente, mal formatado ou for uma data futura, o JSON é considerado inválido (regra 4 do RF-01) e a lista não é exibida.
Se `fonte` estiver ausente ou vazio, o JSON é considerado inválido (regra 4 do RF-01).
A informação de data e fonte não pode ser ocultada nem escondida em menu.
Saída Observável
Tela: linha de texto com data e fonte na tela principal e, quando aplicável, o aviso de dados com mais de 30 dias.
Persistência: nenhuma.
Cenário de Sucesso (BDD)
Dado que o JSON tem `atualizado_em` igual a 10 dias antes da data atual e `fonte` igual a "SIU Mobile / SETUT",
Quando o morador abre o app,
Então a tela principal mostra "Horários atualizados em DD/MM/AAAA. Fonte: SIU Mobile / SETUT." sem nenhum aviso de desatualização.
Cenário de Falha (BDD)
Dado que o `atualizado_em` do JSON está 45 dias no passado,
Quando o morador abre o app,
Então o app continua exibindo os horários, mas apresenta junto à data o aviso "Dados com mais de 30 dias. Confirme no ponto antes de sair."
> Variante de falha de dados: se `atualizado_em` for `2026-13-45` ou `fonte` estiver vazia, vale o cenário de falha do RF-01 (tela de erro, sem lista).
---
Limitações Declaradas do MVP 1
Horários previstos, não em tempo real. O app não sabe onde o ônibus está, nem se houve atraso, desvio ou cancelamento.
Dados estáticos e empacotados. Para atualizar os horários é preciso editar o JSON e gerar um novo build ou nova publicação no Expo Go. Não há atualização remota.
Sem calendário de feriados. Feriados exigem seleção manual do tipo de dia (RF-03).
Depende do relógio do aparelho. Se a data ou a hora do aparelho estiver errada, os próximos horários e o aviso de desatualização estarão errados.
Viagens após a meia-noite. Horários são tratados dentro do dia selecionado, em formato `00:00` a `23:59`. Saídas de madrugada de uma linha que opera na virada do dia não são ligadas ao dia anterior.
Qualidade dos dados depende da fonte e da conferência humana. O app mostra data e fonte (RF-04), mas não verifica se a fonte está correta.
Escopo geográfico fixo. Apenas as linhas 501, 502, 521 e 518 e apenas o Pedra Mole. Não há planejamento de rota, mapa, paradas ou busca de outras linhas.
Sem medição automática. Não há analytics nem contador de uso. As 30 consultas do primeiro mês serão medidas por procedimento manual (feedback dos moradores), fora do código.
Sem conta e sem personalização. Não há favoritos, notificações, tema escuro, idioma além de pt-BR nem acessibilidade avançada. Mantêm-se apenas contraste e tamanho de fonte legíveis.
Distribuição restrita. Uso via Expo Go ou build interno. Não há publicação nas lojas.
Sem dados pessoais. O app não coleta nenhum dado do usuário, o que simplifica a conformidade com a LGPD, mas também impede qualquer personalização.
Tudo o que está na Lista Proibida Fora do MVP 1 permanece fora do escopo até a validação da hipótese.
---
Stack Tecnológica Inicial
Camada	Escolha	Observação
Aplicativo	React Native + Expo	Execução e testes no Expo Go durante o MVP
Linguagem	TypeScript (recomendado)	Ajuda a garantir o contrato do JSON; JavaScript também é aceitável
Dados	`data/horarios.json`, versionado no repositório e importado no bundle	Somente leitura, sem backend e sem banco de dados
Estado	estado local do React (`useState`/`useMemo`)	Nenhuma biblioteca de estado global; nada é persistido
Data e hora	objeto `Date` nativo	Sem bibliotecas de data no MVP 1
Validação dos dados	função pura que valida o JSON contra o contrato da seção 0.1	Executada na abertura do app e nos testes
Testes	Jest, apenas para a lógica pura (próximo horário, tipo de dia, aviso de 30 dias, validação do JSON)	Testes extensos de interface ficam para o MVP 2
Distribuição	Expo Go ou build interno	Sem publicação em lojas
Controle de versão	Git, com o JSON e este documento versionados	Cada atualização de horários registra data e fonte no histórico
Princípio de arquitetura: toda a regra de negócio (RF-02, RF-03, RF-04 e validação do RF-01) fica em funções puras, separadas da interface. Assim, ela pode ser testada sem o aparelho e trocada sem reescrever as telas quando o MVP 2 tiver backend.