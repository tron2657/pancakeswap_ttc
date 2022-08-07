import { InjectedModalProps, Modal, Flex, Text, Button, Link, Input, Box } from '@pancakeswap/uikit'
import { useRef, useCallback, useState, useEffect } from 'react'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTTCNumber } from '../hook/useJoinMining'
import { Field } from 'state/swap/actions'
interface TTCModalProps extends InjectedModalProps {
  customOnDismiss: (arg0: any) => void
}

const TTCModal: React.FC<TTCModalProps> = ({ customOnDismiss, onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { onCurrencySelection, inputCurrency, outputCurrency, onUserInput, formattedAmounts } = useTTCNumber()
  const [ttcNum, setTTCNum] = useState('')

  const handleConfirmClick = async () => {
    handleDismiss(ttcNum)
  }
  const handleDismiss = useCallback(
    (data) => {
      if (customOnDismiss) {
        customOnDismiss(data)
      }
      onDismiss?.()
    },
    [customOnDismiss, onDismiss],
  )

  useEffect(() => {
    onCurrencySelection(Field.INPUT, inputCurrency)
    onCurrencySelection(Field.OUTPUT, outputCurrency)
    onUserInput(Field.INPUT, '0.015')
    onUserInput(Field.INPUT, '0.015')
    const ttc_num = formattedAmounts[Field.OUTPUT]
    setTTCNum(ttc_num)
    console.log('ttc_num===', ttc_num)
  }, [])

  return (
    <Modal title={t('消耗手续费')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex flexDirection="column" maxWidth="350px">
        <Flex alignItems="center" mb="16px" justifyContent="center">
          <Text small bold>
            需要消耗{ttcNum}个ttc作为手续费
          </Text>
        </Flex>

        <Flex flexDirection="column" pt="16px" alignItems="center">
          <Button onClick={handleConfirmClick}>{t('Confirm')}</Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default TTCModal
