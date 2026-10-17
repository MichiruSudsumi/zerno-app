import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Unbounded_600SemiBold } from '@expo-google-fonts/unbounded';
import { GolosText_400Regular, GolosText_500Medium, GolosText_600SemiBold, GolosText_700Bold } from '@expo-google-fonts/golos-text';

import { StoreProvider, useStore } from './src/store';
import { colors } from './src/theme';
import { Icon, T } from './src/ui';
import StartScreen from './src/screens/StartScreen';
import MenuScreen from './src/screens/MenuScreen';
import DrinkScreen from './src/screens/DrinkScreen';
import CartScreen from './src/screens/CartScreen';
import StatusScreen from './src/screens/StatusScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const TABS = { menu: MenuScreen, orders: OrdersScreen, profile: ProfileScreen };
const STACK = { drink: DrinkScreen, cart: CartScreen, status: StatusScreen };

function TabBar({ tab, setTab, activeOrders }) {
  const insets = useSafeAreaInsets();
  const items = [
    { id: 'menu', title: 'Меню', icon: 'cup' },
    { id: 'orders', title: 'Заказы', icon: 'list' },
    { id: 'profile', title: 'Профиль', icon: 'user' },
  ];
  return (
    <View style={[st.tabs, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {items.map((it) => {
        const on = it.id === tab;
        const color = on ? colors.ink : colors.soft;
        return (
          <Pressable key={it.id} onPress={() => setTab(it.id)} accessibilityRole="tab" accessibilityState={{ selected: on }} style={st.tab}>
            <View>
              <Icon name={it.icon} color={color} />
              {it.id === 'orders' && activeOrders > 0 ? <View style={st.badge} /> : null}
            </View>
            <T weight="semibold" style={{ fontSize: 11, color }}>{it.title}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

function Toast() {
  const { toastText } = useStore();
  const insets = useSafeAreaInsets();
  if (!toastText) return null;
  return (
    <View pointerEvents="none" style={[st.toastWrap, { top: insets.top + 8 }]}>
      <View style={st.toast}>
        <Icon name="check" size={18} color={colors.orange} width={2.4} />
        <T weight="semibold" style={{ color: '#FFFFFF', fontSize: 14 }}>{toastText}</T>
      </View>
    </View>
  );
}

function Root() {
  const { state } = useStore();
  const [tab, setTabState] = useState('menu');
  const [stack, setStack] = useState([]);

  const nav = useMemo(() => ({
    push: (name, params = {}) => setStack((s) => [...s, { name, params }]),
    replace: (name, params = {}) => setStack((s) => [...s.slice(0, -1), { name, params }]),
    back: () => setStack((s) => s.slice(0, -1)),
    setTab: (t) => { setStack([]); setTabState(t); },
  }), []);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (stack.length) { nav.back(); return true; }
      if (tab !== 'menu') { nav.setTab('menu'); return true; }
      return false;
    });
    return () => sub.remove();
  }, [stack.length, tab, nav]);

  if (!state.shopId) {
    return (<><StatusBar style="dark" /><StartScreen /></>);
  }

  const top = stack[stack.length - 1];
  if (top) {
    const Screen = STACK[top.name];
    const dark = top.name === 'status';
    return (<><StatusBar style={dark ? 'light' : 'dark'} /><Screen nav={nav} params={top.params} /></>);
  }

  const Tab = TABS[tab];
  const activeOrders = state.orders.filter((o) => o.status !== 'done').length;
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}><Tab nav={nav} /></View>
      <TabBar tab={tab} setTab={nav.setTab} activeOrders={activeOrders} />
    </View>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    Unbounded_600SemiBold,
    GolosText_400Regular,
    GolosText_500Medium,
    GolosText_600SemiBold,
    GolosText_700Bold,
  });

  if (!loaded && !error) return <View style={{ flex: 1, backgroundColor: colors.orange }} />;

  return (
    <SafeAreaProvider>
      <StoreProvider>
        <View style={{ flex: 1, backgroundColor: colors.milk }}>
          <Root />
          <Toast />
        </View>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  tabs: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1.5, borderTopColor: colors.foam, paddingTop: 10, backgroundColor: colors.milk },
  tab: { alignItems: 'center', gap: 4, minWidth: 72, minHeight: 44 },
  badge: { position: 'absolute', top: -2, right: -4, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.orange, borderWidth: 1.5, borderColor: colors.milk },
  toastWrap: { position: 'absolute', left: 20, right: 20, alignItems: 'center' },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.ink, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16 },
});
