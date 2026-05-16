export const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 mt-auto">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-400">
        <p>&copy; {new Date().getFullYear()} Indra. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-slate-600 transition-colors">Términos de uso</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacidad</a>
        </div>
      </div>
    </footer>
  )
}
