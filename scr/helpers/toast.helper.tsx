import Swal from "sweetalert2";

const ToastCustom = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  customClass: {
    container:"z-9999"
  },
  timerProgressBar: true, 
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

/**
 * Función para mostrar el toast con un icono y un fondo opcional
 * @param {string} icon - El tipo de icono (success, error, warning, etc.)
 * @param {string} title - El título del toast
 */
export const showToast = (icon:string, title:string) => {
  let backgroundColor;

  // Determina el color de fondo en base al tipo de icono
  switch (icon) {
    case "success":
      backgroundColor = "#ecfccb"; // Verde
      break;
    case "error":
      backgroundColor = "#fee2e2"; // Rojo
      break;
    case "warning":
      backgroundColor = "#fef9c3"; // Amarillo
      break;
    default:
      backgroundColor = "#ecfccb"; // Verde por defecto
  }

  // Muestra el toast con el fondo adecuado
  ToastCustom.fire({
    icon: icon,
    title: title, 
  });
};

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    container:"z-9999",
    confirmButton: "bg-[#e13f32] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2",
    cancelButton: "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
  },
  buttonsStyling: false
});
export   {ToastCustom,swalWithBootstrapButtons};
