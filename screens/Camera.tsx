import React, { useState, useCallback, useEffect } from 'react';
import { Pressable, Image, View, StyleSheet } from 'react-native';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

import Container from '../components/Container';
import { useGlobalState } from '../globalState/GlobalStateContext';

export default function Camera() {
  const [pickerResponse, setPickerResponse] =
    useState<ImagePickerResponse | null>(null);

  const navigation = useNavigation();
  const { updatePhotoFile } = useGlobalState();

  const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;

  useEffect(() => {
    if (pickerResponse && uri) {
      updatePhotoFile(uri);
      navigation.navigate('Preview');
    }
  }, [pickerResponse]);

  const onCameraPress = useCallback(() => {
    const options: CameraOptions = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchCamera(options, setPickerResponse);
  }, []);

  const onImageLibraryPress = useCallback(() => {
    const options: ImageLibraryOptions = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, setPickerResponse);
  }, []);

  return (
    <Container backgroundColor="blue">
      <View style={styles.container}>
        <Pressable onPress={onCameraPress}>
          <View>
            <Image source={require('../assets/camera.png')} />
          </View>
        </Pressable>
        <Pressable onPress={onImageLibraryPress}>
          <View>
            <Image source={require('../assets/gallery.png')} />
          </View>
        </Pressable>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'thistle',
    gap: 48,
  },
  nav: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
});
