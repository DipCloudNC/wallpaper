import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import { capitalize, hp } from "../helpers/common";
import { theme } from "../constants/theme";
import { ColorFilter, CommonFilterRow, SectionView } from "./FilterView";
import { data } from "../constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function FiltersModal({
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters,
}) {
  const snapPoints = useMemo(() => ["80%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={costumeBackDrop}
      //onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filtersText}>Filters</Text>
          {Object.keys(sections).map((sectonName, index) => {
            let sectionView = sections[sectonName];
            let sectionData = data.filters[sectonName];
            let title = capitalize(sectonName);
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
                key={sectonName}
              >
                <SectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    fiterName: sectonName,
                  })}
                />
              </Animated.View>
            );
          })}

          {/* actions */}
          <Animated.View
            entering={FadeInDown.delay(500).springify().damping(11)}
            style={styles.buttons}
          >
            <Pressable style={styles.resetBtn} onPress={onReset}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </Pressable>
            <Pressable style={styles.applyBtn} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const sections = {
  order: (props) => <CommonFilterRow {...props} />,
  orientation: (props) => <CommonFilterRow {...props} />,
  image_type: (props) => <CommonFilterRow {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const costumeBackDrop = ({ style }) => {
  const containerStyle = [StyleSheet.absoluteFill, style, styles.overlay];

  return (
    <View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  content: {
    //flex: 1,
    gap: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    // width: "100%",
  },
  filtersText: {
    fontSize: hp(2.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
    letterSpacing: 1,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    width: "100%",
  },
  resetBtn: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.1),
    borderRadius: theme.radius.xl,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  applyBtn: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    borderRadius: theme.radius.xl,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
  },
  buttonText: {
    fontSize: hp(2.2),
  },
});
