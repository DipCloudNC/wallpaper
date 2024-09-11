import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { hp, wp } from "../helpers/common";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { theme } from "../constants/theme";
import { useRouter } from "expo-router";

export default function WelcomeScren() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("./../assets/images/welcome.png")}
        style={styles.bgImage}
        resizeMode="cover"
      />
      {/* linear-gradient */}
      <Animated.View entering={FadeInDown.duration(600)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />

        {/* content */}
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.duration(400).springify()}
            style={styles.title}
          >
            Welcome to Wallpaper
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(500).springify()}
            style={styles.subtitle}
          >
            Your Personal Wallpaper App...
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.duration(600).springify()}
            style={styles.description}
          >
            Choose your favorite wallpaper, set it as your lock screen, and
            enjoy it everyday.
          </Animated.Text>
          <Animated.View entering={FadeInDown.duration(800)}>
            <Pressable
              onPress={() => router.push("home")}
              style={styles.startBtn}
            >
              <Text style={styles.buttonText}>Start Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  gradient: {
    flex: 1,
    width: wp(100),
    height: hp(65),
    position: "absolute",
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 15,
  },
  title: {
    fontSize: hp(4),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold,
  },
  subtitle: {
    fontSize: hp(2.5),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.semibold,
  },
  description: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.9),
    fontWeight: "400",
    paddingHorizontal: 10,
    textAlign: "center",
    marginBottom: 10,
  },
  startBtn: {
    marginBottom: 50,
    backgroundColor: theme.colors.neutral(0.9),
    padding: 15,
    paddingHorizontal: 90,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  buttonText: {
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.medium,
    textAlign: "center",
    textTransform: "uppercase",
    color: theme.colors.white,
    letterSpacing: 1,
  },
});
