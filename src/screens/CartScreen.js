import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pickupSlots, productById, shopById } from '../data';
import { cartTotals, useStore } from '../store';
import { colors, rub } from '../theme';
import { Button, Chip, Cup, H1, Icon, IconButton, Label, Segmented, Stepper, T, Toggle } from '../ui';

export default function CartScreen({ nav }) {
  const { state, changeQty, placeOrder } = useStore();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('asap');
  const slots = useMemo(() => pickupSlots(), []);
  const [slot, setSlot] = useState(slots[0]);
  const [useFree, setUseFree] = useState(false);

  const canUseFree = state.freeDrinks > 0;
  const t = cartTotals(state.cart, useFree && canUseFree);
  const shop = shopById(state.shopId);

  const submit = () => {
    const id = placeOrder(mode === 'asap' ? 'asap' : slot, useFree && canUseFree);
    nav.replace('status', { id });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.milk }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 24, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <IconButton name="back" label="Назад" onPress={nav.back} />
          <H1>Корзина</H1>
        </View>

        {state.cart.length === 0 ? (
          <View style={{ gap: 14, paddingTop: 40, alignItems: 'flex-start' }}>
            <T style={{ fontSize: 16, color: colors.muted }}>В корзине пока пусто. Выберите напиток в меню.</T>
            <Button variant="outline" title="Открыть меню" onPress={nav.back} style={{ alignSelf: 'stretch' }} />
          </View>
        ) : (
          <>
            <View style={{ gap: 10 }}>
              {state.cart.map((l) => (
                <View key={l.key} style={st.item}>
                  <Cup color={productById(l.productId).color} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <T weight="semibold" style={{ fontSize: 16 }}>{l.title}</T>
                    <T style={{ fontSize: 13, color: colors.muted }}>
                      {l.subtitle ? `${l.subtitle} · ` : ''}{rub(l.unit)}
                    </T>
                  </View>
                  <Stepper value={l.qty} onMinus={() => changeQty(l.key, -1)} onPlus={() => changeQty(l.key, 1)} />
                </View>
              ))}
            </View>

            <View style={{ gap: 8 }}>
              <Label>Когда забрать</Label>
              <Segmented value={mode} onChange={setMode} options={[
                { id: 'asap', title: 'Как можно скорее', sub: 'через 8 минут' },
                { id: 'time', title: 'Ко времени', sub: mode === 'time' ? slot : 'выбрать' },
              ]} />
              {mode === 'time' && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
                  {slots.map((s) => <Chip key={s} small title={s} selected={s === slot} onPress={() => setSlot(s)} />)}
                </View>
              )}
            </View>

            <View style={{ gap: 8 }}>
              <Label>Где забрать</Label>
              <View style={st.item}>
                <Icon name="pin" color={colors.muted} />
                <View style={{ flex: 1 }}>
                  <T weight="semibold">{shop ? shop.name : ''}</T>
                  <T style={{ fontSize: 13, color: colors.muted }}>Оплата в кофейне при получении</T>
                </View>
              </View>
            </View>

            {canUseFree && (
              <View style={[st.item, { justifyContent: 'space-between' }]}>
                <View style={{ flex: 1 }}>
                  <T weight="semibold">Напиток в подарок</T>
                  <T style={{ fontSize: 13, color: colors.muted }}>Самый недорогой напиток бесплатно</T>
                </View>
                <Toggle value={useFree} onChange={setUseFree} label="Использовать подарок" />
              </View>
            )}

            <View style={{ gap: 6 }}>
              <View style={st.sum}><T style={{ color: colors.muted }}>Позиции</T><T>{rub(t.subtotal)}</T></View>
              {t.discount > 0 && <View style={st.sum}><T style={{ color: colors.muted }}>Подарок</T><T>−{rub(t.discount)}</T></View>}
              <View style={st.sum}><T weight="bold" style={{ fontSize: 17 }}>Итого</T><T weight="bold" style={{ fontSize: 17 }}>{rub(t.total)}</T></View>
            </View>
          </>
        )}
      </ScrollView>

      {state.cart.length > 0 && (
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 16 }}>
          <Button title={`Оформить заказ · ${rub(t.total)}`} onPress={submit} />
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  item: { backgroundColor: colors.card, borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  sum: { flexDirection: 'row', justifyContent: 'space-between' },
});
