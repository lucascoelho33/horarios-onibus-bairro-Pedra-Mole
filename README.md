# Ônibus Pedra Mole — Horários das linhas que atendem o bairro

Painel mobile simples com os horários previstos das linhas de ônibus
que atendem o bairro Pedra Mole, em Teresina (PI).

## 1. Contexto e Dor Real

### 1.1 O problema

Hoje, o morador do Pedra Mole que depende de ônibus não tem uma fonte
confiável e centralizada de horários. A informação chega por grupos de
WhatsApp desatualizados, por placas ilegíveis ou ausentes nos pontos,
ou por perguntas a vizinhos. O resultado é imprevisibilidade: a pessoa
sai de casa sem saber se o ônibus passou, se vai passar ou quando.

### 1.2 Evidências da dor

- Informação desatualizada ou conflitante entre fontes (WhatsApp, placas, boca a boca)
- Placas ilegíveis ou ausentes nos pontos do bairro
- Dependência de terceiros para saber o horário
- Falta de uma referência única e confiável para consulta rápida

**Nota LGPD:** este projeto não coleta, armazena ou compartilha dados
pessoais identificáveis. Nenhum nome, telefone, foto ou print de conversa
é usado. Os relatos são agregados e anonimizados.

### 1.3 Público-alvo

Moradores do bairro Pedra Mole, em Teresina (PI), que dependem do
transporte público no dia a dia — trabalhadores, estudantes e famílias.

### 1.4 Hipótese e métrica de sucesso

- **Hipótese:** uma lista simples, confiável e offline de horários
  substitui os canais informais (WhatsApp, placas, boca a boca).
- **Métrica inicial:** 30 consultas de moradores no primeiro mês.
- **Como será medida:** contagem manual com moradores voluntários e
  formulário simples de feedback presencial.

## 2. Solução

### 2.1 Visão geral

Aplicativo mobile (React Native + Expo) que exibe os horários previstos
das linhas que atendem o Pedra Mole, a partir de dados em JSON local,
sem backend e sem banco de dados no MVP 1.

### 2.2 RF-CORE

Visualizar os horários previstos das linhas que atendem o Pedra Mole.

### 2.3 Requisitos funcionais do MVP 1

| ID | Requisito | Critério de aceite |
|---|---|---|
| RF-01 (CORE) | Listar os horários previstos das linhas que passam no Pedra Mole, lidos de um JSON local | Ao abrir o app, a lista aparece em até 2 telas de interação, sem login e sem internet |
| RF-02 | Mostrar o próximo horário de cada linha com base na hora atual do aparelho | A linha com saída mais próxima aparece em destaque; passou da última saída, mostra "sem mais saídas hoje" |
| RF-03 | Alternar o tipo de dia (dia útil / sábado / domingo e feriado) | O app seleciona automaticamente pelo dia da semana e permite troca manual |
| RF-04 | Exibir a data de última atualização dos horários e a fonte da informação | Texto visível na tela principal; ataca diretamente a dor da "informação desatualizada" |

### 2.4 Fora do escopo (MVP 1)

Nada abaixo entra no MVP 1, mesmo que pareça pequeno:

- **Dados e backend:** backend, API, banco de dados, autenticação, painel administrativo, atualização remota, sincronização entre dispositivos
- **Tempo real e mapas:** GPS, "ônibus em tempo real", mapa de rotas, integração com APIs de terceiros, cálculo de tempo de chegada por trânsito
- **Engajamento e conta:** cadastro, login, perfil, notificações push, favoritos, compartilhamento
- **Colaboração e comunidade:** reportar atraso, comentários, avaliações, chat, gamificação
- **Expansão:** outros bairros ou cidades, planejador de rotas, preço de passagem, versão web/iOS/Android publicadas nas lojas
- **Qualidade além do necessário:** internacionalização, modo escuro, animações elaboradas, analytics, acessibilidade avançada, testes automatizados extensos

**Regra de ouro:** qualquer ideia nova durante as 4 semanas vai para o backlog do MVP 2, a menos que a ausência dela impeça o RF-CORE de funcionar.

### 2.5 Stack e decisões técnicas

- **Frontend:** React Native + Expo
- **Dados:** `data/horarios.json` (versionado no repositório)
- **Sem backend, sem banco de dados, sem autenticação no MVP 1**

**Justificativa:** o MVP 1 precisa validar a hipótese de que uma lista
confiável e offline resolve a dor. Um backend adicionaria complexidade
desnecessária e atrasaria a validação.

### 2.6 Origem e validação dos dados

- **Fonte:** SIU Mobile / SETUT (coleta manual)
- **Data da coleta:** a ser preenchida após a coleta
- **Responsável pela conferência:** Lucas Coelho
- **Processo de atualização:** revisão periódica manual e atualização do JSON

### 2.7 Como rodar

Pré-requisitos: Node.js, npm, Expo Go no celular.

```bash
git clone https://github.com/lucascoelho33/horarios-onibus-bairro-pedra-mole.git
cd horarios-onibus-bairro-pedra-mole
npm install
npx expo start