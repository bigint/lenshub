import { useAuthStore } from "@/store/auth";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NetInfoProvider } from "../components/providers/net-info";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontLoaded] = useFonts({
    Sans: require("../assets/fonts/sans.ttf"),
    SansM: require("../assets/fonts/sans-m.ttf"),
    SansSB: require("../assets/fonts/sans-sb.ttf"),
    SansB: require("../assets/fonts/sans-b.ttf"),
    Serif: require("../assets/fonts/serif.ttf")
  });
  const hydrate = useAuthStore((state) => state.hydrate);

  const hideSplash = async () => {
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    if (fontLoaded) {
      hydrate();
      hideSplash();
    }
  }, [fontLoaded]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NetInfoProvider />
        <Slot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
