import { Pressable, StyleSheet } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { getImageSize, wp } from "../helpers/common";
import { theme } from "../constants/theme";

export default function ImageCard({ item, index, columns, router }) {
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = item;
    return { height: getImageSize(height, width) };
  };

  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  };

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "home/Images", params: { ...item } })
      }
      style={[styles.ImagesWrapper, !isLastInRow() && styles.Spacing]}
    >
      <Image
        style={[styles.Images, getImageHeight()]}
        source={item?.webformatURL}
        transition={100}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  Images: {
    width: "100%",
    height: 300,
  },
  ImagesWrapper: {
    backgroundColor: theme.colors.grayBG,
    marginBottom: 10,
    borderRadius: theme.radius.xl,
    overflow: "hidden",
  },
  Spacing: {
    marginRight: wp(2),
  },
});
