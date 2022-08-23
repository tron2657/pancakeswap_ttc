import { InjectedModalProps, Modal, Flex, Text, Button, Link, Input, Box } from '@pancakeswap/uikit'
import { useRef, useCallback, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { TTC_API } from 'config/constants/endpoints'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
interface SelectCoinModalProps extends InjectedModalProps {
  coinList: any
  customOnDismiss: (arg0: any) => void
}

const SelectCoinModal: React.FC<SelectCoinModalProps> = ({ coinList, customOnDismiss, onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)
  //   const [coinList, setCoinList] = useState(coinList)

  const handleUserCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userCodeString = event.target.value.replace(/,/g, '.')
  }
  const handleConfirmClick = async () => {
    handleDismiss(coinList)
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

  return (
    <Modal title={t('选择代币')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex flexDirection="column" maxWidth="350px">
        <Flex alignItems="center" mb="16px" justifyContent="space-between">
          <Text>USDT</Text>
          <Text>12345677</Text>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default SelectCoinModal
