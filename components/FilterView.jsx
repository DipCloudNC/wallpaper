import { View, Text, StyleSheet, Pressable } from "react-native";
import { capitalize, hp } from "../helpers/common";
import { theme } from "../constants/theme";

export const SectionView = ({ title, content }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export const CommonFilterRow = ({ data, fiterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [fiterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[fiterName] == item;
          let backgroundColor = isActive ? theme.colors.neutral(0.7) : "white";
          let color = isActive ? "white" : theme.colors.neutral(0.7);
          return (
            <Pressable
              key={index}
              onPress={() => onSelect(item)}
              style={[styles.outlineBtn, { backgroundColor }]}
            >
              <Text style={[styles.outlineBtnText, { color }]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilter = ({ data, fiterName, filters, setFilters }) => {
  const onSelect = (item) => {
    setFilters({ ...filters, [fiterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item, index) => {
          let isActive = filters && filters[fiterName] == item;
          let borderColor = isActive ? theme.colors.neutral(0.5) : "white";

          return (
            <Pressable key={index} onPress={() => onSelect(item)}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]}></View>
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 10,
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    backgroundColor: theme.colors.white,
    marginBottom: 5,
  },
  outlineBtnText: {
    fontSize: hp(1.5),
    fontWeight: theme.fontWeights.medium,
    color: theme.colors.neutral(0.6),
    textTransform: "capitalize",
    letterSpacing: 1,
  },
  colorWrapper: {
    padding: 2,
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderWidth: 2,
  },
  color: {
    width: 40,
    height: 30,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
});
