# Handoff: Personal Fitness App (ออกกำลังกายส่วนตัว)

## Overview
A personal fitness app prototype for an individual user (not multi-tenant). Covers:
onboarding (gender/identity, age, weight, height, home/gym preference), a home
dashboard with BMI + calorie target, a Monday–Sunday workout plan with a
home/gym exercise toggle, a full exercise library with muscle-group filters
and step-by-step instructions, a weekly meal plan with calorie tracking, a
results/progress tab (streak, weight trend chart, 1-week weight forecast,
personal records per lift), and a profile screen.

## About the Design Files
The files in this bundle are **design references built as an interactive HTML/React
prototype** (a single-file Design Component using a custom lightweight
template runtime — not a real framework). They demonstrate exact layout,
copy, states, and interaction logic, but are **not production code to copy
directly**. The task is to **recreate this design in your target codebase's
existing environment** (e.g. React Native, SwiftUI, Flutter, or a web stack)
using its established patterns, navigation, and component libraries. If no
environment exists yet, choose the framework best suited to shipping a real
mobile app (React Native or Flutter are strong defaults for iOS + Android
from one codebase; SwiftUI if iOS-only).

`Fitness App.dc.html` is the live source (open directly in a browser to
interact with it). `Fitness App - Standalone.html` is the same design bundled
into one offline-runnable file for easy viewing/sharing — use it only for
reference, not as a build artifact.

## Converted App
A runnable static web app version now lives in [app/index.html](./app/index.html).
It recreates the prototype behavior with plain HTML/CSS/JavaScript and does
not depend on the original Design Component runtime.

Run locally with either:

```bash
cd /Users/orasa/Downloads/design_handoff_fitness_app
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000/app/`
- or open `app/index.html` directly in a browser

## React Native + Expo
The repo now also includes a React Native + Expo app entry at [App.js](./App.js)
with the required Expo config in [package.json](./package.json) and
[app.json](./app.json).

Install and run:

```bash
cd /Users/orasa/Downloads/design_handoff_fitness_app
npm install
npm run ios
```

Notes:

- `npm run ios` requires Xcode / iOS Simulator on macOS.
- If you only want to open it in Expo Go first, use `npm start` and scan the QR code.
- The web prototype in `app/` is still kept as a design/reference implementation.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy (in Thai), and all
interaction logic (state changes, calculations, persistence) shown are final
intent, not placeholders. Recreate pixel-accurately where feasible, adapted
to native platform conventions (e.g. native iOS/Android navigation instead of
the web tab bar, if building native).

## Screens / Views

### 1. Onboarding — Gender/Identity step
- **Purpose**: Capture user's gender/identity to personalize copy and BMR calc.
- **Layout**: Full-screen, dark background `#0B0D10`, top padding 64px for
  status bar clearance. Progress bar: 3 equal-width segments, 4px tall,
  8px gap, active segments `#FF6A2B`, inactive `#262B31`.
- **Heading**: "คุณคือใคร?" — Barlow Condensed, weight 800, 32px.
- **Subtext**: "เลือกเพศ/อัตลักษณ์ของคุณ..." — `#8B939E`, 14px.
- **Options** (single-select list, vertical stack, 10px gap): ชาย, หญิง,
  ทรานส์ชาย (Trans Man), ทรานส์หญิง (Trans Woman), Non-binary, ไม่ระบุ/อื่นๆ.
  Each option: padding 16px 18px, border-radius 16px, border 1.5px
  `#262B31` (unselected) / `#FF6A2B` (selected), background `#16191D`
  (unselected) / `rgba(255,106,43,0.12)` (selected). Label 16px/600.
- **Primary button** (bottom, fixed): "ถัดไป", full width, padding 17px,
  border-radius 16px, background `#FF6A2B` / disabled `#262B31`, text
  `#0B0D10` weight 700 16px (disabled text `#5B636D`). Disabled until a
  gender is selected.

### 2. Onboarding — Body step (age / weight / height)
- Same shell/progress bar (2nd segment active).
- **Heading**: "น้ำหนัก & ส่วนสูง".
- **3 stacked stepper cards** (age, weight, height): background `#16191D`,
  border `#262B31`, radius 20px, padding 20px. Each has a small uppercase
  label (`#8B939E`, 13px), then a row: circular-ish 48×48 `−`/`+` buttons
  (`#1E2227`, radius 14px, font 22px/700) flanking a big value (Barlow
  Condensed 800, 44px). Age range 10–90 (±1), weight 30–200kg (±1), height
  120–220cm (±1).
