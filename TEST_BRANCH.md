# Rama `test`

Esta rama existe únicamente como infraestructura: le da a Vercel un branch
estable para desplegar el ambiente de **test** persistente en
`first-frontend-git-test-navike21.vercel.app`.

- No es una rama de feature — no se mergea a `main`.
- Se mantiene sincronizada con `main` (fast-forward) para que el ambiente de
  test corra siempre el código más reciente.
- El PR abierto contra `main` para esta rama existe solo para que la
  integración de Vercel con GitHub genere el deployment — se deja abierto a
  propósito, nunca se mergea ni se cierra.

**Nota real (2026-07-23):** cuando `test` queda exactamente en el mismo
commit que `main` (después de un `fast-forward`), GitHub detecta "0 commits
de diferencia" y auto-cierra/marca como mergeado el PR de esta rama por su
cuenta — sin que nadie lo mergee a mano (confirmado: pasó dos veces en la
misma sesión, cada vez ~1 segundo después de que un PR de feature aterrizara
en `main`; GitHub no deja crear un PR nuevo mientras ambas ramas sigan
idénticas, "No commits between main and test"). Esto **no rompe** el
auto-deploy de Vercel para pushes futuros a `test` — confirmado en vivo:
varios pushes posteriores a `test` siguieron generando deployments
normalmente pese al PR cerrado. Si en algún momento el auto-deploy
realmente deja de dispararse, recién ahí re-crear el PR (`gh pr create
--base main --head test`) — pero solo funciona si `test` vuelve a tener al
menos un commit de diferencia con `main` en ese momento.

Ver `CLAUDE.md` → sección "Ambientes" para el detalle completo de
development/test/production.
