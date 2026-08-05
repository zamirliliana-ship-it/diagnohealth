import supabase from "../config/supabase.js";

export const register = async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        // Validar campos
        if (!nombre || !correo || !password) {
            return res.status(400).json({
                error: "Nombre, correo y contraseña son obligatorios"
            });
        }

        // Validar contraseña
        if (password.length < 6) {
            return res.status(400).json({
                error: "La contraseña debe tener al menos 6 caracteres"
            });
        }

        // Registrar usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: correo,
            password: password,
            options: {
                data: {
                    nombre: nombre
                }
            }
        });

        // Error de Supabase
        if (error) {
            console.error("Error de Supabase Auth:", error);

            return res.status(400).json({
                error: error.message
            });
        }

        // Verificar que se haya creado el usuario
        if (!data.user) {
            return res.status(400).json({
                error: "No se pudo crear el usuario"
            });
        }

        // El perfil de public.usuarios se crea
        // automáticamente mediante el trigger de Supabase

        return res.status(201).json({
            message: "Usuario registrado correctamente",
            usuario: {
                id: data.user.id,
                nombre: nombre,
                correo: correo
            }
        });

    } catch (error) {
        console.error("Error en registro:", error);

        return res.status(500).json({
            error: "Error interno del servidor"
        });
    }
};