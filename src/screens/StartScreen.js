import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shops } from '../data';
import { useStore } from '../store';
import { colors, fonts } from '../theme';
import { Button, H1, Label, T } from '../ui';

export default function StartScreen() {
  const { state, setShop } = useStore();
  const [picked, setPicked] = useState(state.shopId || shops[0].id);
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.milk }}>
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={[st.hero, { paddingTop: insets.top + 24 }]}>
          <View style={st.bigCircle} />
          <View style={st.ring} />
          <View style={st.foam}>
            <View style={st.drop} />
          </View>
          <T weight="display" style={st.logo}>Зерно</T>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 28, gap: 22 }}>
          <View style={{ gap: 10 }}>
            <H1>Кофе без очереди</H1>
            <T style={{ fontSize: 16, lineHeight: 23, color: colors.muted }}>
              Закажите заранее и заберите готовый напиток, когда подойдёте.
            </T>
          </View>

          <View style={{ gap: 10 }}>
            <Label>Кофейни рядом</Label>
            {shops.map((shop) => {
              const on = shop.id === picked;
              return (
                <Pressable key={shop.id} onPress={() => setPicked(shop.id)} accessibilityRole="radio" accessibilityState={{ checked: on }}
                  style={[st.shop, on && { borderColor: colors.ink }]}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <T weight="semibold" style={{ fontSize: 16 }}>{shop.name}</T>
                    <T style={{ fontSize: 13, color: colors.muted }}>{shop.distance} · {shop.hours}</T>
                  </View>
                  <View style={[st.radio, on && st.radioOn]} />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 16 }}>
        <Button title="Перейти к меню" onPress={() => setShop(picked)} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  hero: { height: 400, backgroundColor: colors.orange, overflow: 'hidden', paddingHorizontal: 24 },
  logo: { fontSize: 44, letterSpacing: -0.8, zIndex: 2 },
  bigCircle: { position: 'absolute', left: -60, top: 160, width: 300, height: 300, borderRadius: 150, backgroundColor: colors.ink },
  ring: { position: 'absolute', right: 28, top: 150, width: 110, height: 110, borderRadius: 55, borderWidth: 14, borderColor: colors.ink },
  foam: { position: 'absolute', left: 30, top: 240, width: 120, height: 120, borderRadius: 60, backgroundColor: colors.foam, alignItems: 'center', justifyContent: 'center' },
  drop: { width: 44, height: 44, borderTopLeftRadius: 22, borderTopRightRadius: 22, borderBottomRightRadius: 22, backgroundColor: '#FFFFFF', transform: [{ rotate: '-45deg' }] },
  shop: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 20, padding: 14, borderWidth: 1.5, borderColor: 'transparent' },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.line },
  radioOn: { borderWidth: 6, borderColor: colors.orange },
});
