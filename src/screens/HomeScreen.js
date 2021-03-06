import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  useWindowDimensions,
  Pressable
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

const windowWidth = Dimensions.get("window").width;

import { Header, Icon } from "react-native-elements";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AllProductsScreen from "./AllProductsScreen";
import BeveragesScreen from "./BeveragesScreen";
import CondimentsScreen from "./CondimentsScreen";
const renderScene = SceneMap({
  all: AllProductsScreen,
  beverages: BeveragesScreen,
  condiments: CondimentsScreen,
});

const HomeScreen = ({ navigation }) => {
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "all", title: "Tất cả sản phẩm" },
    { key: "beverages", title: "Đồ uống" },
    { key: "condiments", title: "Gia vị" },
    // { key: "confections", title: "Bánh kẹo" },
    // { key: "dairyProducts", title: "Sữa" },
  ]);

  const onRenderTabBar = (props) => {
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          return (
            <Pressable
              onPress={() => setIndex(i)}
              key={i}
              style={[
                styles.btnTab,
                {
                  borderWidth: index === i ? 0.5 : 0,
                  backgroundColor: index === i ? "#F9B500" : "#FFF",
                  borderColor: "#F9B500",
                },
              ]}
            >
              <View style={[styles.viewTxtBtnTabs]}>
                <Text>{route.title}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Header
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ["#F9B500", "#F9B500"],
        }}
        centerComponent={{
          text: "Danh sách sản phẩm",
          style: styles.heading,
        }}
        leftComponent={
          <View>
            {/* <Icon type="antdesign" name="home" color="white" /> */}
          </View>
        }
        rightComponent={
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Icon type="antdesign" name="search1" />
          </TouchableOpacity>
        }
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={onRenderTabBar}
        // lazy={({route})=>route.name === 'first'}
      />
      {/* <FlatList
        data={products}
        renderItem={renderItem}
        style={styles.flatlist}
        horizontal={false}
        numColumns={2}
        contentContainerStyle={styles.contentContainerStyle}
        columnWrapperStyle={styles.columnWrapperStyle}
      /> */}
    </View>
  );
};
export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },

  itemProduct: {
    justifyContent: "center",
    flexDirection: "column",
    width: (windowWidth - 36) / 2,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    elevation: 1,
    shadowOffset: {
      height: 0,
      width: 2,
    },
    shadowRadius: 5,
    backgroundColor: "#FFF",
    margin: 6,
    borderRadius: 8,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    color: "black",
    fontFamily: "Oswald-Regular",
    fontWeight: "400",
  },
  tabBar: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.6,
    borderBottomColor: '#DDD',
    shadowColor: "#FFF", // màu bóng
    shadowOffset: {
      width: 0,
      height: 1,
    }, //độ lệch bóng ios
    shadowOpacity: 0.25, //độ mờ của bóng ios
    shadowRadius: 5, // bán kính bóng mờ ios
    elevation: 5, //
    backgroundColor: '#FFF'
    
  },
  btnTab: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    borderRadius: 30,
    shadowColor: "#000", // màu bóng
    shadowOffset: {
      width: 0,
      height: 1,
    }, //độ lệch bóng ios
    shadowOpacity: 0.25, //độ mờ của bóng ios
    shadowRadius: 5, // bán kính bóng mờ ios
    elevation: 2, //
    marginHorizontal: 5,
  },
  txtBtnTab: {},
  viewTxtBtnTabs: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
