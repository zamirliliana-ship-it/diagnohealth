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

export const loginUser = async (credenciales) => {
    const { correo, password } = credenciales;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: password
    });

    if (error) {
        throw new Error(error.message);
    }

    if (!data.user || !data.session) {
        throw new Error("No fue posible iniciar sesión.");
    }

    return {
        usuario: {
            id: data.user.id,
            correo: data.user.email,
            ...data.user.user_metadata
        },
        session: {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at
        }
    };
};