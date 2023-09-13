import { useTranslation } from 'react-i18next'

const Translator = (props: { path: string, arguments?: Object }) => {
  const { t } = useTranslation() 

  return t(props.path, props.arguments)
}

export default Translator
