import clsx from 'clsx'

export const Footer = () => {
  return (
    <footer className={clsx('mt-auto w-full px-6 py-4', 'border-t border-(--border) bg-(--surface)')}>
      <div className={clsx(
        'mx-auto flex w-full max-w-7xl items-center justify-between',
        'text-xs text-(--text-muted)',
      )}>
        <p>&copy; {new Date().getFullYear()} navike21. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <a href="#" className={clsx('transition-colors', 'hover:text-(--text-secondary)')}>Términos de uso</a>
          <a href="#" className={clsx('transition-colors', 'hover:text-(--text-secondary)')}>Privacidad</a>
        </div>
      </div>
    </footer>
  )
}