- **Live BMI preview card**: background `#1E2227`, radius 16px, padding
  16px/20px, flex row space-between — left: "BMI ของคุณ" label + big value
  (Barlow Condensed 800 26px); right: category badge (see BMI categories
  below).
- **Back button**: "‹ ย้อนกลับ" top-left, `#8B939E` 14px.

### 3. Onboarding — Location step
- **Heading**: "ออกกำลังกายที่ไหน?"
- **3 option cards** (ที่บ้าน / ที่ยิม / ทั้งสองที่), same selected/unselected
  style as gender step, plus a subtext line under each label (13px,
  `#8B939E`): e.g. "ใช้น้ำหนักตัว/ดัมเบล เป็นหลัก".
- **Primary button**: "เริ่มใช้งาน" (or "บันทึก" if editing an existing
  profile). Disabled until a location is chosen. On confirm, profile is
  persisted and the user lands on the Home tab.

### 4. Home tab
- **Header**: "ภาพรวมของคุณ" (Barlow Condensed 800 28px) + subline
  "{gender label} · {location label}" (`#8B939E` 14px).
- **BMI card**: gradient background `linear-gradient(135deg,#16191D,#1E2227)`,
  border `#262B31`, radius 20px, padding 20px. Big BMI number (Barlow
  Condensed 800 42px) + category badge top-right. Below: an 8px-tall gauge
  bar — background gradient `linear-gradient(90deg,#4FA8FF,#B6FF3B,#FFD23B,
  #FF6A2B,#FF3B3B)` representing BMI 15→35, with a small white marker
  (3×14px) positioned at `(bmi-15)/(35-15)*100%` (clamped 2–98%). Scale
  labels 15/25/35 below, `#5B636D` 11px.
- **Stat grid**: 2×2 CSS grid, 10px gap — Age, Weight, Height, and Calories
  (kcal/day, orange `#FF6A2B` value). Each cell: `#16191D` bg, `#262B31`
  border, radius 16px, padding 14px.
- **Today's workout card** (tappable → Plan tab): `#16191D` bg, radius 20px,
  padding 18px. Top row: uppercase small label "แผนวันนี้ · {short day}" +
  "ดูแผน ›" in orange. Then day's title (Barlow Condensed 700 22px) and
  exercise count / "วันพักผ่อน" if rest day.

### 5. Plan tab (แผนออกกำลังกาย)
- **Day pills**: horizontal scroll row of 7 (จ/อ/พ/พฤ/ศ/ส/อา), 44×44,
  radius 12px, active = orange bg + dark text, inactive = `#16191D` bg +
  `#8B939E` text, border `#262B31`.
- **Location segmented toggle** (บ้าน / ยิม): pill container `#16191D`,
  radius 14px, padding 4px; active segment gets `#1E2227` bg + white text,
  inactive transparent + `#8B939E`. Changes which exercises are shown for
  the day (filters exercises by whether they support that location).
- **Day title**: "{full day name} · {workout title}" (Barlow Condensed 700 22px).
- **Rest day**: single centered message card, no exercise list.
- **Workout day**: progress text "{done}/{total} ท่าเสร็จแล้ว" + 6px progress
  bar (`#262B31` track, `#B6FF3B` fill). Then a vertical list of exercise
  rows: `#16191D` bg, radius 16px, padding 14px, flex row — a 24×24
  checkbox-style toggle (rounded-square, filled `#B6FF3B` when done, empty
  outline `#3A3F46` otherwise) → name + "{muscle} · {sets} เซ็ต x {reps}"
  (name gets strikethrough + dim color `#5B636D` when marked done) → chevron
  `›` (opens exercise detail sheet).

### 6. Moves tab (คลังท่าออกกำลังกาย)
- **Category filter chips**: horizontal scroll — ทั้งหมด, อก, หลัง, ขา,
  ไหล่&แขน, แกนกลาง&คาร์ดิโอ, ฟูลบอดี้. Active = orange bg, inactive =
  `#16191D` bg + `#262B31` border.
