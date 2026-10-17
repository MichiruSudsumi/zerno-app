import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts, radius } from './theme';

export function T({ style, weight = 'regular', children, ...rest }) {
  return (
    <Text style={[{ fontFamily: fonts[weight], color: colors.ink, fontSize: 15 }, style]} {...rest}>
      {children}
    </Text>
  );
}

export function H1({ style, children }) {
  return <T weight="display" style={[{ fontSize: 28, lineHeight: 32, letterSpacing: -0.3 }, style]}>{children}</T>;
}

export function Label({ style, children }) {
  return <T weight="semibold" style={[{ fontSize: 12, letterSpacing: 1, color: colors.muted, textTransform: 'uppercase' }, style]}>{children}</T>;
}

const ICONS = {
  back: (c) => <Path d="M14.5 6 8.5 12l6 6" stroke={c} />,
  chevron: (c) => <Path d="M9.5 6l6 6-6 6" stroke={c} />,
  plus: (c) => <Path d="M12 5v14M5 12h14" stroke={c} />,
  minus: (c) => <Path d="M5 12h14" stroke={c} />,
  check: (c) => <Path d="M5 12.5 10 17l9-10" stroke={c} />,
  search: (c) => (<><Circle cx="11" cy="11" r="7" stroke={c} /><Path d="m20 20-4-4" stroke={c} /></>),
  user: (c) => (<><Circle cx="12" cy="8.5" r="3.5" stroke={c} /><Path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" stroke={c} /></>),
  cup: (c) => (<><Path d="M5 8h12v5a6 6 0 0 1-12 0z" stroke={c} /><Path d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5v2M11 2.5v2M14 2.5v2" stroke={c} /></>),
  list: (c) => (<><Rect x="4" y="4" width="16" height="16" rx="3" stroke={c} /><Path d="M8 9h8M8 13h8M8 17h5" stroke={c} /></>),
  pin: (c) => (<><Path d="M12 21s6-5.6 6-11a6 6 0 0 0-12 0c0 5.4 6 11 6 11z" stroke={c} /><Circle cx="12" cy="10" r="2" stroke={c} /></>),
  close: (c) => <Path d="M6 6l12 12M18 6 6 18" stroke={c} />,
};

export function Icon({ name, size = 24, color = colors.ink, width = 1.8 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name](color)}
    </Svg>
  );
}

export function IconButton({ name, onPress, label, bg = colors.foam, color = colors.ink }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} hitSlop={8}
      style={({ pressed }) => [s.iconBtn, { backgroundColor: bg, opacity: pressed ? 0.7 : 1 }]}>
      <Icon name={name} color={color} />
    </Pressable>
  );
}

export function Button({ title, onPress, variant = 'orange', right, disabled, style }) {
  const v = VARIANTS[variant];
  return (
    <Pressable onPress={onPress} disabled={disabled} accessibilityRole="button"
      style={({ pressed }) => [s.btn, v.box, right ? s.btnSplit : null, { opacity: disabled ? 0.4 : pressed ? 0.85 : 1 }, style]}>
      <T weight="semibold" style={[{ fontSize: 16 }, v.text]}>{title}</T>
      {right ? <T weight="semibold" style={[{ fontSize: 16 }, v.text]}>{right}</T> : null}
    </Pressable>
  );
}

const VARIANTS = {
  orange: { box: { backgroundColor: colors.orange }, text: { color: colors.ink } },
  ink: { box: { backgroundColor: colors.ink }, text: { color: '#FFFFFF' } },
  outline: { box: { borderWidth: 1.5, borderColor: colors.ink }, text: { color: colors.ink } },
  outlineLight: { box: { borderWidth: 1.5, borderColor: colors.milk }, text: { color: colors.milk } },
};

export function Chip({ title, selected, onPress, small }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: !!selected }}
      style={[s.chip, small && s.chipSmall, selected && s.chipOn]}>
      <T style={{ fontSize: small ? 13 : 14, color: selected ? '#FFFFFF' : colors.ink }}>{title}</T>
    </Pressable>
  );
}

export function Stepper({ value, onMinus, onPlus, min = 0 }) {
  return (
    <View style={s.stepper}>
      <Pressable onPress={onMinus} disabled={value <= min} accessibilityLabel="Меньше" hitSlop={6}
        style={[s.stepBtn, value <= min && { opacity: 0.35 }]}>
        <Icon name="minus" size={16} width={2.4} />
      </Pressable>
      <T weight="semibold" style={{ minWidth: 16, textAlign: 'center' }}>{value}</T>
      <Pressable onPress={onPlus} accessibilityLabel="Больше" hitSlop={6} style={s.stepBtn}>
        <Icon name="plus" size={16} width={2.4} />
      </Pressable>
    </View>
  );
}

export function Toggle({ value, onChange, label }) {
  return (
    <Pressable onPress={() => onChange(!value)} accessibilityRole="switch" accessibilityState={{ checked: value }} accessibilityLabel={label}
      style={[s.toggle, { backgroundColor: value ? colors.ink : colors.line, justifyContent: value ? 'flex-end' : 'flex-start' }]}>
      <View style={[s.knob, { backgroundColor: value ? colors.orange : '#FFFFFF' }]} />
    </Pressable>
  );
}

// options: [{ id, title, sub }]
export function Segmented({ options, value, onChange }) {
  return (
    <View style={s.seg}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable key={o.id} onPress={() => onChange(o.id)} accessibilityRole="button" accessibilityState={{ selected: on }}
            style={[s.segItem, on && s.segOn]}>
            <T weight="semibold" style={{ fontSize: 15 }}>{o.title}</T>
            {o.sub ? <T style={{ fontSize: 12, color: colors.muted }}>{o.sub}</T> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function Cup({ color, size = 52 }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

const s = StyleSheet.create({
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  btn: { height: 56, borderRadius: radius.l, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  btnSplit: { flexDirection: 'row', justifyContent: 'space-between' },
  chip: { borderWidth: 1.5, borderColor: colors.line, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 16 },
  chipSmall: { paddingVertical: 6, paddingHorizontal: 12 },
  chipOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: colors.line, borderRadius: 999, padding: 4 },
  stepBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.foam, alignItems: 'center', justifyContent: 'center' },
  toggle: { width: 52, height: 32, borderRadius: 16, padding: 4, flexDirection: 'row' },
  knob: { width: 24, height: 24, borderRadius: 12 },
  seg: { flexDirection: 'row', backgroundColor: colors.foam, borderRadius: radius.m, padding: 4 },
  segItem: { flex: 1, minHeight: 52, borderRadius: 13, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  segOn: { backgroundColor: '#FFFFFF' },
});
