import supabase from "../config/supabase.js";

export const adminService = {
  // 1. Consultar todos los usuarios/pacientes
  async getAllUsers() {
    const { data, error } = await supabase
      .from("user")
      .select("id_user as id, name, email, phone, gender");
    if (error) throw error;
    return data;
  },

  // 2. Crear un nuevo usuario/paciente
  async createUser(userData) {
    const { name, email, phone, document_number, gender, password } = userData;
    const { data, error } = await supabase
      .from("user")
      .insert([{ name, email, phone, document_number, gender, password }])
      .select();
    if (error) throw error;
    return data[0];
  },

  // 3. Modificar un usuario existente
  async updateUser(id, userData) {
    const { name, email, phone, gender } = userData;
    const { data, error } = await supabase
      .from("user")
      .update({ name, email, phone, gender })
      .eq("id_user", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  // 4. Eliminar un usuario
  async deleteUser(id) {
    const { error } = await supabase.from("user").delete().eq("id_user", id);
    if (error) throw error;
    return true;
  },
};
