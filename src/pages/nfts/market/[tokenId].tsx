import { useRouter } from 'next/router'
import NftCardDetail from 'views/Nft/cardMarket/components/detaiil'

const NftCardDetailPage = () => {
  const router = useRouter()
  let nft = router.query.nft.toLocaleString()
  console.log('log====tokenId', JSON.parse(nft))
  return <NftCardDetail tokenId={router.query.tokenId} nft={JSON.parse(nft)} />
}

export default NftCardDetailPage
