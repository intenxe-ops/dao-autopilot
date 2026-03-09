// Top DAO Snapshot spaces with metadata
export const TOP_DAOS = [
    { id: "arbitrumfoundation.eth", name: "Arbitrum DAO", category: "L2" },
    { id: "uniswapgovernance.eth", name: "Uniswap", category: "DeFi" },
    { id: "ens.eth", name: "ENS", category: "Infrastructure" },
    { id: "gitcoindao.eth", name: "Gitcoin", category: "Public Goods" },
    { id: "opcollective.eth", name: "Optimism Collective", category: "L2" },
    { id: "aave.eth", name: "Aave", category: "DeFi" },
    { id: "compound-community.eth", name: "Compound", category: "DeFi" },
    { id: "stgdao.eth", name: "Stargate", category: "DeFi" },
    { id: "banklessvault.eth", name: "Bankless DAO", category: "Media" },
    { id: "snapshot.dcl.eth", name: "Decentraland", category: "Metaverse" },
    { id: "balancer.eth", name: "Balancer", category: "DeFi" },
    { id: "curve.eth", name: "Curve", category: "DeFi" },
    { id: "lido-snapshot.eth", name: "Lido", category: "Liquid Staking" },
    { id: "safe.eth", name: "Safe", category: "Infrastructure" },
    { id: "shapeshiftdao.eth", name: "ShapeShift", category: "DeFi" },
    { id: "radicle.eth", name: "Radicle", category: "Dev Tools" },
    { id: "apecoin.eth", name: "ApeCoin", category: "NFT" },
    { id: "sushigov.eth", name: "Sushi", category: "DeFi" },
    { id: "piedao.eth", name: "PieDAO", category: "DeFi" },
    { id: "索.eth", name: "Nouns", category: "NFT" },
  ] as const;
  
  export type DAOSpace = typeof TOP_DAOS[number];