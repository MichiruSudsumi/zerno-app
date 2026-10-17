import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from 'react';
import { productById, isDrink, shopById, timePlus } from './data';

export const STAMPS_FOR_FREE = 7;
const PREP_MINUTES = 8;

const initial = {
  shopId: null,
  name: '',
  phone: '',
  cart: [],
  orders: [],
  stamps: 0,
  freeDrinks: 0,
};

function reducer(s, a) {
  switch (a.type) {
    case 'shop':
      return { ...s, shopId: a.id };
    case 'profile':
      return { ...s, ...a.patch };
    case 'add': {
      const i = s.cart.findIndex((l) => l.key === a.line.key);
      if (i >= 0) {
        const cart = [...s.cart];
        cart[i] = { ...cart[i], qty: cart[i].qty + a.line.qty };
        return { ...s, cart };
      }
      return { ...s, cart: [...s.cart, a.line] };
    }
    case 'qty':
      return {
        ...s,
        cart: s.cart.map((l) => (l.key === a.key ? { ...l, qty: l.qty + a.d } : l)).filter((l) => l.qty > 0),
      };
    case 'order':
      return { ...s, orders: [a.order, ...s.orders], cart: [], stamps: a.stamps, freeDrinks: a.freeDrinks };
    case 'status':
      return { ...s, orders: s.orders.map((o) => (o.id === a.id ? { ...o, ...a.patch } : o)) };
    default:
      return s;
  }
}

const StoreCtx = createContext(null);
const ToastCtx = createContext(() => {});

export function cartTotals(cart, useFree) {
  const subtotal = cart.reduce((sum, l) => sum + l.unit * l.qty, 0);
  const drinkLines = cart.filter((l) => isDrink(productById(l.productId)));
  const cheapest = drinkLines.length ? Math.min(...drinkLines.map((l) => l.unit)) : 0;
  const discount = useFree ? cheapest : 0;
  const drinks = drinkLines.reduce((n, l) => n + l.qty, 0);
  return { subtotal, discount, total: subtotal - discount, drinks, count: cart.reduce((n, l) => n + l.qty, 0) };
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [toastText, setToastText] = useState(null);
  const toastTimer = useRef(null);

  const toast = useCallback((text) => {
    setToastText(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastText(null), 2200);
  }, []);

  const placeOrder = useCallback((pickup, useFree) => {
    const t = cartTotals(state.cart, useFree && state.freeDrinks > 0);
    const earned = state.stamps + t.drinks;
    const freeDrinks = state.freeDrinks - (t.discount > 0 ? 1 : 0) + Math.floor(earned / STAMPS_FOR_FREE);
    const id = String(Date.now());
    const order = {
      id,
      number: 10 + Math.floor(Math.random() * 90),
      lines: state.cart,
      total: t.total,
      discount: t.discount,
      shopName: shopById(state.shopId)?.name || '',
      pickup: pickup === 'asap' ? `к ${timePlus(PREP_MINUTES)}` : `к ${pickup}`,
      createdAt: new Date().toISOString(),
      acceptedAt: timePlus(0),
      status: 'accepted',
      arrived: false,
    };
    dispatch({ type: 'order', order, stamps: earned % STAMPS_FOR_FREE, freeDrinks });

    // Демо: пока нет сервера, кофейня «готовит» заказ по таймеру.
    setTimeout(() => dispatch({ type: 'status', id, patch: { status: 'brewing' } }), 4000);
    setTimeout(() => dispatch({ type: 'status', id, patch: { status: 'ready', readyAt: timePlus(0) } }), 14000);
    return id;
  }, [state.cart, state.stamps, state.freeDrinks, state.shopId]);

  const actions = useMemo(() => ({
    setShop: (id) => dispatch({ type: 'shop', id }),
    setProfile: (patch) => dispatch({ type: 'profile', patch }),
    add: (line) => dispatch({ type: 'add', line }),
    changeQty: (key, d) => dispatch({ type: 'qty', key, d }),
    markArrived: (id) => dispatch({ type: 'status', id, patch: { arrived: true } }),
    pickedUp: (id) => dispatch({ type: 'status', id, patch: { status: 'done' } }),
  }), []);

  const value = useMemo(() => ({ state, ...actions, placeOrder, toast, toastText }), [state, actions, placeOrder, toast, toastText]);

  return (
    <StoreCtx.Provider value={value}>
      <ToastCtx.Provider value={toast}>{children}</ToastCtx.Provider>
    </StoreCtx.Provider>
  );
}

export const useStore = () => useContext(StoreCtx);
export const useToast = () => useContext(ToastCtx);
