const Footer = () => {
  return (
<footer class="text-gray-600 body-font bg-gray-800 mt-10">
  <div class="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
    <a class="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-10 h-10 text-emerald-500 p-2 bg-gray-800 rounded-full"
  >
    <rect x="3" y="4" width="4" height="16" rx="1"></rect>
    <rect x="10" y="4" width="4" height="10" rx="1"></rect>
    <rect x="17" y="4" width="4" height="6" rx="1"></rect>
  </svg>
      <span class="ml-3 text-xl text-emerald-500">ORGANIZA</span>
    </a>
    <p class="text-sm text-emerald-400 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2025 Todos los derechos reservados
    </p>
  </div>
</footer>
  );
};


export default Footer 