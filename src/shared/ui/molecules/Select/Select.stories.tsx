import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { userEvent, within } from 'storybook/test'
import type { SelectOptionItem } from './Select.types'
import { IconComponent } from '@Components/atoms/IconComponent/IconComponent'
import { SELECT_TEXTS_BY_LANG } from './Select.texts'

import { Select } from './Select'

const basicOptions: SelectOptionItem[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4' },
  { label: 'Option 5', value: '5' }
]

const manyOptions: SelectOptionItem[] = Array.from({ length: 15 }, (_, i) => ({
  label: `Option ${i + 1}`,
  value: String(i + 1)
}))

const optionsWithIcons: SelectOptionItem[] = [
  { label: 'Home', value: 'home', icon: 'RiHomeLine' },
  { label: 'User', value: 'user', icon: 'RiUserLine' },
  { label: 'Settings', value: 'settings', icon: 'RiSettings3Line' },
  { label: 'Notifications', value: 'notifications', icon: 'RiNotificationLine' }
]

const optionsWithDisabled: SelectOptionItem[] = [
  { label: 'Available option', value: '1' },
  { label: 'Disabled option', value: '2', disabled: true },
  { label: 'Another available', value: '3' },
  { label: 'Also disabled', value: '4', disabled: true },
  { label: 'Last available', value: '5' }
]

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'error', 'warning']
    },
    lang: {
      control: { type: 'select' },
      options: [
        undefined,
        'es',
        'en',
        'de',
        'fr',
        'it',
        'ja',
        'ko',
        'pt',
        'zh',
        'ru'
      ],
      description: 'Idioma del preset de textos internos del componente'
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    multiple: { control: 'boolean' },
    search: { control: 'boolean' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    helperText: { control: 'text' }
  },
  decorators: [
    Story => (
      <div className="w-80">
        <Story />
      </div>
    )
  ]
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: basicOptions,
    placeholder: 'Select an option'
  }
}

export const WithLabel: Story = {
  args: {
    label: 'Category:',
    options: basicOptions,
    placeholder: 'Select a category',
    helperText: 'Choose the category that best fits.'
  }
}

export const Multiple: Story = {
  args: {
    label: 'Tags:',
    options: basicOptions,
    multiple: true,
    placeholder: 'Select tags'
  }
}

export const WithSearch: Story = {
  args: {
    label: 'Country:',
    options: manyOptions,
    search: true,
    placeholder: 'Select a country'
  }
}

