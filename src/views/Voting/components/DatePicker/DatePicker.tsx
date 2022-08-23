import ReactDatePicker, { ReactDatePickerProps, registerLocale } from 'react-datepicker'
import { Input, InputProps } from '@pancakeswap/uikit'
// the locale you want
import el from 'date-fns/locale/zh-CN'
registerLocale('el', el) // regis
import 'react-datepicker/dist/react-datepicker.css'

export interface DatePickerProps extends ReactDatePickerProps {
  inputProps?: InputProps
}

const DatePicker: React.FC<DatePickerProps> = ({ inputProps = {}, ...props }) => {
  return (
    <ReactDatePicker
      locale={el}
      customInput={<Input {...inputProps} />}
      portalId="reactDatePicker"
      dateFormat="PPP"
      {...props}
    />
  )
}

export default DatePicker
