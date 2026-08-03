import { Button } from '../../atoms/Button/Button'

export interface TranslateSuggestButtonProps {
  label: string
  loading?: boolean
  onClick: () => void
}

/** Thin, presentational wrapper over the shared `Button` — fixes the visual
 * treatment (text variant, small size, AI-translate icon) so every domain
 * that adds AI translation suggestions renders the same trigger without
 * repeating these props at each call site. No domain knowledge. */
export const TranslateSuggestButton = ({
  label,
  loading = false,
  onClick,
}: TranslateSuggestButtonProps) => (
  <Button
    type="button"
    variant="text"
    size="small"
    icon="RiTranslateAi2"
    loading={loading}
    onClick={onClick}
  >
    {label}
  </Button>
)
