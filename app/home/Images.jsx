import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { theme } from "../../constants/theme";
import { Entypo, Octicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Toast from "react-native-toast-message";
import * as MediaLibrary from "expo-media-library";
import { hp, wp } from "../../helpers/common";

export default function Images() {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState("Loading");

  const uri = item?.webformatURL;
  const filename = item?.previewURL?.split("/").pop();
  const imageUrl = uri;
  const filePath = `${FileSystem.documentDirectory}${filename}`;

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "You need to grant permission to access the media library."
        );
      }
    })();
  }, []);

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      // portrait image
      calculatedWidth = calculatedHeight * aspectRatio;
    }

    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const onLoad = () => {
    setStatus("");
  };

  const handleDownloadImage = async () => {
    setStatus("downloading");
    const uri = await handleSaveImage();
    if (uri) {
      Toast.show({
        type: "success",
        text1: "Image Download",
        position: "top",
      });
      console.log("Image saved");

      // Add the image to the media library
      await MediaLibrary.createAssetAsync(uri);
    }
  };

  const handleShareImage = async () => {
    setStatus("sharing");
    const uri = await handleSaveImage();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
  };

  const handleSaveImage = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      setStatus("");
      console.log("Image saved successfully", uri);
      return uri;
    } catch (error) {
      console.error("Download failed: ", error.message);
      setStatus("");
      Alert.alert("Image", error.message);
      return null;
    }
  };

  const toastConfig = {
    success: (internalToast) => (
      <View style={[styles.toastContainer, styles.successToast]}>
        <Text style={styles.toastText}>{internalToast.text1}</Text>
      </View>
    ),
    error: (internalToast) => (
      <View style={[styles.toastContainer, styles.errorToast]}>
        <Text style={styles.toastText}>{internalToast.text1}</Text>
      </View>
    ),
    info: (internalToast) => (
      <View style={[styles.toastContainer, styles.infoToast]}>
        <Text style={styles.toastText}>{internalToast.text1}</Text>
      </View>
    ),
  };

  return (
    <BlurView style={styles.container} tint="dark" intensity={100}>
      <View style={[getSize()]}>
        <View style={styles.loading}>
          {status === "Loading" && (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <Image
          style={[styles.image, getSize()]}
          transition={100}
          source={uri}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable onPress={() => router.back()} style={styles.button}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable onPress={handleDownloadImage} style={styles.button}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable onPress={handleShareImage} style={styles.button}>
              <Entypo name="share" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
      </View>
      <Toast config={toastConfig} visibilityTime={2500} />
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(4),
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.1)",
  },
  loading: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    width: "100%",
    paddingHorizontal: wp(4),
  },
  button: {
    backgroundColor: "rgba(255, 255, 255,0.2)",
    borderRadius: theme.radius.lg,
    justifyContent: "center",
    alignItems: "center",
    width: hp(6),
    height: hp(6),
    shadowColor: "#000",
  },
  toastContainer: {
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    alignItems: "center",
  },
  toastText: {
    color: "white",
    fontWeight: "bold",
  },
  toastSubText: {
    color: "white",
    fontSize: 12,
  },
  successToast: {
    backgroundColor: "green",
  },
  errorToast: {
    backgroundColor: "red",
  },
  infoToast: {
    backgroundColor: "blue",
  },
});
