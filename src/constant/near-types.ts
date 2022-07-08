
export interface TokenProps{
    symbol: string;
    icon: string;
    balance: string;
    contractId: string,
    decimal: number;
    price?: string;
    usdValue: string;
}

export interface NFTMetaProps {
    [contract:string]: {
      tokens: Array<any>,
      base_uri: string
    }
  }