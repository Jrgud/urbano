import { isAxiosError } from "axios";
import { useGeneralStore } from "../store/general/genetal.store";
import { ToastCustom } from "./toast.helper";
 

export const withBackdrop = async <T>(operation: () => Promise<T>): Promise<T | undefined> => {
  const { setBackdrop } = useGeneralStore.getState(); // Obtener setBackdrop de generalStore
  
  await setBackdrop(true); // Activar backdrop antezs de la operación
  try {
    const result = await operation(); // Ejecutar la operación y obtener su resultado
    return result; // Devolver el resultado si todo fue bien
  } catch (error) {
    let message = 'Error inesperado'; // Mensaje por defecto
    // Verificar si el error tiene la estructura esperada
    if (isAxiosError(error) && error.response && error.response.data && error.response.data.detail ) { 
        // Intentar convertir el valor de 'detail' a JSON si es posible
        let detailString = error.response.data.detail as string;
    
        // Verificar si es un array o un string
        if (typeof detailString === 'string') {
          try {
            // Intentar convertir a objeto/array en caso de que sea un string JSON válido
            detailString = JSON.parse(detailString.replace(/'/g, '"'));
          } catch (err) {
            // Si falla la conversión, asumimos que es un string simple
            message = detailString;
          }
        }
        // Verificar si es un array o un string
        if (typeof detailString === 'object') {
          try {
            // Intentar convertir a objeto/array en caso de que sea un string JSON válido
            detailString = JSON.parse(detailString).msg??'';
          } catch (err) {
            // Si falla la conversión, asumimos que es un string simple
            message = detailString;
          }
        }
        // Si es un array, concatenar los mensajes
        if (Array.isArray(detailString)) {
          message = detailString.map((detail: { msg: string }) => detail.msg).join('<br>');
        } else if (typeof detailString === 'string') {
          // Si es un string simple, usarlo como mensaje
          message = detailString;
        }  
    }    
    // Mostrar el mensaje en el Toast
    ToastCustom.fire({
      icon: "error",
      title: message
    });

    
    // Retornar undefined en caso de error
    return undefined;
  } finally {
    await setBackdrop(false); // Desactivar backdrop después de la operación, incluso si hay error
  }
};

export const getCurrentPosition = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
              (position) => {
                  const { latitude, longitude } = position.coords;
                  resolve({ lat: latitude, lng: longitude });
              },
              (error) => {
                  switch (error.code) {
                      case error.PERMISSION_DENIED:
                          console.error("Permiso denegado para obtener la ubicación.");
                          break;
                      case error.POSITION_UNAVAILABLE:
                          console.error("La ubicación no está disponible.");
                          break;
                      case error.TIMEOUT:
                          console.error("La solicitud de ubicación ha expirado.");
                          break;
                      default:
                          console.error("Error desconocido al obtener la ubicación.");
                          break;
                  }
                  reject(error);
              }
          );
      } else {
          reject(new Error("La geolocalización no está disponible en este navegador."));
      }
  });
};


export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
 

 