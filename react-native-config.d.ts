declare module 'react-native-config' {
  export interface NativeConfig {
    PINATA_BASE_URL: string;
    PINATA_PRIVATE_GATEWAY: string;
    PINATA_TOKEN: string;
    PUBLIC_GATEWAY: string;
    WALLET_SEED: string;
    XRPL_NETWORK: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
