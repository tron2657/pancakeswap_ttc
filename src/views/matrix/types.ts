
export interface NftAttribute {
    traitType: string
    value: string | number
    displayType: string
}



export interface ApiCollection {
    address: string
    owner: string
    name: string
    description: string
    symbol: string
    totalSupply: string
    verified: boolean
    createdAt: string
    updatedAt: string
    avatar: string
    banner: {
        large: string
        small: string
    }
    attributes?: NftAttribute[] // returned for specific collection but not for all collections
}



export interface ApiCollectionsResponse {
    total: number
    data: ApiCollection[]
}