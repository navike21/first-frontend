import { environments } from '@Constants/environments'
import { ESizes } from '@Enums/size'
import { EThemeOption } from '@Enums/themeOption'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'

function App() {
  const { language, setThemeOption, setTextSize } = useOptionsBrowserStore()
  return (
    <span>
      {language}
      <button onClick={() => setThemeOption(EThemeOption.DARK)}>
        Change Theme
      </button>
      <button onClick={() => setThemeOption(EThemeOption.LIGHT)}>
        Change Light Theme
      </button>
      <button onClick={() => setTextSize(ESizes.MD)}>
        Change size of text
      </button>
      {environments.VITE_API_URL}
    </span>
  )
}

export default App
