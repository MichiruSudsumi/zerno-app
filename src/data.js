// Каталог кофейни. Позже эти данные будут приходить с сервера.

export const shops = [
  { id: 'p18', name: 'Пятницкая, 18', distance: '350 м', hours: 'открыто до 22:00' },
  { id: 'n7', name: 'Новокузнецкая, 7', distance: '900 м', hours: 'открыто до 21:00' },
];

export const categories = [
  { id: 'coffee', title: 'Кофе' },
  { id: 'noncoffee', title: 'Не кофе' },
  { id: 'bakery', title: 'Выпечка' },
];

export const milks = [
  { id: 'regular', title: 'Обычное', price: 0 },
  { id: 'oat', title: 'Овсяное', price: 40 },
  { id: 'almond', title: 'Миндальное', price: 40 },
  { id: 'lactosefree', title: 'Без лактозы', price: 30 },
];

export const SHOT_PRICE = 50;

const sizes = (s, m, l) => [
  { id: 'S', ml: s, delta: -30 },
  { id: 'M', ml: m, delta: 0 },
  { id: 'L', ml: l, delta: 50 },
];

export const products = [
  { id: 'flat', cat: 'coffee', name: 'Флэт уайт', price: 240, color: '#E8D2B8', milk: true, shot: true, sizes: sizes(200, 250, 350),
    desc: 'Двойной эспрессо и тонкий слой бархатной молочной пены.' },
  { id: 'capp', cat: 'coffee', name: 'Капучино', price: 230, color: '#C98A5A', milk: true, shot: true, sizes: sizes(250, 300, 400),
    desc: 'Эспрессо и плотная молочная пена. Классика на каждый день.' },
  { id: 'amer', cat: 'coffee', name: 'Американо', price: 180, color: '#5A3A28', milk: false, shot: true, sizes: sizes(250, 300, 400),
    desc: 'Эспрессо, разбавленный горячей водой. Мягкий и долгий вкус.' },
  { id: 'raf', cat: 'coffee', name: 'Раф ванильный', price: 270, color: '#B0623A', milk: true, shot: false, sizes: sizes(250, 300, 400),
    desc: 'Эспрессо, сливки и ванильный сахар, взбитые вместе.' },
  { id: 'pump', cat: 'coffee', name: 'Тыквенный латте', price: 290, color: '#E07A3F', milk: true, shot: true, sizes: sizes(250, 300, 400), isNew: true,
    desc: 'Латте с пюре из запечённой тыквы и пряностями. Сезонный напиток.' },
  { id: 'esp', cat: 'coffee', name: 'Эспрессо', price: 150, color: '#2E1D14', milk: false, shot: true, sizes: null,
    desc: 'Тридцать миллилитров концентрированного вкуса.' },
  { id: 'cocoa', cat: 'noncoffee', name: 'Какао', price: 220, color: '#7A4A33', milk: true, shot: false, sizes: sizes(250, 300, 400),
    desc: 'Настоящий какао-порошок и горячее молоко.' },
  { id: 'matcha', cat: 'noncoffee', name: 'Матча латте', price: 280, color: '#8DB46A', milk: true, shot: false, sizes: sizes(250, 300, 400),
    desc: 'Японский зелёный чай матча с молоком.' },
  { id: 'tea', cat: 'noncoffee', name: 'Облепиховый чай', price: 200, color: '#F2A93B', milk: false, shot: false, sizes: sizes(300, 400, 500),
    desc: 'Облепиха, апельсин и мёд. Согревает в любую погоду.' },
  { id: 'crois', cat: 'bakery', name: 'Круассан', price: 190, color: '#D9A35F', milk: false, shot: false, sizes: null,
    desc: 'Слоёный, на сливочном масле. Выпекаем каждое утро.' },
  { id: 'cinna', cat: 'bakery', name: 'Синнабон', price: 210, color: '#C78C5B', milk: false, shot: false, sizes: null,
    desc: 'Булочка с корицей и сливочным кремом.' },
  { id: 'banana', cat: 'bakery', name: 'Банановый хлеб', price: 170, color: '#A8763F', milk: false, shot: false, sizes: null,
    desc: 'Влажный кекс из спелых бананов с грецким орехом.' },
];

export const productById = (id) => products.find((p) => p.id === id);
export const shopById = (id) => shops.find((s) => s.id === id);
export const milkById = (id) => milks.find((m) => m.id === id);
export const isDrink = (p) => p.cat !== 'bakery';

// Цена и описание одной позиции с выбранными опциями.
export function makeLine(product, opts = {}) {
  const size = product.sizes ? (opts.size || 'M') : null;
  const milk = product.milk ? (opts.milk || 'regular') : null;
  const shots = product.shot ? (opts.shots || 0) : 0;
  const noSugar = !!opts.noSugar;

  const sizeObj = size ? product.sizes.find((s) => s.id === size) : null;
  const milkObj = milk ? milkById(milk) : null;
  const unit = product.price + (sizeObj ? sizeObj.delta : 0) + (milkObj ? milkObj.price : 0) + shots * SHOT_PRICE;

  const parts = [];
  if (sizeObj) parts.push(`${sizeObj.id} · ${sizeObj.ml} мл`);
  if (milkObj && milkObj.id !== 'regular') parts.push(milkObj.title.toLowerCase());
  if (shots) parts.push(`+${shots} шот`);
  if (noSugar) parts.push('без сахара');

  return {
    key: [product.id, size, milk, shots, noSugar].join('|'),
    productId: product.id,
    size, milk, shots, noSugar,
    title: product.name,
    subtitle: parts.join(', '),
    unit,
    qty: opts.qty || 1,
  };
}

// Ближайшие слоты «ко времени»: через 15 минут и дальше с шагом 10 минут.
export function pickupSlots(now = new Date(), count = 6) {
  const start = new Date(now.getTime() + 15 * 60000);
  start.setSeconds(0, 0);
  start.setMinutes(Math.ceil(start.getMinutes() / 10) * 10);
  const out = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getTime() + i * 10 * 60000);
    out.push(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
  }
  return out;
}

export function timePlus(minutes, now = new Date()) {
  const d = new Date(now.getTime() + minutes * 60000);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}
