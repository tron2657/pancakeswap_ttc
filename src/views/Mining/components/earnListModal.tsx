import { InjectedModalProps, Modal, Flex, Text, Button, Link, Input, Box } from '@pancakeswap/uikit'
import { useRef, useCallback, useState, useEffect } from 'react'
import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { format, parseISO, isValid } from 'date-fns'
interface EarnListModalProps extends InjectedModalProps {
  list: []
  customOnDismiss: () => void
}

const EarnListModal: React.FC<EarnListModalProps> = ({ list, customOnDismiss, onDismiss }) => {
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()

  const handleConfirmClick = async () => {
    handleDismiss()
  }
  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  useEffect(() => {}, [])

  return (
    <Modal
      title={t('Recent dividend records')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Flex flexDirection="column" maxWidth="350px">
        {list.length ? (
          list.map((item) => {
            return (
              <Flex alignItems="center" mb="16px" justifyContent="space-around">
                <Text small bold>
                  {format(item['add_time'] * 1000, 'yyyy-MM-dd HH:mm:ss')}
                </Text>
                <Text small bold>
                  {item['usdt']}
                </Text>
                <Text small bold>
                  {item['coin']}
                </Text>
              </Flex>
            )
          })
        ) : (
          <Text textAlign="center" bold>
            暂无记录
          </Text>
        )}

        <Flex flexDirection="column" pt="16px" alignItems="center">
          <Button onClick={handleConfirmClick}>{t('Confirm')}</Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default EarnListModal
