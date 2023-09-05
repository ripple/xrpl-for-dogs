import React, { useState } from 'react';
import {
  Button,
  Image,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Wallet, getNFTokenID } from 'xrpl';
import Config from 'react-native-config';

import { useGlobalState } from '../globalState/GlobalStateContext';
import { NFT_TYPE, METADATA_SCHEMA, TRANSFER_FEE } from '../common/constants';
import {
  formatCIDtoIPFS,
  mintNft,
  pinImageToIPFS,
  pinJSONToIPFS,
} from '../common/utils';
import { TokenMetadata, TransactionFields } from '../common/entities';

const defaultMetadata: TokenMetadata = {
  schema: METADATA_SCHEMA,
  nftType: NFT_TYPE,
  name: '',
  description: '',
  image: '',
};

export default function AddMetadata() {
  const { xrplClient, photoFile } = useGlobalState();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<TokenMetadata>(defaultMetadata);

  const file = photoFile.replace('file://', '');
  const txFields: TransactionFields = {
    walletSeed: Config.WALLET_SEED,
    flags: 11,
    transferFee: TRANSFER_FEE,
    taxon: 0,
  };

  async function handleMint(): Promise<void> {
    setIsLoading(true);
    await xrplClient.connect();
    const wallet = Wallet.fromSeed(Config.WALLET_SEED);
    const imageResponse = await pinImageToIPFS(file);
    const metadataWithImage = {
      ...metadata,
      image: formatCIDtoIPFS(imageResponse.IpfsHash),
    };
    const jsonResponse = await pinJSONToIPFS(metadataWithImage);
    try {
      if (wallet && jsonResponse) {
        const metadataUri = formatCIDtoIPFS(jsonResponse.IpfsHash);
        const response = await mintNft(
          txFields,
          xrplClient,
          wallet,
          metadataUri,
        );
        if (response.result.meta && typeof response.result.meta !== 'string') {
          console.log(getNFTokenID(response.result.meta));
        }
        navigation.navigate('Minted');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Oops!', error.message);
      }
    } finally {
      setIsLoading(false);
    }
    xrplClient.disconnect();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <Pressable onPress={Keyboard.dismiss} style={styles.container}>
        <Image
          source={{
            uri: photoFile,
          }}
          style={styles.image}
        />
        <View style={styles.textGroup}>
          <View>
            <TextInput
              value={metadata.name}
              onChangeText={name => setMetadata({ ...metadata, name })}
              style={styles.titleInput}
              multiline={false}
              placeholder="title"
              placeholderTextColor="silver"
            />
          </View>
          <View>
            <TextInput
              value={metadata.description}
              onChangeText={description =>
                setMetadata({ ...metadata, description })
              }
              style={styles.captionInput}
              multiline={true}
              placeholder="description"
              placeholderTextColor="silver"
            />
          </View>
        </View>
        <View style={styles.nav}>
          <Button onPress={navigation.goBack} title="back" color="#9572FD" />
          <Pressable
            onPress={handleMint}
            style={isLoading ? styles.disabledButton : styles.mainButton}
            disabled={isLoading}>
            <Text style={{ color: 'ghostwhite' }}>mint!</Text>
          </Pressable>
        </View>
      </Pressable>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="tomato" />
        </View>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 24,
    width: '100%',
    backgroundColor: 'thistle',
  },
  image: {
    height: '40%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
  },
  textGroup: {
    width: '100%',
    flex: 1,
    marginVertical: 24,
    gap: 12,
  },
  captionInput: {
    backgroundColor: 'ghostwhite',
    borderRadius: 12,
    padding: 12,
    height: '80%',
  },
  titleInput: {
    backgroundColor: 'ghostwhite',
    borderRadius: 12,
    padding: 12,
    height: 48,
  },
  nav: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  mainButton: {
    backgroundColor: '#9572FD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    minWidth: 100,
  },
  disabledButton: {
    backgroundColor: 'silver',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    minWidth: 100,
  },
  loading: {
    flexGrow: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(216, 191, 216, 0.25)',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
