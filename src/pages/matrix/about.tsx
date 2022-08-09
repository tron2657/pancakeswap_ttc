import { useState, useEffect } from 'react'
import MatrixAboutage from '../../views/matrix/about'
import MatrixPageLayout from '../../views/matrix/layout'
import { useWeb3React } from '@web3-react/core'


const CurrentMatrixAboutPage = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const { account } = useWeb3React()
  
  return (
    <MatrixPageLayout initData={data} account={account} showShare={false}>
      <MatrixAboutage />
    </MatrixPageLayout>
  ) 
}

export default CurrentMatrixAboutPage
