import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
  Dimensions,
  Pressable,
} from "react-native";
import { utils } from "@react-native-firebase/app";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { checkNull } from "../utils/CurrencyFormat";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Product,Variant } from "../model/product/Products";
import { formatCurrency } from "../utils/CurrencyFormat";
const AddProduct = ({ navigation, router }) => {
  const [product, setProduct] = useState<Product>({id:'', name:'',unit:''});
  const [variants, setVariants] = useState<Variant[]>([{}]);
  const [variant, setVariant] = useState<Variant>({})
  const windowWidth = Dimensions.get("window").width;
  // const handleChangeName = (name) => {
  //   setProduct({ ...product, name });
  // };
  // const handleChangePrice = (price) => {
  //   setProduct({ ...product, price });
  // };
  // const handleChangeAmount = (packing) => {

  //   setProduct({ ...product, packing });
  // };
  const chooseImage = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 5,
      },
      (response) => {
        setProduct({
          ...product,
          urls: response.assets?.map((item) => {
            return item.uri;
          }),
        });
      }
    );
  };
  const chooseImageForVariant = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 5,
      },
      (response) => {
        setVariant({
          ...variant,
          urls: response.assets?.map((item) => {
            return item.uri;
          }),
        });
      }
    );
  };
  useEffect(() => {
    return () => {
      setProduct;
    };
  }, [product]);
  //tai anh tra ve url
  const getDownloadURL = async (filename) => {
    let url = await storage().ref(filename).getDownloadURL();
    return url;
  };
  // them san pham

  const addProduct = async () => {
    //m???ng image product ???? ???????c upload
    const response = await uploadImages(product.urls);
    await firestore()
      .collection("products")
      .add({ ...product, image: response })
      .then((res) => {
        console.log(res);
        console.log("Saved data!");
      });
    setProduct({});
  };
  const uploadImages = async (images) => {
    let imagesUploaded = [];
    let urlsUploaded = [];
    for (const image of images) {
      const url = await uploadAnImage(image);
      imagesUploaded.push(url);
    }
    for (const imageUploaded of imagesUploaded) {
      const urlUploaded = await storage().ref(imageUploaded).getDownloadURL();
      urlsUploaded.push(urlUploaded);
    }
    return urlsUploaded;
  };
  const onChangeTextMutil = (text) => {
    console.log(text);
  };
  const uploadAnImage = (filename) => {
    return new Promise((resolve, reject) => {
      //pathTofile l?? t??n file ???????c l??u tr??n storage
      const pathToFile = filename.substring(filename.lastIndexOf("/") + 1);
      //reference l?? ???????ng d???n th?? m???c tr??n storage
      const reference = storage().ref(`products/${pathToFile}`);
      //filename l?? ???????ng d???n tuy???t ?????i d???n t???i file trong device
      const task = reference.putFile(filename);
      task.on("state_changed", (taskSnapshot) => {});
      task
        .then((res) => {
          resolve(res?.metadata?.fullPath || "");
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };
  return (
    <View>
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <TextInput
          style={styles.input}
          placeholder="T??n s???n ph???m"
          onChangeText={(name) => {
            setProduct({ ...product, name });
          }}
        />
        {/* {product.name.length===0?<Text style={{color: 'red', paddingLeft: 20, marginTop: 8}}>{"Kh??ng ???????c b??? tr???ng"}</Text>:null} */}

        
        {variants.map(( item: any, index: number) => {
          
          return (
            <View key={index}>
              <Text style={{marginTop: 16}}>{`Ph??n lo???i ${index+1}`}</Text>

              <TextInput
                style={styles.input}
                placeholder="T??n lo???i"
                onChangeText={(text: string) => {}}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 8,
                }}
              >
                <View>
                  <Text>Gi?? nh???p</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Gi?? nh???p"
                    keyboardType="numeric"
                    onChangeText={(text: string) => {}}
                  />
                </View>
                <View>
                  <Text>Gi?? b??n</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Gi?? b??n"
                    keyboardType="numeric"
                    onChangeText={(text: string) => {if(text.length===2){

                    }}}
                  />
                </View>
                <View>
                  <Text>S??? l?????ng</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="S??? l?????ng"
                    keyboardType="numeric"
                    onChangeText={(text: string) => {}}
                  />
                </View>
              </View>

              <View style={{ marginTop: 8 }}>
                <Text>Quy c??ch</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Quy c??ch"
                  onChangeText={(text: string) => {}}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop:8
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <Text>Size</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Size"
                    onChangeText={(text: string) => {}}
                  />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text>H????ng v???</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="H????ng v???"
                    onChangeText={(text: string) => {}}
                  />
                </View>
                <View style={{ flexDirection: "column" }}>
                  <Text>M??u s???c</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="M??u s???c"
                    onChangeText={(text: string) => {}}
                  />
                </View>
              </View>
              <View
                style={{ borderWidth: 1, borderColor: "#DDD", marginTop: 20 }}
              ></View>
              <TouchableOpacity style={styles.btnChooseImage} onPress={chooseImageForVariant}>
          <Text>Choose Image</Text>
          <View style={{ flexDirection: "row" }}>
          {variant.urls
            ? variant.urls.map((item, index) => {
                if (variant.urls.length <= 4) {
                  return (
                    <View key={index}>
                      <TouchableOpacity key={index}>
                        <Image
                          source={{ uri: item }}
                          style={{
                            width: (windowWidth - 20) / 4,
                            height: (windowWidth - 20) / 4,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  if (index < 4) {
                    return (
                      <View key={index}>
                        <TouchableOpacity>
                          <Image
                            source={{ uri: item }}
                            style={{
                              width: (windowWidth - 20) / 4,
                              height: (windowWidth - 20) / 4,
                            }}
                          />
                          {index === 3 ? (
                            <View style={styles.overlayImage}>
                              <Text
                                style={{ color: "white", fontSize: 20 }}
                              >{`+${variant.urls.length - 3}`}</Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    );
                  }
                }
              })
            : null}
        </View>
        </TouchableOpacity>
            </View>
          );
        })}
        <Pressable
          style={styles.btnChooseImage}
          onPress={() => {
            console.log(variants)
            setVariants([...variants, {}  ]);
          }}
        >
          <Text>Th??m bi???n th???</Text>
        </Pressable>
        <TouchableOpacity style={styles.btnChooseImage} onPress={chooseImage}>
          <Text>Choose Image</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row" }}>
          {product.urls
            ? product.urls.map((item, index) => {
                if (product.urls.length <= 4) {
                  return (
                    <View key={index}>
                      <TouchableOpacity key={index}>
                        <Image
                          source={{ uri: item }}
                          style={{
                            width: (windowWidth - 20) / 4,
                            height: (windowWidth - 20) / 4,
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                } else {
                  if (index < 4) {
                    return (
                      <View key={index}>
                        <TouchableOpacity>
                          <Image
                            source={{ uri: item }}
                            style={{
                              width: (windowWidth - 20) / 4,
                              height: (windowWidth - 20) / 4,
                            }}
                          />
                          {index === 3 ? (
                            <View style={styles.overlayImage}>
                              <Text
                                style={{ color: "white", fontSize: 20 }}
                              >{`+${product.urls.length - 3}`}</Text>
                            </View>
                          ) : null}
                        </TouchableOpacity>
                      </View>
                    );
                  }
                }
              })
            : null}
        </View>
        <TouchableOpacity style={styles.btnSignIn} onPress={addProduct}>
          <Text style={styles.txtBtnSignIn}>Add</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
export default AddProduct;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDD",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: 8,
    borderColor: "#F7F3E3",
    width: "100%",
    height: 40,
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FBFBFB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnSignIn: {
    backgroundColor: "#000",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  txtBtnSignIn: {
    fontWeight: "800",
    fontSize: 16,
    color: "white",
  },
  btnChooseImage: {
    marginTop: 30,
    height: 30,
    backgroundColor: "#F9B500",
    width: 100,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,.5)",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
