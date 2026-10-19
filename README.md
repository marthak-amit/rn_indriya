# Indriya — React Native app

A scalable, fully clickable React Native (Expo SDK 58 · TypeScript) storefront for Indriya, built on
**Redux Toolkit** with an animation-first UI (**Reanimated 4**).

> **Content.** Products, prices, photography, banners, logo and the theme come from the public
> Indriya website, captured by `scripts/sync-indriya.mjs` (see [Syncing site content](#syncing-site-content)).
> Where the site gives no data (ratings, reviews, store addresses) the app does not invent it.
> Catalog structure (categories/collections) mirrors the site navigation. The built-in drawn-jewellery
> artwork remains only as a fallback for missing images and for tests.

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
| Home | Real site banners as an auto-advancing hero, marquee, category rail, snap collection carousel (cards scale + inner parallax), scroll-linked section reveals, sticky header with the Indriya logo |
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

## Syncing site content

Real content lives in `src/data/generated/` (data + image map) and `assets/indriya/` (bundled photos).
Refresh it any time — locally or from GitHub:

```bash
# locally (needs access to indriya.com)
npm i --no-save playwright && npx playwright install chromium
npm run sync:indriya
```

Or run the **Sync Indriya content** workflow (Actions tab → *Run workflow*); it captures the site in a
headless browser on a GitHub runner and commits the result to the branch. Reference screenshots and a
`sync-report.json` are written to `docs/reference/`.

What it captures: category and collection listings, each product page (name, approximate price, gold weight,
karat, size, gallery photos), hero banners, the logo, and the site's live colours and fonts.

Notes
- Prices on the site are *approximate, excluding taxes*; the app says so. Checkout is a demo — no payment is processed.
- Hero banners carry their own headline in the image; captions in `src/data/catalog.ts` (`bannerMeta`) mirror that text.
- Ring/bangle size pickers are app UI conveniences, not scraped values.
- Unit tests mock the synced data and run against the built-in placeholder catalog (see `jest.setup.js`).
