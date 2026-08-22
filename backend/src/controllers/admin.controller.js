import supabase from '../config/supabase.js';
import { adminService } from '../services/admin.service.js';

export const adminController = {
  // Obtener todos los usuarios/pacientes
  async getUsers(req, res) {
    try {
      const data = await adminService.getAllUsers();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Crear un nuevo usuario/paciente
  async createUser(req, res) {
    try {
      const nuevoUsuario = await adminService.createUser(req.body);
      res.status(201).json({ success: true, data: nuevoUsuario });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Modificar un usuario existente
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const usuarioActualizado = await adminService.updateUser(id, req.body);
      res.status(200).json({ success: true, data: usuarioActualizado });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Eliminar un usuario
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      await adminService.deleteUser(id);
      res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

export const sourcesController = {
  // Obtener fuentes
  async getSources(req, res) {
    try {
      const { data, error } = await supabase.from('sources').select('*').order('id', { ascending: false });
      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Agregar fuente
  async addSource(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ success: false, message: "El nombre es obligatorio" });

      const type = name.split('.').pop().toUpperCase() || 'TXT';

      const { data, error } = await supabase
        .from('sources')
        .insert([{ name, type }])
        .select();

      if (error) throw error;
      res.status(201).json({ success: true, data: data[0] });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Eliminar fuente
  async deleteSource(req, res) {
    try {
      const { id } = req.params;
      const { error } = await supabase.from('sources').delete().eq('id', id);
      if (error) throw error;
      res.status(200).json({ success: true, message: "Eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};