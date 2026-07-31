import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LocationSelect } from './LocationSelect'
import { useCountries, useDivisions } from '@/shared/api/geo'
import type { GeoCountry, GeoDivisions } from '@/shared/api/geo'

// Isolate LocationSelect's own RHF-wiring logic from the real Select (a
// portal-based combobox, already covered by its own test suite) — a plain
// native <select> exposes the same label/options/value/onChange/disabled
// contract without fighting a dropdown portal in every test here.
vi.mock('../Select/Select', () => ({
  Select: ({
    label,
    options,
    value,
    disabled,
    loading,
    onChange,
  }: {
    label: string
    options: { value: string; label: string }[]
    value: string
    disabled?: boolean
    loading?: boolean
    onChange: (e: { target: { value: string } }) => void
  }) => (
    <div>
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange({ target: { value: e.target.value } })}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {loading && <span data-testid={`loading-${label}`} />}
    </div>
  ),
}))

vi.mock('@/shared/api/geo', () => ({
  useCountries: vi.fn(),
  useDivisions: vi.fn(),
}))

const mockUseCountries = vi.mocked(useCountries)
const mockUseDivisions = vi.mocked(useDivisions)

const COUNTRIES: GeoCountry[] = [
  {
    code: 'PE',
    code3: 'PER',
    name: 'Perú',
    flag: '🇵🇪',
    dialCode: '+51',
    hasDivisions: true,
    divisionLevels: ['Departamento', 'Provincia', 'Distrito'],
  },
  {
    code: 'US',
    code3: 'USA',
    name: 'Estados Unidos',
    flag: '🇺🇸',
    dialCode: '+1',
    hasDivisions: false,
  },
]

// Peru cascade fixture: department '01' Amazonas → province '0101'
// Chachapoyas → district '010101' Chachapoyas (hierarchical prefix codes,
// same shape LocationSelect.buildInitialPath assumes).
function divisionsFor(country?: string, parentCode?: string): GeoDivisions {
  if (country !== 'PE') return { levels: [], items: [] }
  if (!parentCode)
    return { levels: [], items: [{ code: '01', name: 'Amazonas', hasChildren: true }] }
  if (parentCode === '01')
    return {
      levels: [],
      items: [{ code: '0101', name: 'Chachapoyas', hasChildren: true }],
    }
  if (parentCode === '0101')
    return {
      levels: [],
      items: [{ code: '010101', name: 'Chachapoyas', hasChildren: false }],
    }
  return { levels: [], items: [] }
}

interface FormValues {
  countryCode: string
  ubigeoCode?: string
  region?: string
  province?: string
  district?: string
}

function Harness({
  defaultValues,
  onValues,
  disabled,
}: {
  defaultValues?: Partial<FormValues>
  onValues: (v: FormValues) => void
  disabled?: boolean
}) {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      countryCode: '',
      ubigeoCode: '',
      region: '',
      province: '',
      district: '',
      ...defaultValues,
    },
  })
  return (
    <form onSubmit={handleSubmit((d) => onValues(d))}>
      <LocationSelect
        control={control}
        names={{
          countryCode: 'countryCode',
          ubigeoCode: 'ubigeoCode',
          region: 'region',
          province: 'province',
          district: 'district',
        }}
        countryLabel="País"
        regionLabel="Región"
        cityLabel="Ciudad"
        lang="es"
        disabled={disabled}
      />
      <button type="submit">submit</button>
    </form>
  )
}

const select = (label: string) => screen.getByLabelText(label) as HTMLSelectElement

