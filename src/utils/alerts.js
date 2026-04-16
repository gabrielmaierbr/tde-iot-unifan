import Swal from 'sweetalert2';

// Base configuration to match our dark theme
const baseConfig = {
  background: '#1A1A2E',
  color: '#ffffff',
  customClass: {
    popup: 'border border-white/10 rounded-2xl shadow-2xl',
    title: 'text-xl font-semibold text-white',
    htmlContainer: 'text-gray-400',
    confirmButton: 'px-6 py-2 rounded-lg text-sm font-medium transition-colors',
    cancelButton: 'px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10',
  },
  buttonsStyling: false, // We'll use Tailwind classes via customClass
};

export const confirmDelete = async (title, text) => {
  const result = await Swal.fire({
    ...baseConfig,
    title: title || 'Tem certeza?',
    text: text || 'Esta ação não poderá ser desfeita!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, excluir',
    cancelButtonText: 'Cancelar',
    iconColor: '#EF4444',
    customClass: {
      ...baseConfig.customClass,
      confirmButton: baseConfig.customClass.confirmButton + ' bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white ml-3',
      actions: 'w-full flex justify-end mt-4'
    }
  });

  return result.isConfirmed;
};

// Configuração para Toasts (Notificações silenciosas no cantinho)
const Toast = Swal.mixin({
  ...baseConfig,
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: {
    popup: 'border border-white/10 rounded-xl shadow-lg mt-4 mr-4',
  },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const showSuccess = (title) => {
  Toast.fire({
    icon: 'success',
    title: title,
    iconColor: '#00D4FF',
  });
};

export const showError = (title) => {
  Toast.fire({
    icon: 'error',
    title: title,
    iconColor: '#EF4444',
  });
};
