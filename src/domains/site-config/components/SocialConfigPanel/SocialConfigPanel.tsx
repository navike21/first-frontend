import { InputField, IconComponent, FormGrid } from '@/shared/ui'
import type { IconName } from '@/shared/types/icons'
import { useSiteConfigTranslation } from '../../i18n'
import { SOCIAL_NETWORKS } from '../../model/site-config.types'
import type { SocialConfig, SocialNetwork } from '../../model/site-config.types'

export interface SocialConfigPanelProps {
  value: SocialConfig
  onChange: (patch: Partial<SocialConfig>) => void
}

// Brand names are universal — no translation needed.
const NETWORK_META: Record<SocialNetwork, { label: string; icon: IconName }> = {
  facebook: { label: 'Facebook', icon: 'RiFacebookFill' },
  instagram: { label: 'Instagram', icon: 'RiInstagramLine' },
  x: { label: 'X (Twitter)', icon: 'RiTwitterXFill' },
  whatsapp: { label: 'WhatsApp', icon: 'RiWhatsappFill' },
  linkedin: { label: 'LinkedIn', icon: 'RiLinkedinFill' },
  youtube: { label: 'YouTube', icon: 'RiYoutubeFill' },
  tiktok: { label: 'TikTok', icon: 'RiTiktokFill' },
  telegram: { label: 'Telegram', icon: 'RiTelegramFill' },
  pinterest: { label: 'Pinterest', icon: 'RiPinterestFill' },
  github: { label: 'GitHub', icon: 'RiGithubFill' },
}

export const SocialConfigPanel = ({ value, onChange }: SocialConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-muted">{t.social.hint}</p>
      <FormGrid className="lg:grid-cols-2">
        {SOCIAL_NETWORKS.map((network) => {
          const meta = NETWORK_META[network]
          return (
            <InputField
              key={network}
              label={meta.label}
              value={value[network] ?? ''}
              leftSlot={
                <span className="px-3 text-secondary">
                  <IconComponent icon={meta.icon} className="h-4 w-4" />
                </span>
              }
              onChange={(e) => onChange({ [network]: e.target.value })}
            />
          )
        })}
      </FormGrid>
    </div>
  )
}
