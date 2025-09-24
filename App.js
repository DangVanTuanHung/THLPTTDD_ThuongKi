import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/* ==================== DATA / API ==================== */
const API_URL = "https://example.mockapi.io/phones";

async function fetchPhones() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Bad response");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid JSON");
    return data;
  } catch (e) {
    return SAMPLE_PHONES; // fallback
  }
}

const SAMPLE_PHONES = [
  {
    id: "1",
    name: "Vsmart Joy 3",
    price: 1790000,
    image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758674043/mau_xanh_zrfnoi.png",
    colors: [
      { code: "#BFEAF5", label: "Xanh nhạt", image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758674043/mau_xanh_zrfnoi.png" },
      { code: "#E53935", label: "Đỏ", image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758674758/mau_do_ctjchm.png" },
      { code: "#111111", label: "Đen", image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758674758/mau_den_za6l6r.png" },
      { code: "#FFFFFF", label: "Trang", image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758674759/mau_trang_e2cqye.png" },
    ],
  },
];

const SAMPLE_PRODUCTS = [
  { id: "p1", title: "iPhone 15", price: 22990000, image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758675028/ip15_lmlu0v.png", rating: 4.7 },
  { id: "p2", title: "Galaxy S24", price: 19990000, image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758674043/mau_xanh_zrfnoi.png", rating: 4.6 },
  { id: "p3", title: "Vsmart Joy 3", price: 1790000, image: "https://res.cloudinary.com/drgoc1nwy/image/upload/v1758674758/mau_do_ctjchm.png", rating: 4.2 },
];

/* ==================== HELPERS ==================== */
const currency = (v) => v.toLocaleString("vi-VN");
function Row({ children, gap = 12, center }) {
  return (
    <View style={{ flexDirection: "row", gap, alignItems: center ? "center" : "flex-start" }}>
      {children}
    </View>
  );
}

function RatingStars({ rating = 4.5 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const arr = [0, 1, 2, 3, 4].map((i) => {
    if (i < full) return "star";
    if (i === full && half) return "star-half";
    return "star-outline";
  });
  return (
    <Row center gap={2}>
      {arr.map((name, i) => (
        <Ionicons key={i} name={name} size={15} color="#FFD54F" />
      ))}
    </Row>
  );
}

function MoneyBackBadge() {
  return (
    <View style={styles.badge}>
      <View style={styles.badgeDot} />
      <Text style={styles.badgeText}>Ở ĐÂU RẺ HƠN HOÀN TIỀN</Text>
    </View>
  );
}

function ChooseColorBar({ label = "4 MÀU-CHỌN MÀU", onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.chooseBar}>
      <Text style={styles.chooseBarText}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#222" />
    </Pressable>
  );
}

function BuyButton({ title = "CHỌN MUA", onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.buyBtn}>
      <Text style={styles.buyBtnText}>{title}</Text>
    </Pressable>
  );
}

function VsmartCard({ phone, onChooseColor, onBuy }) {
  return (
    <View style={styles.homeCard}>
      <Row center gap={10}>
        <Image source={{ uri: phone.image }} style={styles.mainPhoneSingle} />
      </Row>

      <Text style={styles.titleLine}>Điện Thoại {phone.name} - Hàng chính hãng</Text>

      <Row center gap={6}>
        <RatingStars rating={4.5} />
        <Text style={styles.ratingCount}>(Xem 828 đánh giá)</Text>
      </Row>

      <Row center gap={10}>
        <Text style={styles.priceBig}>{currency(phone.price)} đ</Text>
        <Text style={styles.oldPrice}>{currency(1790000)} đ</Text>
      </Row>

      <MoneyBackBadge />
      <ChooseColorBar onPress={onChooseColor} />
      <BuyButton onPress={onBuy} />
    </View>
  );
}

/* SELECT PHONE */
const SelectStack = createNativeStackNavigator();

function SelectHomeScreen({ navigation }) {
  const [phones, setPhones] = useState(null);
  useEffect(() => {
    fetchPhones().then(setPhones);
  }, []);
  if (!phones) return <ActivityScreen label="Đang tải danh sách điện thoại..." />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={phones}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <VsmartCard
            phone={item}
            onChooseColor={() => navigation.navigate("SelectColor", { phone: item })}
            onBuy={() => Alert.alert("Đã thêm vào giỏ hàng")}
          />
        )}
      />
    </SafeAreaView>
  );
}
function SelectColorScreen({ route, navigation }) {
  const { phone } = route.params;
  const [colorIndex, setColorIndex] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E7EB" }}>
      <View style={styles.colorPanel}>
        <Row center gap={10}>
          <Image
            source={{ uri: phone.colors[colorIndex]?.image || phone.image }}
            style={styles.smallThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.h3}>{phone.name}</Text>
            <Text style={styles.muted}>Cung cấp bởi Tiki Trading</Text>
            <Text style={[styles.price, { marginTop: 6 }]}>{currency(phone.price)} đ</Text>
          </View>
        </Row>

        <Text style={styles.panelTitle}>Chọn một màu bên dưới:</Text>

        <View style={styles.colorStack}>
          {phone.colors.map((c, i) => (
            <Pressable
              key={i}
              style={[
                styles.colorBox,
                { backgroundColor: c.code },
                i === colorIndex && styles.colorBoxSelected,
              ]}
              onPress={() => setColorIndex(i)}
            />
          ))}
        </View>

        <Pressable
          style={styles.doneBtn}
          onPress={() => navigation.navigate("SelectResult", { phone, colorIndex })}
        >
          <Text style={styles.doneBtnText}>XONG</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
/* ==================== STYLES ==================== */
const styles = StyleSheet.create({
  // shared cards
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  h2: { fontSize: 22, fontWeight: "700", marginBottom: 6 },
  h3: { fontSize: 16, fontWeight: "600" },
  price: { marginTop: 4, color: "#d32f2f", fontWeight: "700" },
  priceBig: { fontSize: 24, color: "#d32f2f", fontWeight: "800", marginTop: 8 },
  muted: { color: "#6b7280" },

  // Screen 1/4 card
  homeCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  mainPhoneSingle: {
  width: "100%",     
  height: 220,        
  borderRadius: 12,
  resizeMode: "contain", 
  marginBottom: 10,
},

  titleLine: { marginTop: 8, color: "#111", fontSize: 13.5 },
  ratingCount: { color: "#71717A", fontSize: 12 },
  oldPrice: { textDecorationLine: "line-through", color: "#9CA3AF", fontWeight: "600" },

  badge: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FF3B30" },
  badgeText: { fontSize: 12, color: "#FF3B30", fontWeight: "700" },
  chooseBar: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
  },
  chooseBarText: { color: "#222", fontWeight: "600" },

  buyBtn: {
    marginTop: 10,
    backgroundColor: "#E53935",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buyBtnText: { color: "#fff", fontWeight: "800", letterSpacing: 0.5 },

  // Select Color screen
  colorPanel: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#BDBDBD",
  },
  smallThumb: { width: 44, height: 44, borderRadius: 8, resizeMode: "cover" },
  panelTitle: { marginTop: 12, marginBottom: 8, color: "#222", fontWeight: "700" },
  colorStack: { gap: 10, width: 64, alignSelf: "center", marginVertical: 8 },
  colorBox: { width: 60, height: 52, borderRadius: 6, borderWidth: 1, borderColor: "#fff" },
  colorBoxSelected: { borderWidth: 3, borderColor: "#3B82F6" },
  doneBtn: {
    marginTop: 14,
    backgroundColor: "#3B5CCC",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  doneBtnText: { color: "#fff", fontWeight: "800", letterSpacing: 0.5 },
});