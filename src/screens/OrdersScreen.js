import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { colors, rub } from '../theme';
import { Button, H1, Icon, Label, T } from '../ui';

const STATUS = {
  accepted: { title: 'Принят', bg: colors.foam, fg: colors.ink },
  brewing: { title: 'Готовим', bg: colors.orange, fg: colors.ink },
  ready: { title: 'Можно забирать', bg: colors.ink, fg: '#FFFFFF' },
  done: { title: 'Получен', bg: 'transparent', fg: colors.muted },
};

function OrderRow({ order, onPress }) {
  const s = STATUS[order.status];
  const names = order.lines.map((l) => l.title).join(', ');
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [st.item, pressed && { opacity: 0.8 }]}>
      <View style={st.num}><T weight="display" style={{ fontSize: 18 }}>{order.number}</T></View>
      <View style={{ flex: 1, gap: 4 }}>
        <T weight="semibold" numberOfLines={1}>{names}</T>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={[st.badge, { backgroundColor: s.bg, borderWidth: order.status === 'done' ? 1 : 0 }]}>
            <T weight="semibold" style={{ fontSize: 11, color: s.fg }}>{s.title}</T>
          </View>
          <T style={{ fontSize: 13, color: colors.muted }}>{rub(order.total)}</T>
        </View>
      </View>
      <Icon name="chevron" size={20} color={colors.muted} />
    </Pressable>
  );
}

export default function OrdersScreen({ nav }) {
  const { state } = useStore();
  const insets = useSafeAreaInsets();
  const active = state.orders.filter((o) => o.status !== 'done');
  const past = state.orders.filter((o) => o.status === 'done');

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 24, gap: 20 }}>
      <H1>Заказы</H1>
      {state.orders.length === 0 ? (
        <View style={{ gap: 14 }}>
          <T style={{ fontSize: 16, color: colors.muted, lineHeight: 23 }}>Здесь появятся ваши заказы. Сделайте первый в меню.</T>
          <Button variant="outline" title="Открыть меню" onPress={() => nav.setTab('menu')} />
        </View>
      ) : (
        <>
          {active.length > 0 && (
            <View style={{ gap: 10 }}>
              <Label>Сейчас</Label>
              {active.map((o) => <OrderRow key={o.id} order={o} onPress={() => nav.push('status', { id: o.id })} />)}
            </View>
          )}
          {past.length > 0 && (
            <View style={{ gap: 10 }}>
              <Label>Раньше</Label>
              {past.map((o) => <OrderRow key={o.id} order={o} onPress={() => nav.push('status', { id: o.id })} />)}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  item: { backgroundColor: colors.card, borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  num: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.milk, alignItems: 'center', justifyContent: 'center' },
  badge: { borderRadius: 999, paddingVertical: 3, paddingHorizontal: 8, borderColor: colors.line },
});
