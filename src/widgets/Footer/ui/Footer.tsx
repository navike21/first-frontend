import clsx from 'clsx'

export const Footer = () => {
  return (
    <footer className={clsx('mt-auto w-full px-6 py-4', 'border-t border-gray-200 bg-white')}>
      <div className={clsx(
        'mx-auto flex w-full max-w-7xl items-center justify-between',
        'text-xs text-slate-400',
      )}>
        <p>&copy; {new Date().getFullYear()} navike21. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <a href="#" className={clsx('transition-colors', 'hover:text-slate-600')}>Términos de uso</a>
          <a href="#" className={clsx('transition-colors', 'hover:text-slate-600')}>Privacidad</a>
        </div>
      </div>
    </footer>
  )
}