describe('LocationSelect', () => {
  beforeEach(() => {
    mockUseCountries.mockReturnValue({
      data: COUNTRIES,
    } as unknown as ReturnType<typeof useCountries>)
    mockUseDivisions.mockImplementation(
      (country?: string, parentCode?: string) =>
        ({
          data: divisionsFor(country, parentCode),
          isFetching: false,
        }) as unknown as ReturnType<typeof useDivisions>
    )
  })

  it('renders the country select with the fetched options', () => {
    render(<Harness onValues={vi.fn()} />)
    const options = Array.from(select('País').querySelectorAll('option')).map(
      (o) => o.textContent
    )
    expect(options).toEqual(['—', 'Perú', 'Estados Unidos'])
  })

  it('drills through the division cascade and submits the deepest code', async () => {
    const user = userEvent.setup()
    const onValues = vi.fn()
    render(<Harness onValues={onValues} />)

    await user.selectOptions(select('País'), 'PE')
    expect(await screen.findByLabelText('Departamento')).toBeInTheDocument()

    await user.selectOptions(select('Departamento'), '01')
    expect(await screen.findByLabelText('Provincia')).toBeInTheDocument()

    await user.selectOptions(select('Provincia'), '0101')
    expect(await screen.findByLabelText('Distrito')).toBeInTheDocument()

    await user.selectOptions(select('Distrito'), '010101')
    await user.click(screen.getByText('submit'))

    expect(onValues).toHaveBeenCalledWith({
      countryCode: 'PE',
      ubigeoCode: '010101',
      region: 'Amazonas',
      province: 'Chachapoyas',
      district: 'Chachapoyas',
    })
  })

  it('reselecting a shallower level resets the deeper ones', async () => {
    const user = userEvent.setup()
    const onValues = vi.fn()
    render(<Harness onValues={onValues} />)

    await user.selectOptions(select('País'), 'PE')
    await user.selectOptions(await screen.findByLabelText('Departamento'), '01')
    await user.selectOptions(await screen.findByLabelText('Provincia'), '0101')
    await user.selectOptions(await screen.findByLabelText('Distrito'), '010101')

    // Re-picking the department resets province/district.
    await user.selectOptions(select('Departamento'), '01')
    await user.click(screen.getByText('submit'))

    expect(onValues).toHaveBeenCalledWith(
      expect.objectContaining({
        countryCode: 'PE',
        ubigeoCode: '01',
        region: 'Amazonas',
        province: undefined,
        district: undefined,
      })
    )
  })

  it('switching country clears the previously selected division', async () => {
    const user = userEvent.setup()
    const onValues = vi.fn()
    render(<Harness onValues={onValues} />)

    await user.selectOptions(select('País'), 'PE')
    await user.selectOptions(await screen.findByLabelText('Departamento'), '01')

    await user.selectOptions(select('País'), 'US')
    await user.click(screen.getByText('submit'))

    expect(onValues).toHaveBeenCalledWith(
      expect.objectContaining({
        countryCode: 'US',
        ubigeoCode: undefined,
        region: undefined,
      })
    )
  })

  it('a country without divisions shows free-text region/city inputs', async () => {
    const user = userEvent.setup()
    const onValues = vi.fn()
    render(<Harness onValues={onValues} />)

    await user.selectOptions(select('País'), 'US')
    expect(screen.queryByLabelText('Departamento')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Región'), 'California')
    await user.type(screen.getByLabelText('Ciudad'), 'Los Angeles')
    await user.click(screen.getByText('submit'))

    expect(onValues).toHaveBeenCalledWith(
      expect.objectContaining({
        countryCode: 'US',
        region: 'California',
        province: 'Los Angeles',
      })
    )
  })

  it('reconstructs the cascade path from an initial ubigeo code', async () => {
    render(
      <Harness
        onValues={vi.fn()}
        defaultValues={{
          countryCode: 'PE',
          ubigeoCode: '0101',
          region: 'Amazonas',
          province: 'Chachapoyas',
        }}
      />
    )
    expect(await screen.findByLabelText('Provincia')).toBeInTheDocument()
    expect(select('Departamento').value).toBe('01')
    expect(select('Provincia').value).toBe('0101')
  })

  it('disables every control when disabled', () => {
    render(
      <Harness
        onValues={vi.fn()}
        disabled
        defaultValues={{ countryCode: 'US' }}
      />
    )
    expect(select('País')).toBeDisabled()
    expect(screen.getByLabelText('Región')).toBeDisabled()
    expect(screen.getByLabelText('Ciudad')).toBeDisabled()
  })
})
