import React, { useEffect, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  Modal,
  Text,
  StyleSheet,
  View,
  ScrollView,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import { Wallet, convertHexToString } from 'xrpl';
import { useNavigation } from '@react-navigation/native';
import Config from 'react-native-config';

import Container from '../components/Container';
import { useGlobalState } from '../globalState/GlobalStateContext';
import { getGatewayUrl, getMetadata, getNfts } from '../common/utils';
import { TokenMetadata } from '../common/entities';

export default function MyNFTS() {
  const { xrplClient } = useGlobalState();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [metadata, setMetadata] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedNft, setSelectedNft] = useState<TokenMetadata>();
  const { width } = useWindowDimensions();

  const imageWidth = width / 2 - 36;

  async function getMyNFTS(): Promise<void> {
    setIsLoading(true);
    await xrplClient.connect();
    const wallet = Wallet.fromSeed(Config.WALLET_SEED);
    try {
      if (wallet) {
        const response = await getNfts(xrplClient, wallet);
        const {
          result: { account_nfts },
        } = response;
        const metadataCids = account_nfts.map(nft => {
          if (nft.URI !== undefined)
            return convertHexToString(nft.URI).split('//')[1];
        });
        const cids = metadataCids.filter(cid => cid) as string[];
        await getAllMetadata(cids);
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

  async function getAllMetadata(cids: string[]): Promise<void> {
    const metadata = await Promise.all(
      cids.map(async cid => await getMetadata(cid)),
    );
    setMetadata(metadata);
  }

  function openModal(metadata: TokenMetadata): void {
    setSelectedNft(metadata);
    setIsModalVisible(true);
  }

  function closeModal(): void {
    setIsModalVisible(false);
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMyNFTS();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Container backgroundColor="thistle">
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My NFTs</Text>
      </View>
      <ScrollView
        contentContainerStyle={{
          width: '100%',
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <View style={styles.imageContainer}>
          {metadata && metadata.length
            ? metadata.map((md: TokenMetadata) => (
                <View key={md.image}>
                  <Pressable onPress={() => openModal(md)}>
                    <Image
                      source={{ uri: getGatewayUrl(md.image) }}
                      style={{
                        width: imageWidth,
                        height: imageWidth,
                        borderRadius: 6,
                      }}
                    />
                  </Pressable>
                </View>
              ))
            : null}
          <View style={{ width: imageWidth, height: imageWidth }}></View>
        </View>
        {selectedNft ? (
          <Modal
            animationType="fade"
            visible={isModalVisible}
            transparent={true}
            onRequestClose={() => closeModal}>
            <View style={styles.modalContainer}>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <View style={styles.modal}>
                  {selectedNft.name ? (
                    <Text>Name: {selectedNft.name}</Text>
                  ) : null}
                  {selectedNft.description ? (
                    <Text>Description: {selectedNft.description}</Text>
                  ) : null}
                </View>
              </Pressable>
            </View>
          </Modal>
        ) : null}
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="tomato" />
          </View>
        ) : null}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loading: {
    flexGrow: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'thistle',
    justifyContent: 'center',
    alignContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    padding: 12,
  },
  title: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#9572FD',
  },
  imageContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 12,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'stretch',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 12,
    borderRadius: 12,
  },
  modal: {
    height: '60%',
    marginTop: 200,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 12,
    alignItems: 'flex-start',
    backgroundColor: 'ghostwhite',
    opacity: 0.9,
    borderRadius: 12,
    padding: 36,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  nav: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
