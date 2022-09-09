import { useRouter } from 'next/router'
import MyNftCardDetail from 'views/Nft/myNft/components/detaiil'

const MyNftCardDetailPage = () => {
  const router = useRouter()
  let nft = router.query.nft.toLocaleString()
  console.log('log====tokenId', JSON.parse(nft))

  return <MyNftCardDetail tokenId={router.query.tokenId} nft={JSON.parse(nft)} />
}

export default MyNftCardDetailPage
