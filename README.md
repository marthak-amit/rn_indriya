# Indriya — React Native app

A scalable, fully clickable React Native (Expo SDK 58 · TypeScript) storefront for Indriya, built on
**Redux Toolkit** with an animation-first UI (**Reanimated 4**).

> **Content status.** The environment this was built in could not reach `www.indriya.com`, so the
> catalog, copy, store list, brand colours and imagery are **placeholders** (clearly marked in code).
> The app draws its own vector jewellery (`JewelArt`) wherever a photo is missing, so every screen works
> offline today. See [Plugging in real Indriya content](#plugging-in-real-indriya-content).

## Run it

```bash
npm install
npm start            # Expo dev server — press i / a / w, or scan with Expo Go
npm run web          # browser
npm test             # 30 Jest tests (slices, pricing, selectors, store integration)
npm run typecheck && npm run lint
```

## What's in the app

| Area | Highlights |
| --- | --- |
| Intro | Animated splash — gem facets bloom, wordmark rises letter-by-letter, light sweep, curtain lift |
| Home | Auto-advancing parallax hero, marquee, category rail, snap collection carousel (cards scale + inner parallax), scroll-linked section reveals, sticky header |
| Shop | Category chips, **sort & filter bottom sheet** (drag to dismiss), responsive grid (2–4 cols), skeleton loading, empty state |
| Product | Parallax/stretchy gallery, shimmer, size selector with shake-on-error, pincode ETA, accordions, related items, add-to-bag morph, buy now |
| Wishlist | Heart with spark burst, persisted |
| Bag | Swipe-to-remove (+ Undo toast), rolling quantity stepper, free-shipping progress, coupon validation (`WELCOME10`, `FESTIVE2000`), count-up totals |
| Checkout | 3-step flow (address → payment → review) with animated stepper, validation shake, mocked order placement |
| Success | Confetti, self-drawing check, order summary |
| Orders | Expandable cards with animated status timeline |
| Account | Sign in / create account (animated segmented control), profile, store locator |
| Search | Debounced results, recent searches, trending chips |
| Global | Floating animated tab bar with bouncing badges, toast system, haptics, deep links (`indriya://shop?category=rings`) |

Demo sign-in: any valid email + a password of 6+ characters. Checkout is a demo — no payment is processed.

## Architecture

```
src/
  app/                 Expo Router routes only (thin screens)
    (tabs)/            index · shop · wishlist · cart · account
    product/[id]  checkout  order-success/[id]  orders  search  stores  auth
  features/            Feature modules: slice + selectors + components together
    catalog  cart  wishlist  auth  orders  checkout  history  ui  home
  store/               configureStore, persist, listener middleware, typed hooks
  services/api/        RTK Query API (mock `queryFn`s — swap for real HTTP)
  components/          ui/ (design-system primitives) · jewel/ (art, cards)
  theme/               colours, typography, spacing, motion constants
  config/  data/  hooks/  utils/
```

**State management (Redux best practices)**

- **Server state vs client state.** Catalog, stores, login, coupons and orders go through **RTK Query**
  (`services/api/indriyaApi.ts`). UI/client state lives in slices (`cart`, `wishlist`, `filters`, `checkout`, `ui`, `history`, `auth`, `orders`).
- **Store only the minimum.** Cart holds `{productId, size, qty}`; prices/products are *derived* with memoised
  `createSelector`s (`features/catalog/selectors.ts`) — no duplicated data to go stale.
- **Side effects in listener middleware** (`store/listeners.ts`): toasts, haptics, undo, post-order cleanup. Components only dispatch intent.
- **Persistence** via `redux-persist` (whitelist: auth, cart, checkout, history, orders, wishlist). API cache and transient UI are not persisted.
- **Typed everything:** `useAppDispatch` / `useAppSelector`; `RootState` lives in `store/types.ts` to avoid circular types.
- **Pure, tested business logic** (`cart/pricing.ts`, `search.ts`, validators).

**Animation system.** Shared tokens in `theme/index.ts` (`motion`). Reusable pieces: `PressableScale`, `Reveal`
(staggered entrance), `ScrollReveal` (scroll-linked), `Skeleton`, `Chip`, `Accordion`, `BottomSheet`, `Field`
(floating label + error shake), `AnimatedPrice`, `Confetti`, `AnimatedCheck`, `Marquee`. Everything runs on the UI thread via Reanimated worklets.

## Plugging in real Indriya content

1. **Images** — add URLs to `src/config/remoteAssets.ts` (`'product:ring-01'`, `'banner:b1'`, `'collection:bridal'` …).
   Photos replace the vector art automatically, with graceful fallback on load errors.
2. **Catalog** — replace the `queryFn`s in `src/services/api/indriyaApi.ts` with `query`s against the real backend
   (`fetchBaseQuery`) returning the same `Catalog` type (`features/catalog/types.ts`). No UI changes needed.
   Seed data currently lives in `src/data/`.
3. **Brand** — set real colours in `src/theme/colors.ts`, copy/contacts in `src/config/brand.ts`, and swap
   `components/ui/Wordmark.tsx` + `assets/` icons for the official logo.
4. Review placeholder claims (shipping threshold, "hallmarked", returns copy, store addresses).
