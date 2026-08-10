import supabase from "../config/supabase.js";

export const registerUser = async (usuario) => {
    const {
        tipo_documento,
        numero_documento,
        nombres,
        apellidos,
        correo,
        telefono,
        genero,
        password
    } = usuario;

    // Crear usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email: correo,
        password: password,
        options: {
            data: {
                tipo_documento,
                numero_documento,
                nombres,
                apellidos,
                telefono,
                genero
            }
        }
    });

    if (error) {
        throw new Error(error.message);
    }

    if (!data.user) {
        throw new Error("No fue posible crear el usuario.");
    }

    return {
        id: data.user.id,
        correo: data.user.email,
        nombres,
        apellidos
    };
};