- **Exercise cards** (vertical list): name + muscle/equipment subtext, tap
  opens detail sheet. Two small badges "บ้าน"/"ยิม" (11px, radius 6px)
  colored green/orange when the exercise supports that location, dimmed
  gray otherwise.

### 7. Exercise detail sheet (bottom sheet, shared by Plan + Moves)
- Backdrop: `rgba(0,0,0,0.6)` full-screen tap-to-close.
- Sheet: `#16191D` bg, border `#262B31`, radius 24px top corners, padding
  20px/20px/40px, max-height 75%, slides up from bottom. Drag handle bar
  (36×4px, `#3A3F46`) centered at top.
  - Title (Barlow Condensed 800 24px)
  - 3 badge chips: muscle group, equipment, sets×reps (orange-tinted)
  - Numbered step list: each step has a 24×24 rounded-square index badge
    (`#1E2227` bg, orange number) + instruction text (14px, `#D5D9DE`,
    line-height 1.5).

### 8. Food tab (แผนอาหาร)
- Same day-pill row as Plan tab (shared "day" selection state).
- **Calorie summary card**: "รวมวันนี้" label + "{total} / {tdee} kcal", 6px
  progress bar (orange fill, width = min(100%, total/tdee)).
- **4 meal cards** (มื้อเช้า / มื้อกลางวัน / มื้อเย็น / ของว่าง): uppercase
  orange meal-type label, food name (15px/600), "{kcal} kcal · โปรตีน {g}g"
  subtext.

### 9. Results/Progress tab (ผลลัพธ์)
- **Streak + weekly summary card**: left = "สตรีค" + "{n} วัน" (orange, big);
  right = "สำเร็จสัปดาห์นี้" + "{done}/{total} วัน". Below: 7 small dot
  indicators (one per weekday) — filled green if completed, gray outline
  if not/rest day, with an orange ring around today's dot.
- **1-week forecast card**: gradient bg, label "คาดการณ์ใน 1 สัปดาห์ (ถ้าทำ
  ครบตามแผน)", big predicted weight number + colored delta text (green =
  losing weight, orange = gaining, gray = ~stable), small caveat text below.
  - Formula: `avgMealKcal` = average of all 7 days' total planned kcal;
    `dailyBalance = tdee − avgMealKcal`; `weeklyChangeKg = dailyBalance × 7 ÷ 7700`;
    `predictedWeight = currentWeight − weeklyChangeKg`.
- **Weight-over-time chart card**: "+ บันทึกวันนี้" button (orange-tinted
  pill, top-right) appends/updates a "วันนี้" data point using the current
  profile weight. Simple CSS bar chart (not SVG) — bar heights scaled
  between 20–90% of a 100px-tall row based on min/max in the log, most
  recent bar highlighted orange, others gray `#3A3F46`. Value label above
  each bar, date/week label below.
- **Personal records list**: 6 fixed exercises (Squat, Deadlift, Dumbbell
  Bench Press, Shoulder Press, Bent-over Row, Push-up). Each row shows the
  exercise name and one or two stepper controls (weight in kg, ±2.5; reps,
  ±1) using the same small 28×28 −/+ button pattern. Push-up only tracks
  reps (bodyweight movement, no weight stepper).

### 10. Profile tab
- Grouped list card (`#1C1C1E` bg, radius 20px) with rows: เพศ/อัตลักษณ์,
  อายุ, น้ำหนัก, ส่วนสูง, ค่า BMI (+ category), สถานที่ออกกำลังกาย. Each row:
  label left (`#8B939E` 14px) / value right (15px/600), 1px bottom divider
  `rgba(84,84,88,0.4)`.
  - **แก้ไขข้อมูล** button: full-width, orange bg, dark text, radius 16px —
    re-enters the onboarding flow pre-filled with current values.
  - **รีเซ็ตข้อมูลทั้งหมด** button: outlined, red text `#FF3B3B` — clears all
    saved profile/progress data and restarts onboarding from scratch.

## Interactions & Behavior
- **Bottom tab bar** (6 tabs: หน้าแรก, แผน, ท่า, อาหาร, ผลลัพธ์, โปรไฟล์):
  fixed at bottom, `rgba(11,13,16,0.92)` bg with backdrop blur, 1px top
  border `#1E2227`. Each tab: small 5px dot (orange when active) above an
  11px/600 label (orange when active, `#5B636D` otherwise).
