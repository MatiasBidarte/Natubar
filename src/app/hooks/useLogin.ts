export const useLogin = () => {
  const login = async (email: string, contrasena: string) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_NATUBAR_API_URL}/cliente/login`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email,contrasena),
        redirect: "follow",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || "Error al realizar login",
          statusCode: errorData.statusCode,
        };
      }

      //Manejar el tema del token
      const loginCliente = await response.json();
      return loginCliente;
    } catch (err) {
      throw err;
    }
  };

  return {
    login,
  };
};
