const { proximoHorario } = require('./proximoHorario');

describe('RF-02 — Cálculo do próximo horário', () => {

  it('deve retornar o próximo horário e "em 15 min" (Cenário de Sucesso do Spec)', () => {
    // 14:20 = 14 * 60 + 20 = 860 minutos
    const agora = 14 * 60 + 20;
    const horarios = ['14:10', '14:35', '15:00'];

    const resultado = proximoHorario(horarios, agora);

    expect(resultado).toEqual({
      tipo: 'proximo',
      horario: '14:35',
      texto: 'em 15 min',
      diffMin: 15
    });
  });

  it('deve retornar "Saindo agora" se a diferença for 0 minuto', () => {
    const agora = 14 * 60 + 20; // 14:20
    const horarios = ['14:20', '14:35'];

    const resultado = proximoHorario(horarios, agora);

    expect(resultado).toEqual({
      tipo: 'proximo',
      horario: '14:20',
      texto: 'Saindo agora',
      diffMin: 0
    });
  });

  it('deve formatar corretamente como "em XhYY" quando a diferença for >= 60 min', () => {
    const agora = 14 * 60 + 20; // 14:20
    const horarios = ['15:25'];
    // 14:20 até 16:05 = 105 minutos (1 hora e 5 minutos)

    const resultado = proximoHorario(horarios, agora);

    // O texto DEVE ser "em 1h05" (com zero à esquerda), e não "em 1h5"
    expect(resultado).toEqual({
      tipo: 'proximo',
      horario: '15:25',
      texto: 'em 1h05',
      diffMin: 65
    });
  });

  it('deve retornar "Sem mais saídas hoje" se não houver horário igual ou posterior (Cenário de Falha do Spec)', () => {
    const agora = 23 * 60 + 50; // 23:50
    const horarios = ['22:40'];

    const resultado = proximoHorario(horarios, agora);

    expect(resultado).toEqual({
      tipo: 'semSaidasHoje'
    });
  });

  it('deve retornar "Sem horários para este tipo de dia" se o array estiver vazio', () => {
    const agora = 10 * 60; // 10:00
    const horarios = [];

    const resultado = proximoHorario(horarios, agora);

    expect(resultado).toEqual({
      tipo: 'semHorarios'
    });
  });

});