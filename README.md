# XRPL for Dogs

## XRPL for Dogs is a mobile app built with React Native and XRPL.js to turn your experiences of meeting cute dogs on the street into unique NFTs.

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step before proceeding. You will need a free developer account with [Piñata](https://www.pinata.cloud/) and an [XRP Wallet](https://xrpl.org/xrp-testnet-faucet.html).

### Step 1: Enter environment variables

Fill in your Pinata token, Pinata gateway (or use the public gateway), and XRP wallet seed in the `.env.development` file.
```ts
PINATA_BASE_URL=https://api.pinata.cloud/pinning
PINATA_PRIVATE_GATEWAY=
PINATA_TOKEN=
PUBLIC_GATEWAY=https://ipfs.io/ipfs
WALLET_SEED=
XRPL_NETWORK=wss://s.altnet.rippletest.net:51233/
```

### Step 2: Start the Metro Server

You will need to start **Metro**, the JavaScript bundler that ships with React Native.
To start Metro, run the following command from the _root_ of your React Native project:

```bash
npm start
```

### Step 3: Start the App

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _iOS_ or _Android_ app:

```bash
# for iOS
npm run ios

# for Android
npm run android
```
