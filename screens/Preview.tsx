import React from 'react';
import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Container from '../components/Container';
import { useGlobalState } from '../globalState/GlobalStateContext';

export default function Preview() {
  const { photoFile } = useGlobalState();
  const navigation = useNavigation();

  return (
    <Container backgroundColor="thistle">
      <View style={styles.container}>
        <Image
          source={{
            uri: photoFile,
          }}
          style={styles.image}
        />
        <View style={styles.nav}>
          <Button onPress={navigation.goBack} title="retake" color="#9572FD" />
          <Pressable
            onPress={() => navigation.navigate('AddMetadata')}
            style={styles.mainButton}>
            <Text style={{ color: 'ghostwhite' }}>add a caption</Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 24,
    height: '100%',
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    borderRadius: 12,
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
  },
});