- **Onboarding flow**: gender → body (age/weight/height) → location, with
  a back button and 3-segment progress indicator. Re-entered from Profile's
  "แก้ไขข้อมูล" button, pre-filled, returning to the app on save instead of
  first-run onboarding.
- **Exercise completion**: tapping the checkbox toggles a completed flag
  keyed by `{dayIndex}-{exerciseId}`; tapping the row itself (not the
  checkbox) opens the detail sheet instead.
- **Home/Gym filter**: exercises are tagged with which locations they
  support; the Plan tab's day list filters to only show exercises valid for
  the currently selected location segment.
- **Persistence**: profile (gender, age, weight, height, location preference,
  plan location, completed-exercise map, weight log, personal records) is
  saved to `localStorage` on every relevant change and restored on load, so
  the prototype "remembers" the user between sessions. A native app should
  replace this with real user storage (device-local DB or backend account).
- **No loading/error states** are modeled in this prototype (it's fully
  client-side/local) — a production app will need to design those for any
  real network calls (auth, sync, etc.).

## State Management
Key state (single source of truth in the prototype):
- `step`: onboarding stage (`gender` | `body` | `location`) or `app` once done
- `isEditing`: whether onboarding was re-entered from Profile
- `gender`, `age`, `weight`, `height`, `location` (`home`|`gym`|`both`)
- `tab`: active bottom-tab key
- `day`: 0–6, shared between Plan and Food tabs (Mon=0..Sun=6)
- `planLocation`: `home`|`gym`, the Plan-tab location toggle
- `moveFilter`: active muscle-group filter string for the Moves tab
- `selectedExId`: id of exercise shown in the detail sheet, or null
- `completed`: map of `"{day}-{exerciseId}" → boolean`
- `weightLog`: array of `{label, weight}` points for the trend chart
- `prRecords`: map of `exerciseId → {weight, reps}` personal records

## Design Tokens

### Colors
- Background: `#0B0D10`
- Surface: `#16191D`
- Surface (elevated): `#1E2227`
- Border: `#262B31`
- Text (primary): `#F5F6F7`
- Text (dim): `#8B939E`
- Text (faint): `#5B636D`
- Accent orange (primary CTA/brand): `#FF6A2B`
- Accent orange tint (badges): `rgba(255,106,43,0.12–0.15)`
- Accent green (success/progress): `#B6FF3B`
- Accent green tint: `rgba(182,255,59,0.15)`
- Danger red (reset action, high-BMI category): `#FF3B3B`
- BMI category colors: underweight `#4FA8FF`, normal `#B6FF3B`, overweight
  `#FFD23B`, obese `#FF6A2B`, very obese `#FF3B3B`

### Typography
- Headings/numbers: **Barlow Condensed**, weights 600/700/800
- Body/UI text: **Inter**, weights 400/500/600/700
- Scale used: 44px/800 (stepper big numbers), 32–36px/800 (step headings,
  forecast number), 28px/800 (tab headers), 22–26px/700 (card titles), 17px
  (nav-ish), 15–16px/600 (row titles/buttons), 13–14px (body/labels), 11–12px
  (meta/badges/captions)

### Spacing / Radius
- Card radius: 16–20px; pills/buttons: 10–16px; small badges: 6–10px
- Card padding: 14–20px; screen horizontal padding: 20–24px
- Standard gaps: 6px (chip rows), 10px (list items), 14–16px (section
  spacing)

### Shadows
- None used — the design relies on flat surfaces + subtle borders + a couple
  of gradients (BMI card, forecast card) for depth, not drop shadows.

## Assets
No photos/icons/illustrations are used — the design is intentionally
typographic/flat (numbers, text, colored bars/dots/badges only). If the
production app wants exercise photos or video demos, that's a deliberate
gap to fill with real media, not something to recreate from this prototype.

## Files
- `Fitness App.dc.html` — the interactive prototype (live source of truth
  for behavior/copy/logic). Open directly in a browser.
- `Fitness App - Standalone.html` — the same design bundled as a single
  offline file, for quick viewing/sharing only.
- `ios-frame.jsx` — the iPhone device-bezel component used purely for
  presentation in the prototype (status bar, home indicator); not part of
  the actual app UI to recreate.
