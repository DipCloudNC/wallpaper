import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { theme } from "./../../constants/theme";
import { hp, wp } from "../../helpers/common";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import Categories from "../../components/categories";
import { apiCall } from "../../api";
import ImageGrid from "../../components/ImageGrid";
import { debounce } from "lodash";
import FiltersModal from "../../components/FiltersModal";
import { useRouter } from "expo-router";

var page = 1;

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const searchInputRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [filters, setFilters] = useState(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const [isEndReached, setIsEndReached] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await apiCall(params);
    // console.log("got result", res.data?.hits[0]);
    console.log("params:", params, append);

    if (res.sucess && res?.data?.hits) {
      if (append) {
        setImages([...images, ...res.data?.hits]);
      } else {
        setImages([...res.data?.hits]);
      }
    }
  };

  const openFiltersModal = () => {
    modalRef.current?.present();
  };
  const closeFiltersModal = () => {
    modalRef.current?.close();
  };

  const applyFilters = () => {
    //console.log("apply filters");
    if (filters) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filters,
      };

      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }

    closeFiltersModal();
  };
  const resetFilters = () => {
    // console.log("reseting filters");
    if (filters) {
      page = 1;
      setFilters(null);
      setImages([]);
      let params = {
        page,
      };

      if (activeCategory) params.category = activeCategory;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFiltersModal();
  };

  const clearThisFilter = (fiterName) => {
    let filterz = { ...filters };
    delete filterz[fiterName];
    setFilters({ ...filterz });
    page = 1;
    setImages([]);
    let params = {
      page,
      ...filterz,
    };
    if (activeCategory) params.category = activeCategory;
    if (search) params.q = search;
    fetchImages(params, false);
  };

  const handleChangeCategory = (cate) => {
    setActiveCategory(cate);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filters,
    };
    if (cate) params.category = cate;
    {
      fetchImages(params, false);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      //search for this text or images
      page = 1;
      setImages([]);
      setActiveCategory(null); // reset active category when searching
      fetchImages({ page, q: text, ...filters }, false);
    }

    if (text == "") {
      //reset search results or images
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      setActiveCategory(null); // reset active category when searching
      fetchImages({ page, ...filters }, false);
    }
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  // console.log("Active Category: " + activeCategory);

  console.log("Filters : ", filters);

  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const handleScroll = (event) => {
    // console.log("scroll event is fired");
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;
    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        console.log("Reached the bottom of the scrollView");
        // fetch the more images
        page++;
        let params = {
          page,
          ...filters,
        };
        if (activeCategory) params.category = activeCategory;
        if (search) params.q = search;
        fetchImages(params);
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.titel}>Pixels...</Text>
        </Pressable>
        <Pressable onPress={openFiltersModal}>
          <FontAwesome6
            name="bars-staggered"
            size={24}
            color={theme.colors.neutral(0.7)}
          />
        </Pressable>
      </View>

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={5} // how often scroll events are throttled will fire while scrolling in milliseconds
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        {/* search bar */}
        <View style={styles.searchBar}>
          <Feather
            style={styles.searchIcon}
            name="search"
            size={24}
            color={theme.colors.neutral(0.4)}
          />
          <TextInput
            style={styles.searchInput}
            ref={searchInputRef}
            onChangeText={handleTextDebounce}
            placeholder="Search for photos..."
          />
          {search && (
            <Pressable onPress={() => handleSearch("")}>
              <Ionicons
                name="close-circle"
                size={24}
                color={theme.colors.neutral(0.4)}
              />
            </Pressable>
          )}
        </View>

        {/* categories */}
        <View style={styles.categories}>
          <Categories
            activeCategory={activeCategory}
            handleChangeCategory={handleChangeCategory}
          />
        </View>

        {/* sort by OR filter */}

        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItems}>
                    {key == "colors" ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      ></View>
                    ) : (
                      <Text style={styles.filterItemsText}>
                        {" "}
                        {filters[key]}
                      </Text>
                    )}

                    <Pressable
                      style={styles.closeIcon}
                      onPress={() => clearThisFilter(key)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={14}
                        color={theme.colors.neutral(0.5)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* images Masonry grid layout */}
        <View style={styles.gridLayout}>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>

        {/* loading */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </ScrollView>

      {/* filters modal */}

      <FiltersModal
        modalRef={modalRef}
        filters={filters}
        setFilters={setFilters}
        onClose={closeFiltersModal}
        onApply={applyFilters}
        onReset={resetFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titel: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radius.xl,
    padding: 6,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 6,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
    fontSize: hp(1.8),
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItems: {
    backgroundColor: theme.colors.grayBG,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemsText: {
    fontSize: hp(1.8),
    color: theme.colors.neutral(0.8),
    textTransform: "capitalize",
  },
  closeIcon: {
    color: theme.colors.neutral(0.8),
  },
});
