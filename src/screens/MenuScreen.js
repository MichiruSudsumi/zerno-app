import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories, makeLine, productById, products, shopById } from '../data';
import { cartTotals, STAMPS_FOR_FREE, useStore } from '../store';
import { colors, fonts, rub } from '../theme';
import { Button, Chip, Cup, H1, Icon, IconButton, T } from '../ui';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Доброе утро';
  if (h < 18) return 'Добрый день';
  return 'Добрый вечер';
}

export default function MenuScreen({ nav }) {
  const { state, add, toast, setShop } = useStore();
  const [cat, setCat] = useState('coffee');
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const totals = cartTotals(state.cart, false);
  const shop = shopById(state.shopId);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q) return products.filter((p) => p.name.toLowerCase().includes(q));
    return products.filter((p) => p.cat === cat);
  }, [cat, query]);

  const featured = productById('pump');
  const left = STAMPS_FOR_FREE - state.stamps;

  const quickAdd = (p) => {
    add(makeLine(p));
    toast(`${p.name} в корзине`);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 24, gap: 18 }}
        keyboardShouldPersistTaps="handled">
        <View style={st.rowBetween}>
          <View style={{ gap: 2, flex: 1 }}>
            <Pressable onPress={() => setShop(null)} accessibilityRole="button" accessibilityLabel="Сменить кофейню" style={st.shopRow}>
              <Icon name="pin" size={16} color={colors.muted} />
              <T style={{ fontSize: 13, color: colors.muted }}>{shop ? shop.name : ''}</T>
            </Pressable>
            <H1>{greeting()}</H1>
          </View>
          <IconButton name="user" label="Профиль" onPress={() => nav.setTab('profile')} />
        </View>

        <View style={st.search}>
          <Icon name="search" size={20} color={colors.muted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Найти напиток" placeholderTextColor={colors.muted}
            style={st.searchInput} returnKeyType="search" />
          {query ? (
            <Pressable onPress={() => setQuery('')} accessibilityLabel="Очистить поиск" hitSlop={8}>
              <Icon name="close" size={18} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>

        {!query && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {categories.map((c) => (
                <Chip key={c.id} title={c.title} selected={c.id === cat} onPress={() => setCat(c.id)} />
              ))}
            </ScrollView>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable onPress={() => nav.push('drink', { id: featured.id })} style={st.promo}>
                <View style={st.promoDot} />
                <T weight="semibold" style={st.promoLabel}>Новинка</T>
                <View style={{ gap: 2 }}>
                  <T weight="semibold" style={{ fontSize: 16, color: '#FFFFFF' }}>{featured.name}</T>
                  <T style={{ fontSize: 13, color: colors.soft }}>от {rub(featured.price - 30)}</T>
                </View>
              </Pressable>
              <Pressable onPress={() => nav.setTab('profile')} style={st.bonus}>
                <T weight="semibold" style={[st.promoLabel, { color: colors.ink }]}>Бонус</T>
                <T weight="semibold" style={{ fontSize: 15, lineHeight: 19 }}>
                  {state.freeDrinks > 0 ? `${state.freeDrinks} напиток в подарок` : `Ещё ${left} до подарка`}
                </T>
              </Pressable>
            </View>
          </>
        )}

        <View style={{ gap: 10 }}>
          {list.length === 0 ? (
            <T style={{ color: colors.muted }}>Ничего не нашли. Попробуйте другое название.</T>
          ) : list.map((p) => (
            <Pressable key={p.id} onPress={() => nav.push('drink', { id: p.id })} style={({ pressed }) => [st.item, pressed && { opacity: 0.8 }]}>
              <Cup color={p.color} />
              <View style={{ flex: 1, gap: 2 }}>
                <T weight="semibold" style={{ fontSize: 16 }}>{p.name}</T>
                <T style={{ fontSize: 13, color: colors.muted }}>
                  {p.sizes ? `${p.sizes[1].ml} мл · ` : ''}{rub(p.price)}
                </T>
              </View>
              <Pressable onPress={() => quickAdd(p)} accessibilityRole="button" accessibilityLabel={`Добавить ${p.name}`} hitSlop={6} style={st.plus}>
                <Icon name="plus" size={18} width={2.4} />
              </Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {totals.count > 0 && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
          <Button variant="ink" title={`Корзина · ${totals.count}`} right={rub(totals.subtotal)} onPress={() => nav.push('cart')} />
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  shopRow: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  search: { height: 48, borderRadius: 24, backgroundColor: colors.foam, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16 },
  searchInput: { flex: 1, fontFamily: fonts.regular, fontSize: 15, color: colors.ink, paddingVertical: 0 },
  promo: { flex: 1, height: 150, borderRadius: 24, backgroundColor: colors.ink, padding: 16, justifyContent: 'space-between', overflow: 'hidden' },
  promoDot: { position: 'absolute', right: -24, top: -24, width: 96, height: 96, borderRadius: 48, backgroundColor: colors.orange },
  promoLabel: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: colors.soft },
  bonus: { width: 130, height: 150, borderRadius: 24, backgroundColor: colors.orange, padding: 16, justifyContent: 'space-between' },
  item: { backgroundColor: colors.card, borderRadius: 20, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  plus: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
});
