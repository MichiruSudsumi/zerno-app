import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeLine, milks, productById, SHOT_PRICE } from '../data';
import { useStore } from '../store';
import { colors, rub } from '../theme';
import { Button, Chip, H1, IconButton, Label, Segmented, Stepper, T, Toggle } from '../ui';

export default function DrinkScreen({ nav, params }) {
  const product = productById(params.id);
  const { add, toast } = useStore();
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState('M');
  const [milk, setMilk] = useState('regular');
  const [shots, setShots] = useState(0);
  const [noSugar, setNoSugar] = useState(false);
  const [qty, setQty] = useState(1);

  if (!product) return null;
  const line = makeLine(product, { size, milk, shots, noSugar, qty });

  const addToCart = () => {
    add(line);
    toast(`${product.name} в корзине`);
    nav.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.milk }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={[st.hero, { paddingTop: insets.top }]}>
          <View style={[st.back, { top: insets.top + 12 }]}>
            <IconButton name="back" label="Назад" bg="rgba(255,255,255,0.9)" onPress={nav.back} />
          </View>
          <View style={st.plate}>
            <View style={[st.cup, { backgroundColor: product.color }]}>
              {product.milk ? <View style={st.drop} /> : null}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 22, gap: 20 }}>
          <View style={{ gap: 6 }}>
            <H1>{product.name}</H1>
            <T style={{ fontSize: 15, lineHeight: 22, color: colors.muted }}>{product.desc}</T>
          </View>

          {product.sizes && (
            <View style={{ gap: 8 }}>
              <Label>Размер</Label>
              <Segmented value={size} onChange={setSize}
                options={product.sizes.map((s) => ({ id: s.id, title: s.id, sub: `${s.ml} мл` }))} />
            </View>
          )}

          {product.milk && (
            <View style={{ gap: 8 }}>
              <Label>Молоко</Label>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {milks.map((m) => (
                  <Chip key={m.id} selected={m.id === milk} onPress={() => setMilk(m.id)}
                    title={m.price ? `${m.title} +${m.price} ₽` : m.title} />
                ))}
              </View>
            </View>
          )}

          {product.shot && (
            <View style={st.row}>
              <View style={{ gap: 2 }}>
                <T style={{ fontSize: 16 }}>Дополнительный шот</T>
                <T style={{ fontSize: 13, color: colors.muted }}>+{rub(SHOT_PRICE)} за каждый</T>
              </View>
              <Stepper value={shots} onMinus={() => setShots(shots - 1)} onPlus={() => setShots(Math.min(shots + 1, 3))} />
            </View>
          )}

          {product.cat !== 'bakery' && (
            <View style={st.row}>
              <T style={{ fontSize: 16 }}>Без сахара</T>
              <Toggle value={noSugar} onChange={setNoSugar} label="Без сахара" />
            </View>
          )}

          <View style={st.row}>
            <T style={{ fontSize: 16 }}>Количество</T>
            <Stepper value={qty} min={1} onMinus={() => setQty(qty - 1)} onPlus={() => setQty(Math.min(qty + 1, 10))} />
          </View>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: insets.bottom + 16 }}>
        <Button title={`Добавить · ${rub(line.unit * qty)}`} onPress={addToCart} />
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  hero: { height: 320, backgroundColor: colors.orange, alignItems: 'center', justifyContent: 'center' },
  back: { position: 'absolute', left: 20, zIndex: 2 },
  plate: { width: 184, height: 184, borderRadius: 92, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  cup: { width: 136, height: 136, borderRadius: 68, alignItems: 'center', justifyContent: 'center' },
  drop: { width: 50, height: 50, borderTopLeftRadius: 25, borderTopRightRadius: 25, borderBottomRightRadius: 25, backgroundColor: '#FFFFFF', transform: [{ rotate: '-45deg' }] },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
});
