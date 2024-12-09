import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StatusBar, Image
} from 'react-native';
import { TailwindProvider } from "tailwindcss-react-native";
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'expo-camera';

const App = () => {
  const [CardImage, SetCardImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryStatus = await MediaLibrary.requestPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
      setMediaLibraryPermission(mediaLibraryStatus.status === 'granted');
    })();
  }, []);

  const handleOpenCamera = async () => {
    if (!cameraPermission || !mediaLibraryPermission) {
      alert('Es necesario otorgar permisos para usar la cámara y guardar en la galería.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        // Guarda la foto en la galería
        const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
        await MediaLibrary.createAlbumAsync('Aventura Park', asset, false);

        alert('La foto se guardó correctamente en la galería.');
        SetCardImage(result.assets[0].uri); // Muestra la imagen capturada
      } catch (error) {
        console.error('Error al guardar en la galería:', error);
        alert('Ocurrió un error al guardar la foto en la galería.');
      }
    } else {
      alert('Captura cancelada.');
    }
  };

  return (
    <TailwindProvider>
      <View className="flex-1 bg-[#0664a4]">
        <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />

        {/* Contenedor principal centrado */}
        <View className="flex-1 justify-center items-center">
          {/* Título con texto grande, blanco y bordes negros */}
          <View className="mb-10 items-center">
            <Text
              className="text-white text-center text-5xl font-bold"
              style={{
                textShadowColor: '#000',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Bienvenido al sistema de fotos
              de David López
            </Text>
            <Text
              className="text-white text-center text-3xl font-bold mt-4"
              style={{
                textShadowColor: '#000',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              del Aventura Park
            </Text>
            <Text
              className="text-white text-center text-lg mt-6"
              style={{
                textShadowColor: '#000',
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Presione el botón para hacer una foto
            </Text>
          </View>

          {/* Botón centrado y más grande */}
          <TouchableOpacity
            className="py-8 px-5 w-80 items-center bg-black rounded-2xl"
            onPress={handleOpenCamera}
          >
            <Text className="text-white font-semibold text-xl">Abrir Cámara</Text>
          </TouchableOpacity>

          {/* Imagen capturada */}
          {CardImage && (
            <Image
              source={{ uri: CardImage }}
              style={{
                width: 350,
                height: 230,
                resizeMode: 'cover',
                marginTop: 20,
              }}
            />
          )}
        </View>
      </View>
    </TailwindProvider>
  );
};

export default App;
