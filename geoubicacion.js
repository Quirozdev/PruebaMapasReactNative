import { GEOAPIFY_API_KEY } from '@env';

console.log(GEOAPIFY_API_KEY);

export async function obtenerDatosUbicacion(latitud, longitud) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${latitud}&lon=${longitud}&apiKey=${GEOAPIFY_API_KEY}`
    );
    const datos = await response.json();
    return datos;
  } catch (error) {
    console.log(error);
  }
}
