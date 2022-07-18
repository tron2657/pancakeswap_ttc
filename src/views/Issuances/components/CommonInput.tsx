import { memo } from 'react'
import { Text } from '@pancakeswap/uikit'
import { Input } from '@pancakeswap/uikit'
import styled from 'styled-components'
import debounce from 'lodash/debounce'
import { useTranslation } from 'contexts/Localization'
import { escapeRegExp } from 'utils'

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
  height: 3.8rem;
`

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    display: block;
  }
`
const LabelRow = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
`
const LabelWrapper = styled.div`
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.55rem 0.5rem;
`
const Container = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`
interface Props {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}
// match escaped "." characters via in a non-capturing group
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const CommonInput = function InnerInput({
  value,
  label,
  numerical,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number
  label: string
  onUserInput: (input: string) => void
  error?: boolean
  numerical?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    onUserInput(nextUserInput)
    if (nextUserInput === '') {
      onUserInput(nextUserInput)
    }
  }
  const { t } = useTranslation()

  return (
    <Container as="label">
      <LabelRow>
        <LabelWrapper>
          <Text bold>{label}</Text>
        </LabelWrapper>
        <StyledInput
          type="text"
          value={value}
          onChange={(e) => {
            enforcer(e.target.value)
          }}
          placeholder={placeholder || '请输入'}
        />
      </LabelRow>
    </Container>
  )
}
export default CommonInput
