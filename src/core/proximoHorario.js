function proximoHorario(horarios, agoraMin) {
    if (!Array.isArray(horarios) || horarios.length === 0) {
        return { tipo: 'semHorarios' };
    }

    const paraMinutos = (hhmm) => {
        const [h, m] = hhmm.split(':').map(Number);
        return h * 60 + m;
    };

    let melhor = null;

    for (const horario of horarios) {
        const minutos = paraMinutos(horario);
        if (minutos >= agoraMin && (melhor === null || minutos < melhor.minutos)) {
            melhor = { horario, minutos };
        }
    }

    if (melhor === null) {
        return { tipo: 'semSaidasHoje' };
    }

    const diffMin = melhor.minutos - agoraMin;
    let texto;

    if (diffMin === 0) {
        texto = 'Saindo agora';
    } else if (diffMin < 60) {
        texto = `em ${diffMin} min`;
    } else {
        const horas = Math.floor(diffMin / 60);
        const minutos = String(diffMin % 60).padStart(2, '0');
        texto = `em ${horas}h${String(minutos).padStart(2, '0')}`;
    }

    return {
        tipo: 'proximo',
        horario: melhor.horario,
        texto,
        diffMin
    };
}

module.exports = { proximoHorario };