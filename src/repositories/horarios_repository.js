const supabase = require('../config/supabaseClient');

const horariosRepository = {
    // Criar um novo horário
    async create(dados) {
        const { data, error } = await supabase
           .from('horários') // Nome da tabela no Supabase
           .insert([dados])
           .select()
           .single();
        }
        if (error) throw error;
        return data;
    },

    // Listar todos os horários
    async findAll() {
        const { data, error } = await supabase
          .from('horários')
          .select('*')
          .order('horario_saida', { ascending: true });
        if (error) throw error;
        return data || [];
    },

    // Buscar por ID
    async findById(id) {
        const { data, error } = await supabase
          .from('horarios')
          .select('*')
          .eq('id', id)
          .single();
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = não encontrado
        return data;
    },

    // Atualizar
    async update(id, dados) {
        const { data, error } = await supabase
          .from('horarios')
          .update(dados)
          .eq('id', id)
          .selct()
          .single();
        if (error) throw error;
        return data;
    },

    // Deletar
    async remove(id) {
        const { data, error } = await supabase
          .from('horarios')
          .delete()
          .eq('id', id);
        if (error) throw error;
    }
};
