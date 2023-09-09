import { useTranslation } from 'react-i18next'

const Translator = (props: { path: string }) => {
  const { t } = useTranslation() 

  return t(props.path)
}

export default Translator
