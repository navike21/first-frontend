import clsx from 'clsx'

export const Footer = () => {
  return (
    <footer
      className={clsx(
        'mt-auto w-full px-4 py-4 md:px-6',
        'border-border bg-surface border-t'
      )}
    >
      <div
        className={clsx(
          'mx-auto flex w-full max-w-7xl flex-col gap-2 text-center',
          'sm:flex-row sm:items-center sm:justify-between sm:text-left',
          'text-muted text-xs'
        )}
      >
        <p>
          &copy; {new Date().getFullYear()} navike21. Todos los derechos
          reservados.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#"
            className={clsx('transition-colors', 'hover:text-secondary')}
          >
            Términos de uso
          </a>
          <a
            href="#"
            className={clsx('transition-colors', 'hover:text-secondary')}
          >
            Privacidad
          </a>
        </div>
      </div>
    </footer>
  )
}
