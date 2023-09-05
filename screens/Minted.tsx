import React from 'react';
import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Container from '../components/Container';
import Firework from '../assets/Firework';
import { useGlobalState } from '../globalState/GlobalStateContext';

export default function Minted() {
  const { photoFile } = useGlobalState();
  const navigation = useNavigation();

  return (
    <Container backgroundColor="thistle">
      <View style={styles.container}>
        <ImageBackground
          source={{
            uri: photoFile,
          }}
          style={styles.image}
        />
        <View style={styles.animation}>
          <Firework />
        </View>
        <View style={styles.textContainer}>
          <Image source={require('../assets/uni.png')} />
          <Text style={styles.title}>Hooray! A fresh NFT has been minted.</Text>
          <Text>
            Your one-of-a-kind token is now on the XRP Ledger blockchain,
            ensuring ownership and authenticity without any possibility of
            copying or dividing it. 😊
          </Text>
          <View style={styles.nav}>
            <Button
              onPress={() => navigation.navigate('Home')}
              title="home"
              color="#9572FD"
            />
            <Pressable
              onPress={() => navigation.navigate('Home', { screen: 'MyNFTS' })}
              style={styles.mainButton}>
              <Text style={{ color: 'ghostwhite' }}>view my NFTs</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  animation: {
    width: '100%',
    position: 'absolute',
    top: -80,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    gap: 12,
    width: '80%',
    position: 'absolute',
    bottom: 100,
    widht: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'ghostwhite',
    borderRadius: 12,
    paddingHorizontal: 36,
    paddingVertical: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    opacity: 0.9,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  mainButton: {
    backgroundColor: '#9572FD',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
});
