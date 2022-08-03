import { InjectedModalProps, Modal, Flex, Text, Button, Link, Input, Box } from '@pancakeswap/uikit'
import { useRef, useCallback, useState } from 'react'
import useTheme from 'hooks/useTheme'
import { TTC_API } from 'config/constants/endpoints'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
interface InviteModalProps extends InjectedModalProps {
  code: string | string[]
  customOnDismiss: (arg0: any) => void
}

const InviteModal: React.FC<InviteModalProps> = ({ code, customOnDismiss, onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [userCode, setUserCode] = useState(code)

  const handleUserCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const userCodeString = event.target.value.replace(/,/g, '.')
    setUserCode(userCodeString)
  }
  const handleConfirmClick = async () => {
    let data = await bindUserCodeApi()
    handleDismiss(data)
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
  const bindUserCodeApi = async () => {
    const res = await fetch(`${TTC_API}/user/app_reg?address=${account}&user_sn=${userCode}`, {
      method: 'post',
    })
    if (res.ok) {
      const json = await res.json()
      return json
    }
    console.error('Failed to fetch NFT collections', res.statusText)
    return null
  }

  return (
    <Modal title={t('输入邀请码')} onDismiss={onDismiss} headerBackground={theme.colors.gradients.cardHeader}>
      <Flex flexDirection="column" maxWidth="350px">
        <Flex alignItems="center" mb="16px" justifyContent="space-between">
          <Box mr="16px">
            <Input
              ref={inputRef}
              type="text"
              value={userCode}
              placeholder="请输入邀请码"
              onChange={handleUserCodeChange}
            />
          </Box>
        </Flex>

        <Flex flexDirection="column" pt="16px" alignItems="center">
          <Button onClick={handleConfirmClick}>{t('Confirm')}</Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default InviteModal
