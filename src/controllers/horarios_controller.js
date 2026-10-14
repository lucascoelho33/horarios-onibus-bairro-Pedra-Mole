const horariosRepository = require('../repositories/horarios_repository');

const horariosController = {
    // POST /api/v1/horarios
    async criar (req, res) {
        try {
            const { linha, bairro, horario_saida, horario_chegada } = req.body || {};

            // Validação (Status 400)
            if (!linha || !bairro || !horario_saida) {
                return res.status(400).json({
                    erro: 'Campos obrigatórios: linha, bairro, horario_saida'
                });
            }

            const novoHorario = await horariosRepository.create({
                linha,
                bairro,
                horario_saida,
                horario_chegada: horario_chegada || null
            });

            // Status 201 Created + Location
            res.location('/api/v1/horarios/${novoHorario.id}');
            return res.status(201).json(novoHorario);

        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro interno ao cadstrar horário. '});
        }
    },

    // GET /api/v1/horarios/:id
    async obterPorId(req, res) {
        try {
            const {id} = req.params;
            const horario = await horariosRepository.findById(id);

            if (!horario) {
                return res.status(404).json({ erro: 'Horário não encontrado. '});
            }
            return res.status(200).json(horario);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar horário. '});
        }
    },

    // PUT /api/v1/horarios/:id
    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const dados = req.body;

            const horarioAtualizado = await horariosRepository.update(id, dados);
            if (!horarioAtualizado) {
                return res.status(404).json({ erro: 'Horário não encontrado. '});
            }
            return res.status(200).json(horarioAtualizado);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao atualizar horário. '});
        }
    },

    // DELETE /api/v1/horarios/:id
    async remover(req, res) {
        try {
            const { id } = req.params;
            const horario = await horariosRepository.findById(id);

            if (!horario) {
                return res.status(404).json({erro: 'Horário não encontrado. '});
            }

            await horariosRepository.remove(id);

            // Status 204 No Content (sem corpo!)
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({erro: 'Erro ao remover horário. '});
        }
    }
};

module.exports = horariosController;