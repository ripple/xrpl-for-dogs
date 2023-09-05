declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: { screen: keyof RootParamList } | undefined;
      Preview: undefined;
      AddMetadata: undefined;
      Minted: undefined;
      MyNFTS: undefined;
    }
  }
}

export {};
