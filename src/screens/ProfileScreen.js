import React from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { shopById } from '../data';
import { STAMPS_FOR_FREE, useStore } from '../store';
import { colors, fonts } from '../theme';
import { H1, Icon, Label, T } from '../ui';

export default function ProfileScreen({ nav }) {
  const { state, setProfile, setShop, add, toast } = useStore();
  const insets = useSafeAreaInsets();
  const shop = shopById(state.shopId);
  const initial = (state.name.trim()[0] || 'З').toUpperCase();
  const recent = state.orders.slice(0, 3);
  const left = STAMPS_FOR_FREE - state.stamps;

  const repeat = (order) => {
    order.lines.forEach((l) => add({ ...l }));
    toast('Добавили в корзину');
    nav.push('cart');
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 24, gap: 20 }}
      keyboardShouldPersistTaps="handled">
      <H1>Профиль</H1>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={st.avatar}><T weight="display" style={{ fontSize: 24 }}>{initial}</T></View>
        <View style={{ flex: 1, gap: 6 }}>
          <TextInput value={state.name} onChangeText={(name) => setProfile({ name })} placeholder="Ваше имя"
            placeholderTextColor={colors.soft} style={st.input} accessibilityLabel="Имя" />
          <TextInput value={state.phone} onChangeText={(phone) => setProfile({ phone })} placeholder="Телефон"
            placeholderTextColor={colors.soft} keyboardType="phone-pad" style={[st.input, { fontSize: 14 }]} accessibilityLabel="Телефон" />
        </View>
      </View>

      <View style={st.stampCard}>
        <View style={st.rowBetween}>
          <T weight="semibold" style={{ fontSize: 16, color: '#FFFFFF' }}>Бонусная карта</T>
          <T style={{ fontSize: 13, color: colors.soft }}>{state.stamps} из {STAMPS_FOR_FREE}</T>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {Array.from({ length: STAMPS_FOR_FREE }).map((_, i) => {
            const filled = i < state.stamps;
            const last = i === STAMPS_FOR_FREE - 1;
            return (
              <View key={i} style={[st.stamp, filled ? { backgroundColor: colors.orange } : last ? st.stampGift : st.stampEmpty]}>
                {last && !filled ? <T weight="bold" style={{ fontSize: 11, color: colors.foam }}>7</T> : null}
              </View>
            );
          })}
        </View>
        <T style={{ fontSize: 13, color: colors.soft }}>
          {state.freeDrinks > 0
            ? `Подарков к использованию: ${state.freeDrinks}. Включите его в корзине.`
            : `Ещё ${left} ${left < 5 ? 'напитка' : 'напитков'}, и следующий будет в подарок`}
        </T>
      </View>

      <View style={{ gap: 10 }}>
        <Label>Моя кофейня</Label>
        <Pressable onPress={() => setShop(null)} style={st.item}>
          <Icon name="pin" color={colors.muted} />
          <View style={{ flex: 1 }}>
            <T weight="semibold">{shop ? shop.name : 'Не выбрана'}</T>
            <T style={{ fontSize: 13, color: colors.muted }}>Сменить кофейню</T>
          </View>
          <Icon name="chevron" size={20} color={colors.muted} />
        </Pressable>
      </View>

      {recent.length > 0 && (
        <View style={{ gap: 10 }}>
          <Label>Недавние заказы</Label>
          {recent.map((o) => (
            <View key={o.id} style={st.item}>
              <View style={{ flex: 1 }}>
                <T weight="semibold" numberOfLines={1}>{o.lines.map((l) => l.title).join(', ')}</T>
                <T style={{ fontSize: 13, color: colors.muted }}>№ {o.number} · {o.shopName}</T>
              </View>
              <Pressable onPress={() => repeat(o)} style={st.repeat} accessibilityRole="button">
                <T style={{ fontSize: 13 }}>Повторить</T>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  input: { fontFamily: fonts.semibold, fontSize: 18, color: colors.ink, borderBottomWidth: 1.5, borderBottomColor: colors.foam, paddingVertical: 4 },
  stampCard: { backgroundColor: colors.ink, borderRadius: 24, padding: 18, gap: 14 },
  stamp: { flex: 1, aspectRatio: 1, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  stampEmpty: { borderWidth: 2, borderStyle: 'dashed', borderColor: colors.muted },
  stampGift: { borderWidth: 2, borderColor: colors.foam },
  item: { backgroundColor: colors.card, borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  repeat: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 },
});