export const WithIcons: Story = {
  args: {
    label: 'Navigate to:',
    options: optionsWithIcons,
    defaultValue: 'home',
    placeholder: 'Choose a section',
    leftSlot: (
      <IconComponent icon="RiCompassLine" className="size-5 text-slate-500" />
    ),
    rightSlot: (
      <IconComponent
        icon="RiArrowRightSLine"
        className="size-5 text-slate-400"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const WithDisabledOptions: Story = {
  args: {
    label: 'Plan:',
    options: optionsWithDisabled,
    placeholder: 'Select a plan'
  }
}

export const ErrorState: Story = {
  args: {
    label: 'Required field:',
    options: basicOptions,
    variant: 'error',
    errorMessage: 'Please select an option.',
    placeholder: 'Select...'
  }
}

export const SuccessState: Story = {
  args: {
    label: 'Verified field:',
    options: basicOptions,
    variant: 'success',
    defaultValue: '1',
    placeholder: 'Select...'
  }
}

export const Loading: Story = {
  args: {
    label: 'Loading options:',
    options: basicOptions,
    loading: true,
    placeholder: 'Loading...'
  }
}

export const Disabled: Story = {
  args: {
    label: 'Disabled selector:',
    options: basicOptions,
    disabled: true,
    defaultValue: '1',
    placeholder: 'Cannot change'
  }
}

export const MultipleWithSearch: Story = {
  args: {
    label: 'Select items:',
    options: manyOptions,
    multiple: true,
    search: true,
    placeholder: 'Search and select...'
  }
}

const ControlledStory = () => {
  const [value, setValue] = useState('')
  return (
    <div className="flex flex-col gap-4">
      <Select
        label="Controlled selector:"
        options={basicOptions}
        value={value}
        onChange={e => setValue((e.target as HTMLSelectElement).value)}
        placeholder="Select..."
      />
      <p className="text-sm text-slate-600">Selected: {value || 'none'}</p>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledStory />
}

export const MultipleWithIcons: Story = {
  args: {
    label: 'Navigate to (multiple):',
    options: optionsWithIcons,
    multiple: true,
    defaultValue: ['home', 'user'],
    placeholder: 'Choose sections'
  }
}

export const WithLeftSlot: Story = {
  args: {
    label: 'Search and select:',
    options: basicOptions,
    placeholder: 'Select an option',
    leftSlot: (
      <IconComponent icon="RiSearchLine" className="size-5 text-slate-500" />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const WithSlots: Story = {
  args: {
    label: 'With both slots:',
    options: basicOptions,
    placeholder: 'Select an option',
    leftSlot: (
      <IconComponent icon="RiListCheck" className="size-5 text-slate-500" />
    ),
    rightSlot: (
      <IconComponent
        icon="RiInformationLine"
        className="size-5 text-slate-400"
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const DropdownOpenBelow: Story = {
  name: 'Dropdown — opens below',
  args: {
    label: 'Default position:',
    options: basicOptions,
    placeholder: 'Select...'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const DropdownOpenAbove: Story = {
  name: 'Dropdown — opens above',
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Story => (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '20px'
        }}
      >
        <div style={{ width: '320px' }}>
          <Story />
        </div>
      </div>
    )
  ],
  args: {
    label: 'Near bottom of viewport:',
    options: basicOptions,
    placeholder: 'Select...'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

// ─── i18n ────────────────────────────────────────────────────────────────────

const countryOptions: SelectOptionItem[] = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Brasil', value: 'br' },
  { label: 'Chile', value: 'cl' },
  { label: 'Colombia', value: 'co' },
  { label: 'México', value: 'mx' },
  { label: 'Perú', value: 'pe' },
  { label: 'Uruguay', value: 'uy' },
  { label: 'Venezuela', value: 've' }
]

export const LangSpanish: Story = {
  name: '🌐 lang — Español (es)',
  args: {
    label: 'País:',
    options: countryOptions,
    search: true,
    lang: 'es',
    placeholder: 'Selecciona un país'
  },
  parameters: {
    docs: {
      source: {
        code: '<Select options={countryOptions} search lang="es" placeholder="Selecciona un país" />'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const LangEnglish: Story = {
  name: '🌐 lang — English (en)',
  args: {
    label: 'Country:',
    options: countryOptions,
    search: true,
    lang: 'en',
    placeholder: 'Select a country'
  },
  parameters: {
    docs: {
      source: {
        code: '<Select options={countryOptions} search lang="en" placeholder="Select a country" />'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const LangJapanese: Story = {
  name: '🌐 lang — 日本語 (ja)',
  args: {
    label: '国:',
    options: countryOptions,
    search: true,
    lang: 'ja',
    placeholder: '国を選択'
  },
  parameters: {
    docs: {
      source: {
        code: '<Select options={countryOptions} search lang="ja" placeholder="国を選択" />'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const LangKorean: Story = {
  name: '🌐 lang — 한국어 (ko)',
  args: {
    label: '국가:',
    options: countryOptions,
    search: true,
    lang: 'ko',
    placeholder: '국가 선택'
  },
  parameters: {
    docs: {
      source: {
        code: '<Select options={countryOptions} search lang="ko" placeholder="국가 선택" />'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const LangChinese: Story = {
  name: '🌐 lang — 中文 (zh)',
  args: {
    label: '国家:',
    options: countryOptions,
    search: true,
    lang: 'zh',
    placeholder: '选择国家'
  },
  parameters: {
    docs: {
      source: {
        code: '<Select options={countryOptions} search lang="zh" placeholder="选择国家" />'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const LangOverridePartial: Story = {
  name: '🌐 lang + texts — override puntual',
  args: {
    label: 'País:',
    options: countryOptions,
    search: true,
    lang: 'es',
    texts: { noOptionsFound: 'País no encontrado' },
    placeholder: 'Selecciona un país'
  },
  parameters: {
    docs: {
      source: {
        code: `// lang aplica el preset de español,
// texts.noOptionsFound sobreescribe solo ese texto
<Select
  options={countryOptions}
  search
  lang="es"
  texts={{ noOptionsFound: 'País no encontrado' }}
  placeholder="Selecciona un país"
/>`
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

export const LangTextsManual: Story = {
  name: '🌐 texts — override manual completo (sin lang)',
  args: {
    label: 'Elemento:',
    options: countryOptions,
    search: true,
    texts: {
      noOptionsFound: 'Elemento no encontrado',
      searchPlaceholder: 'Filtrar elementos...',
      searchAriaLabel: 'Filtrar elementos',
      openOptionsAriaLabel: 'Ver elementos',
      closeOptionsAriaLabel: 'Ocultar elementos'
    },
    placeholder: 'Selecciona un elemento'
  },
  parameters: {
    docs: {
      source: {
        code: `// Sin lang, todos los textos se sobreescriben manualmente
<Select
  options={options}
  search
  texts={{
    noOptionsFound: 'Elemento no encontrado',
    searchPlaceholder: 'Filtrar elementos...',
    searchAriaLabel: 'Filtrar elementos',
    openOptionsAriaLabel: 'Ver elementos',
    closeOptionsAriaLabel: 'Ocultar elementos'
  }}
  placeholder="Selecciona un elemento"
/>`
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('combobox'))
  }
}

const I18nPlaygroundStory = () => {
  const [lang, setLang] = useState<keyof typeof SELECT_TEXTS_BY_LANG>('en')

  const langOptions = Object.keys(SELECT_TEXTS_BY_LANG).map(l => ({
    label: l,
    value: l
  }))

  return (
    <div className="flex flex-col gap-6 w-80">
      <Select
        label="🌐 Cambiar idioma del selector de abajo:"
        options={langOptions}
        value={lang}
        onChange={e =>
          setLang(
            (e.target as HTMLSelectElement)
              .value as keyof typeof SELECT_TEXTS_BY_LANG
          )
        }
        placeholder="Select lang..."
      />
      <Select
        label="País:"
        options={countryOptions}
        search
        lang={lang}
        placeholder="..."
      />
      <div className="text-xs text-slate-500 bg-slate-50 rounded p-2 font-mono">
        {JSON.stringify(SELECT_TEXTS_BY_LANG[lang], null, 2)}
      </div>
    </div>
  )
}

export const I18nPlayground: Story = {
  name: '🌐 i18n Playground — todos los idiomas',
  render: () => <I18nPlaygroundStory />,
  parameters: {
    docs: {
      source: {
        code: `// Elige un idioma en el primer Select y el segundo se adapta automáticamente
<Select options={countryOptions} search lang={currentLang} />`
      }
    }
  }
}
