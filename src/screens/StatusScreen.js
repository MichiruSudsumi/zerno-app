import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { colors, rub } from '../theme';
import { Button, IconButton, Label, T } from '../ui';

const STEPS = [
  { id: 'accepted', title: 'Принят' },
  { id: 'brewing', title: 'Готовим' },
  { id: 'ready', title: 'Можно забирать' },
];
const ORDER = ['accepted', 'brewing', 'ready', 'done'];

export default function StatusScreen({ nav, params }) {
  const { state, markArrived, pickedUp, toast } = useStore();
  const insets = useSafeAreaInsets();
  const order = state.orders.find((o) => o.id === params.id);
  if (!order) return null;

  const idx = ORDER.indexOf(order.status);
  const progress = [0.2, 0.55, 1, 1][idx];
  const ready = order.status === 'ready';
  const done = order.status === 'done';

  const headline = done ? 'Заказ получен' : ready ? 'Заказ готов' : 'Заказ принят';
  const sub = done ? 'Спасибо! Ждём вас снова.' : ready ? `Готов с ${order.readyAt}, заберите на стойке` : `Будет готов ${order.pickup}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 24, gap: 24 }}>
        <View style={st.rowBetween}>
          <IconButton name="close" label="Закрыть" bg={colors.deep} color={colors.milk} onPress={nav.back} />
          <T style={{ color: colors.soft }}>{order.shopName}</T>
        </View>

        <View style={{ alignItems: 'center', gap: 6, paddingVertical: 8 }}>
          <Label style={{ color: colors.soft }}>{headline}</Label>
          <T weight="display" style={st.number}>{order.number}</T>
          <T style={{ fontSize: 16, color: colors.cream, textAlign: 'center' }}>{sub}</T>
        </View>

        <View style={st.track}><View style={[st.fill, { width: `${progress * 100}%` }]} /></View>

        <View style={{ gap: 16 }}>
          {STEPS.map((s, i) => {
            const passed = idx > i || done;
            const current = idx === i && !done;
            return (
              <View key={s.id} style={st.step}>
                <View style={[st.dot, passed && st.dotFull, current && st.dotRing]}>
                  {current ? <View style={st.dotInner} /> : null}
                </View>
                <T weight={current ? 'semibold' : 'regular'} style={{ fontSize: 16, color: passed || current ? colors.milk : colors.soft }}>{s.title}</T>
                {s.id === 'accepted' ? <T style={{ marginLeft: 'auto', fontSize: 13, color: colors.soft }}>{order.acceptedAt}</T> : null}
              </View>
            );
          })}
        </View>

        <View style={st.card}>
          {order.lines.map((l) => (
            <View key={l.key} style={st.rowBetween}>
              <T style={{ color: colors.milk, flex: 1 }}>{l.qty > 1 ? `${l.qty} × ` : ''}{l.title}{l.subtitle ? `, ${l.subtitle}` : ''}</T>
              <T style={{ color: colors.milk }}>{rub(l.unit * l.qty)}</T>
            </View>
          ))}
          {order.discount > 0 && (
            <View style={st.rowBetween}><T style={{ color: colors.soft }}>Подарок</T><T style={{ color: colors.soft }}>−{rub(order.discount)}</T></View>
          )}
          <View style={[st.rowBetween, { borderTopWidth: 1, borderTopColor: '#3A322D', paddingTop: 8, marginTop: 2 }]}>
            <T weight="semibold" style={{ color: colors.milk }}>Итого, оплата в кофейне</T>
            <T weight="semibold" style={{ color: colors.milk }}>{rub(order.total)}</T>
          </View>
        </View>
      </ScrollView>

      {!done && (
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 16 }}>
          {ready ? (
            <Button title="Я забрал заказ" onPress={() => pickedUp(order.id)} />
          ) : order.arrived ? (
            <Button variant="outlineLight" title="Бариста знает, что вы здесь" disabled />
          ) : (
            <Button variant="outlineLight" title="Я уже в кофейне" onPress={() => { markArrived(order.id); toast('Передали бариста, что вы на месте'); }} />
          )}
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  number: { fontSize: 140, lineHeight: 150, color: colors.orange, letterSpacing: -4 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.deep, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3, backgroundColor: colors.orange },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#4A423C', alignItems: 'center', justifyContent: 'center' },
  dotFull: { backgroundColor: colors.orange, borderColor: colors.orange },
  dotRing: { borderColor: colors.orange },
  dotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange },
  card: { backgroundColor: colors.deep, borderRadius: 20, padding: 16, gap: 8 },
});
