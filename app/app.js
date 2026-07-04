const STORAGE_KEY = "fitapp_profile_v1";

const GENDER_LABELS = {
  male: "ชาย",
  female: "หญิง",
  trans_man: "ทรานส์ชาย",
  trans_woman: "ทรานส์หญิง",
  nonbinary: "Non-binary",
  unspecified: "ไม่ระบุ",
};

const LOCATION_LABELS = {
  home: "ที่บ้าน",
  gym: "ที่ยิม",
  both: "ทั้งสองที่",
};

const GENDER_BMR_OFFSET = {
  male: 5,
  trans_man: 5,
  female: -161,
  trans_woman: -161,
  nonbinary: -78,
  unspecified: -78,
};

const EXERCISES = {
  pushup: { name: "วิดพื้น (Push-up)", muscle: "อก", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 4, reps: "12 ครั้ง", steps: ["วางมือกว้างกว่าไหล่เล็กน้อย ลำตัวตรง", "ลดตัวลงจนอกเกือบชิดพื้น ศอกทำมุม 45°", "ดันตัวขึ้นจนแขนเหยียดสุด"] },
  dbBenchPress: { name: "ดัมเบลเบนช์เพรส", muscle: "อก", equip: "ดัมเบล", locations: ["home", "gym"], sets: 4, reps: "10 ครั้ง", steps: ["นอนหงายบนม้านั่งหรือพื้น ถือดัมเบลระดับอก", "ดันดัมเบลขึ้นจนแขนเหยียดตรง", "ลดลงช้าๆ จนศอกทำมุม 90°"] },
  shoulderPress: { name: "ดัมเบลโอเวอร์เฮดเพรส", muscle: "ไหล่&แขน", equip: "ดัมเบล", locations: ["home", "gym"], sets: 3, reps: "12 ครั้ง", steps: ["ยืนหรือนั่ง ถือดัมเบลระดับไหล่", "ดันขึ้นเหนือศีรษะจนแขนเหยียดตรง", "ลดลงช้าๆ กลับตำแหน่งเริ่มต้น"] },
  tricepDip: { name: "ดิปหลังเก้าอี้", muscle: "ไหล่&แขน", equip: "เก้าอี้/ม้านั่ง", locations: ["home", "gym"], sets: 3, reps: "12 ครั้ง", steps: ["วางมือบนขอบเก้าอี้ เหยียดขาไปด้านหน้า", "งอศอกลดตัวลงจนต้นแขนขนานพื้น", "ดันตัวขึ้นกลับตำแหน่งเริ่มต้น"] },
  bentRow: { name: "ก้มตัวพายดัมเบล", muscle: "หลัง", equip: "ดัมเบล", locations: ["home", "gym"], sets: 4, reps: "10 ครั้ง", steps: ["ก้มตัวไปด้านหน้า หลังตรง เข่างอเล็กน้อย", "ดึงดัมเบลขึ้นชิดลำตัวระดับสะโพก", "ลดลงช้าๆ ควบคุมจังหวะ"] },
  superman: { name: "ซุปเปอร์แมน", muscle: "หลัง", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 3, reps: "15 ครั้ง", steps: ["นอนคว่ำ เหยียดแขนขาไปด้านหน้า-หลัง", "ยกแขนขาและอกขึ้นพร้อมกัน ค้างไว้ 2 วินาที", "ลดลงช้าๆ กลับตำแหน่งเริ่มต้น"] },
  latPulldown: { name: "ดึงบาร์เหนือศีรษะ", muscle: "หลัง", equip: "เครื่องเคเบิล", locations: ["gym"], sets: 4, reps: "10 ครั้ง", steps: ["นั่งจับบาร์กว้างกว่าไหล่", "ดึงบาร์ลงมาระดับหน้าอก สะบักหุบเข้า", "ปล่อยขึ้นช้าๆ ควบคุมจังหวะ"] },
  bicepCurl: { name: "ดัมเบลเคิร์ล", muscle: "ไหล่&แขน", equip: "ดัมเบล", locations: ["home", "gym"], sets: 3, reps: "12 ครั้ง", steps: ["ยืนถือดัมเบลข้างลำตัว ฝ่ามือหันไปด้านหน้า", "งอศอกยกดัมเบลขึ้นถึงไหล่", "ลดลงช้าๆ ควบคุมจังหวะ"] },
  squat: { name: "สควอท (Squat)", muscle: "ขา", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 4, reps: "15 ครั้ง", steps: ["ยืนแยกขากว้างเท่าไหล่ ปลายเท้าชี้เฉียงออก", "ย่อตัวลงเหมือนนั่งเก้าอี้ สะโพกไปด้านหลัง", "ดันตัวขึ้นกลับตำแหน่งยืน"] },
  lunge: { name: "ลันจ์เดิน", muscle: "ขา", equip: "น้ำหนักตัว/ดัมเบล", locations: ["home", "gym"], sets: 3, reps: "12 ครั้งต่อข้าง", steps: ["ก้าวขาไปด้านหน้ายาวๆ", "ย่อเข่าทั้งสองข้างจนขาหลังเกือบแตะพื้น", "ดันตัวก้าวต่อสลับขา"] },
  gluteBridge: { name: "กลูทบริดจ์", muscle: "ขา", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 3, reps: "15 ครั้ง", steps: ["นอนหงาย งอเข่า วางเท้าราบกับพื้น", "ยกสะโพกขึ้นจนลำตัวเป็นเส้นตรง เกร็งก้น", "ลดลงช้าๆ ควบคุมจังหวะ"] },
  legPress: { name: "เลกเพรส", muscle: "ขา", equip: "เครื่องเลกเพรส", locations: ["gym"], sets: 4, reps: "12 ครั้ง", steps: ["นั่งบนเครื่อง วางเท้าบนแท่นกว้างเท่าไหล่", "ดันแท่นออกจนขาเกือบเหยียดตรง", "งอเข่าลดกลับช้าๆ"] },
  calfRaise: { name: "ยกส้นเท้า", muscle: "ขา", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 3, reps: "20 ครั้ง", steps: ["ยืนตรง เท้าราบกับพื้นหรือขอบขั้นบันได", "เขย่งปลายเท้ายกส้นขึ้นสูงสุด ค้างไว้", "ลดลงช้าๆ ควบคุมจังหวะ"] },
  plank: { name: "แพลงก์ (Plank)", muscle: "แกนกลาง&คาร์ดิโอ", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 3, reps: "40 วินาที", steps: ["วางศอกและปลายเท้าลงพื้น ลำตัวเป็นเส้นตรง", "เกร็งหน้าท้องและก้นตลอดท่า", "หายใจปกติ ค้างไว้ตามเวลา"] },
  mountainClimber: { name: "เมาน์เทนไคลม์เบอร์", muscle: "แกนกลาง&คาร์ดิโอ", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 3, reps: "30 วินาที", steps: ["เริ่มท่าแพลงก์แขนตรง", "สลับดึงเข่าเข้าหาอกเร็วๆ", "เกร็งแกนกลางลำตัวตลอดท่า"] },
  russianTwist: { name: "รัสเซียนทวิสต์", muscle: "แกนกลาง&คาร์ดิโอ", equip: "น้ำหนักตัว/ดัมเบล", locations: ["home", "gym"], sets: 3, reps: "20 ครั้ง", steps: ["นั่งเอนตัวเล็กน้อย ยกเท้าลอยพื้น", "หมุนลำตัวแตะพื้นสลับซ้าย-ขวา", "เกร็งหน้าท้องตลอดการเคลื่อนไหว"] },
  jumpRope: { name: "กระโดดเชือก / จั๊มปิ้งแจ็ค", muscle: "แกนกลาง&คาร์ดิโอ", equip: "เชือกกระโดด", locations: ["home", "gym"], sets: 4, reps: "1 นาที", steps: ["กระโดดเบาๆ บนปลายเท้า", "แกว่งเชือกจังหวะสม่ำเสมอ (หรือกางแขน-ขา)", "หายใจสม่ำเสมอตลอดเซ็ต"] },
  lateralRaise: { name: "ยกดัมเบลข้างลำตัว", muscle: "ไหล่&แขน", equip: "ดัมเบล", locations: ["home", "gym"], sets: 3, reps: "12 ครั้ง", steps: ["ยืนถือดัมเบลข้างลำตัว", "ยกแขนขึ้นด้านข้างจนขนานพื้น", "ลดลงช้าๆ ควบคุมจังหวะ"] },
  hammerCurl: { name: "แฮมเมอร์เคิร์ล", muscle: "ไหล่&แขน", equip: "ดัมเบล", locations: ["home", "gym"], sets: 3, reps: "12 ครั้ง", steps: ["ถือดัมเบลแนวตั้ง ฝ่ามือหันเข้าลำตัว", "งอศอกยกขึ้นถึงไหล่", "ลดลงช้าๆ ควบคุมจังหวะ"] },
  facePull: { name: "เคเบิลเฟซพูล", muscle: "ไหล่&แขน", equip: "เครื่องเคเบิล", locations: ["gym"], sets: 3, reps: "15 ครั้ง", steps: ["จับเชือกเคเบิลระดับหน้า", "ดึงเข้าหาใบหน้า ศอกกางออก สะบักหุบ", "ปล่อยกลับช้าๆ ควบคุมจังหวะ"] },
  burpee: { name: "เบอร์พี (Burpee)", muscle: "ฟูลบอดี้", equip: "น้ำหนักตัว", locations: ["home", "gym"], sets: 3, reps: "10 ครั้ง", steps: ["ย่อตัวลงมือแตะพื้น กระโดดขาไปด้านหลังเป็นท่าแพลงก์", "วิดพื้น 1 ครั้ง แล้วดึงขากลับ", "กระโดดขึ้นพร้อมยกแขนเหนือศีรษะ"] },
  kettlebellSwing: { name: "สวิงเคทเทิลเบลล์", muscle: "ฟูลบอดี้", equip: "เคทเทิลเบลล์/ดัมเบล", locations: ["home", "gym"], sets: 4, reps: "15 ครั้ง", steps: ["ยืนแยกขา ถือน้ำหนักด้วยสองมือด้านหน้า", "ส่งสะโพกไปด้านหลังแล้วสวิงขึ้นระดับอก", "ใช้แรงสะโพก ไม่ใช้แรงแขน"] },
  stepUp: { name: "สเต็ปอัพ", muscle: "ฟูลบอดี้", equip: "ม้านั่ง/ขั้นบันได", locations: ["home", "gym"], sets: 3, reps: "12 ครั้งต่อข้าง", steps: ["วางเท้าขึ้นบนม้านั่งหรือขั้นบันได", "ดันตัวขึ้นจนขาเหยียดตรง", "ก้าวลงช้าๆ สลับข้าง"] },
  deadlift: { name: "บาร์เบลเดดลิฟท์", muscle: "ฟูลบอดี้", equip: "บาร์เบล", locations: ["gym"], sets: 4, reps: "8 ครั้ง", steps: ["ยืนแยกขาเท่าไหล่ จับบาร์เบลกว้างเท่าไหล่", "หลังตรง ดันสะโพกยกบาร์ขึ้นจนยืนตรง", "ลดบาร์ลงช้าๆ ควบคุมจังหวะ"] },
};

const DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const DAYS_SHORT = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
const MOVE_CATEGORIES = ["ทั้งหมด", "อก", "หลัง", "ขา", "ไหล่&แขน", "แกนกลาง&คาร์ดิโอ", "ฟูลบอดี้"];

const WEEKLY_PLAN = [
  { title: "อก & ไทรเซป (Push)", rest: false, exIds: ["pushup", "dbBenchPress", "shoulderPress", "tricepDip"] },
  { title: "หลัง & ไบเซป (Pull)", rest: false, exIds: ["bentRow", "superman", "latPulldown", "bicepCurl"] },
  { title: "ขา & สะโพก (Legs)", rest: false, exIds: ["squat", "lunge", "gluteBridge", "legPress", "calfRaise"] },
  { title: "คาร์ดิโอ & แกนกลาง", rest: false, exIds: ["plank", "mountainClimber", "russianTwist", "jumpRope"] },
  { title: "ไหล่ & แขน", rest: false, exIds: ["shoulderPress", "lateralRaise", "hammerCurl", "facePull"] },
  { title: "ฟูลบอดี้", rest: false, exIds: ["burpee", "kettlebellSwing", "stepUp", "deadlift"] },
  { title: "พักผ่อน (Rest Day)", rest: true, exIds: [] },
];

const MEALS_BY_DAY = [
  { breakfast: { name: "ข้าวต้มไข่ + อกไก่ฉีก", kcal: 350, protein: 28 }, lunch: { name: "ข้าวกล้อง อกไก่ย่าง สลัดผัก", kcal: 520, protein: 40 }, dinner: { name: "ปลานึ่งมะนาว ผักลวก", kcal: 400, protein: 35 }, snack: { name: "กรีกโยเกิร์ต + ถั่ว", kcal: 180, protein: 12 } },
  { breakfast: { name: "ไข่ต้ม 2 ฟอง + ขนมปังโฮลวีท", kcal: 320, protein: 22 }, lunch: { name: "ข้าวไข่เจียวทรงเครื่อง น้ำพริกผัก", kcal: 500, protein: 30 }, dinner: { name: "ต้มยำกุ้งน้ำใส + ข้าวกล้อง", kcal: 420, protein: 32 }, snack: { name: "กล้วย + เนยถั่ว", kcal: 200, protein: 8 } },
  { breakfast: { name: "โจ๊กหมูสับใส่ไข่", kcal: 330, protein: 20 }, lunch: { name: "ข้าวผัดกะเพราไก่ไข่ดาว", kcal: 550, protein: 35 }, dinner: { name: "แกงจืดเต้าหู้หมูสับ + ข้าวกล้อง", kcal: 400, protein: 28 }, snack: { name: "นมถั่วเหลือง + ธัญพืช", kcal: 170, protein: 10 } },
  { breakfast: { name: "สมูทตี้กล้วยโปรตีน", kcal: 300, protein: 25 }, lunch: { name: "สลัดอกไก่ + ควินัว", kcal: 480, protein: 38 }, dinner: { name: "ปลาแซลมอนย่าง บรอกโคลี", kcal: 450, protein: 36 }, snack: { name: "แอปเปิ้ล + อัลมอนด์", kcal: 190, protein: 6 } },
  { breakfast: { name: "ข้าวต้มปลา", kcal: 310, protein: 24 }, lunch: { name: "ข้าวกล้อง เนื้อสันย่าง สลัดผัก", kcal: 540, protein: 42 }, dinner: { name: "ต้มจืดผักรวมหมูสับ + ข้าว", kcal: 400, protein: 30 }, snack: { name: "เต้าหู้ปั่นโปรตีน", kcal: 160, protein: 14 } },
  { breakfast: { name: "แพนเค้กโปรตีน + ผลไม้", kcal: 360, protein: 26 }, lunch: { name: "ข้าวหน้าไก่ย่าง สลัดผัก", kcal: 520, protein: 40 }, dinner: { name: "ยำวุ้นเส้นทะเล", kcal: 380, protein: 28 }, snack: { name: "ผลไม้รวมตามฤดูกาล", kcal: 150, protein: 3 } },
  { breakfast: { name: "ข้าวโอ๊ต + ผลไม้สด", kcal: 320, protein: 15 }, lunch: { name: "ข้าวแกงเขียวหวานไก่", kcal: 500, protein: 30 }, dinner: { name: "สุกี้น้ำทะเล", kcal: 420, protein: 32 }, snack: { name: "ช็อกโกแลตดำ + ถั่ว", kcal: 200, protein: 8 } },
];

const PR_EXERCISES = [
  { id: "squat", trackWeight: true },
  { id: "deadlift", trackWeight: true },
  { id: "dbBenchPress", trackWeight: true },
  { id: "shoulderPress", trackWeight: true },
  { id: "bentRow", trackWeight: true },
  { id: "pushup", trackWeight: false },
];

const app = document.querySelector("#app");

function todayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: "น้ำหนักน้อย", color: "#4FA8FF" };
  if (bmi < 23) return { label: "ปกติ", color: "#B6FF3B" };
  if (bmi < 25) return { label: "ท้วม", color: "#FFD23B" };
  if (bmi < 30) return { label: "อ้วน", color: "#FF6A2B" };
  return { label: "อ้วนมาก", color: "#FF3B3B" };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function defaultState() {
  return {
    step: "gender",
    gender: null,
    age: 25,
    weight: 70,
    height: 170,
    location: null,
    isEditing: false,
    tab: "home",
    day: todayIndex(),
    planLocation: "home",
    moveFilter: "ทั้งหมด",
    selectedExId: null,
    completed: {},
    weightLog: [
      { label: "4 สัปดาห์ก่อน", weight: 75 },
      { label: "3 สัปดาห์ก่อน", weight: 74 },
      { label: "2 สัปดาห์ก่อน", weight: 72 },
      { label: "สัปดาห์ก่อน", weight: 71 },
    ],
    prRecords: {
      squat: { weight: 20, reps: 12 },
      deadlift: { weight: 20, reps: 8 },
      dbBenchPress: { weight: 10, reps: 10 },
      shoulderPress: { weight: 8, reps: 10 },
      bentRow: { weight: 10, reps: 10 },
      pushup: { weight: 0, reps: 15 },
    },
  };
}

function loadState() {
  const initial = defaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const saved = JSON.parse(raw);
    return { ...initial, ...saved, step: "app", isEditing: false, selectedExId: null };
  } catch {
    return initial;
  }
}

let state = loadState();

function persistState() {
  if (state.step !== "app") return;

  const payload = {
    gender: state.gender,
    age: state.age,
    weight: state.weight,
    height: state.height,
    location: state.location,
    planLocation: state.planLocation,
    completed: state.completed,
    weightLog: state.weightLog,
    prRecords: state.prRecords,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

function setState(updater, shouldPersist = true) {
  const nextState = typeof updater === "function" ? updater(state) : updater;
  state = { ...state, ...nextState };
  if (shouldPersist) persistState();
  render();
}

function getPlanExercises(dayIndex, mode) {
  const dayPlan = WEEKLY_PLAN[dayIndex];
  if (!dayPlan || dayPlan.rest) return [];
  return dayPlan.exIds.filter((id) => mode === "both" || EXERCISES[id].locations.includes(mode));
}

function getSummaryMode() {
  if (state.location === "both") return "both";
  if (state.location === "gym") return "gym";
  return "home";
}

function computeViewModel() {
  const bmi = state.weight / Math.pow(state.height / 100, 2);
  const bmiDisplay = bmi.toFixed(1);
  const bmiStatus = bmiCategory(bmi);
  const bmiMarkerLeft = Math.max(2, Math.min(98, ((bmi - 15) / 20) * 100));
  const bmr = 10 * state.weight + 6.25 * state.height - 5 * state.age + (GENDER_BMR_OFFSET[state.gender] ?? -78);
  const tdee = Math.round(bmr * 1.55);

  const dayPlan = WEEKLY_PLAN[state.day];
  const visiblePlanExerciseIds = getPlanExercises(state.day, state.planLocation);
  const currentDayExercises = visiblePlanExerciseIds.map((id) => ({ id, ...EXERCISES[id] }));
  const doneCount = visiblePlanExerciseIds.filter((id) => state.completed[`${state.day}-${id}`]).length;
  const progressPct = currentDayExercises.length ? (doneCount / currentDayExercises.length) * 100 : 0;

  const meal = MEALS_BY_DAY[state.day];
  const mealsForDay = [
    { type: "มื้อเช้า", ...meal.breakfast },
    { type: "มื้อกลางวัน", ...meal.lunch },
    { type: "มื้อเย็น", ...meal.dinner },
    { type: "ของว่าง", ...meal.snack },
  ];
  const mealTotalKcal = mealsForDay.reduce((sum, item) => sum + item.kcal, 0);
  const mealPct = Math.max(2, Math.min(100, (mealTotalKcal / tdee) * 100));

  const filteredMoves = Object.entries(EXERCISES)
    .filter(([, exercise]) => state.moveFilter === "ทั้งหมด" || exercise.muscle === state.moveFilter)
    .map(([id, exercise]) => ({ id, ...exercise }));

  const weekMode = getSummaryMode();
  const weekDoneFlags = WEEKLY_PLAN.map((day, index) => {
    if (day.rest) return true;
    const ids = getPlanExercises(index, weekMode);
    if (!ids.length) return false;
    return ids.every((id) => !!state.completed[`${index}-${id}`]);
  });

  const totalWorkoutDays = WEEKLY_PLAN.filter((day) => !day.rest).length;
  const weekDoneCount = WEEKLY_PLAN.reduce((count, day, index) => count + (!day.rest && weekDoneFlags[index] ? 1 : 0), 0);
  let streak = 0;
  for (let index = todayIndex(); index >= 0; index -= 1) {
    if (weekDoneFlags[index]) streak += 1;
    else break;
  }

  const avgMealKcal = MEALS_BY_DAY.reduce((sum, day) => sum + day.breakfast.kcal + day.lunch.kcal + day.dinner.kcal + day.snack.kcal, 0) / MEALS_BY_DAY.length;
  const dailyBalance = tdee - avgMealKcal;
  const weeklyChangeKg = (dailyBalance * 7) / 7700;
  const predictedWeight = (state.weight - weeklyChangeKg).toFixed(1);
  const forecastColor = weeklyChangeKg > 0.05 ? "#B6FF3B" : weeklyChangeKg < -0.05 ? "#FF6A2B" : "#8B939E";
  const forecastText = weeklyChangeKg > 0.05 ? `ลดลง ~${weeklyChangeKg.toFixed(1)} กก.` : weeklyChangeKg < -0.05 ? `เพิ่มขึ้น ~${Math.abs(weeklyChangeKg).toFixed(1)} กก.` : "คงที่";

  const weights = state.weightLog.map((entry) => entry.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const chartBars = state.weightLog.map((entry, index) => {
    const height = maxWeight === minWeight ? 60 : 20 + ((entry.weight - minWeight) / (maxWeight - minWeight)) * 70;
    return { ...entry, latest: index === state.weightLog.length - 1, height };
  });

  const selectedExercise = state.selectedExId ? { id: state.selectedExId, ...EXERCISES[state.selectedExId] } : null;
  const summaryExerciseIds = getPlanExercises(todayIndex(), getSummaryMode());

  return {
    bmiDisplay,
    bmiStatus,
    bmiMarkerLeft,
    tdee,
    dayPlan,
    currentDayExercises,
    doneCount,
    progressPct,
    mealsForDay,
    mealTotalKcal,
    mealPct,
    filteredMoves,
    weekDoneFlags,
    totalWorkoutDays,
    weekDoneCount,
    streak,
    predictedWeight,
    forecastColor,
    forecastText,
    chartBars,
    selectedExercise,
    summaryTodayTitle: WEEKLY_PLAN[todayIndex()].title,
    summaryTodayShort: DAYS_SHORT[todayIndex()],
    summaryTodayCount: WEEKLY_PLAN[todayIndex()].rest ? "วันพักผ่อน" : `${summaryExerciseIds.length} ท่าออกกำลังกาย`,
  };
}

function onboardingPrimaryState() {
  if (state.step === "gender") return { label: "ถัดไป", disabled: !state.gender };
  if (state.step === "body") return { label: "ถัดไป", disabled: false };
  return { label: state.isEditing ? "บันทึก" : "เริ่มใช้งาน", disabled: !state.location };
}

function renderOptionCard({ selected, title, subtitle, action, value }) {
  return `
    <button class="option-card ${selected ? "selected" : ""}" data-action="${action}" data-value="${value}">
      <div class="option-title">${escapeHtml(title)}</div>
      ${subtitle ? `<div class="option-subtitle">${escapeHtml(subtitle)}</div>` : ""}
    </button>
  `;
}

function renderOnboarding(view) {
  const primary = onboardingPrimaryState();
  const showBack = !(state.step === "gender" && !state.isEditing);
  const genderOptions = ["male", "female", "trans_man", "trans_woman", "nonbinary", "unspecified"]
    .map((key) => renderOptionCard({ selected: state.gender === key, title: GENDER_LABELS[key], action: "select-gender", value: key }))
    .join("");

  const locationOptions = [
    { key: "home", label: "ที่บ้าน", subtitle: "ใช้น้ำหนักตัว/ดัมเบล เป็นหลัก" },
    { key: "gym", label: "ที่ยิม", subtitle: "เข้าถึงเครื่องและอุปกรณ์ครบ" },
    { key: "both", label: "ทั้งสองที่", subtitle: "สลับได้ตามความสะดวก" },
  ].map((item) => renderOptionCard({ selected: state.location === item.key, title: item.label, subtitle: item.subtitle, action: "select-location", value: item.key })).join("");

  return `
    <div class="screen">
      <div class="scroll onboarding">
        <div class="top-row">
          <button class="back-btn ${showBack ? "" : "hidden"}" data-action="back-step">‹ ย้อนกลับ</button>
        </div>
        <div class="progress">
          <div class="progress-bar active"></div>
          <div class="progress-bar ${state.step === "body" || state.step === "location" ? "active" : ""}"></div>
          <div class="progress-bar ${state.step === "location" ? "active" : ""}"></div>
        </div>
        ${state.step === "gender" ? `
          <h1 class="title">คุณคือใคร?</h1>
          <p class="subtitle">เลือกเพศ/อัตลักษณ์ของคุณ เพื่อออกแบบโปรแกรมให้เหมาะสม</p>
          <div class="stack">${genderOptions}</div>
        ` : ""}
        ${state.step === "body" ? `
          <h1 class="title">น้ำหนัก & ส่วนสูง</h1>
          <p class="subtitle">ใช้คำนวณค่า BMI และแคลอรี่ที่แนะนำ</p>
          <div class="stack">
            ${renderStepperCard("อายุ (ปี)", "age", state.age)}
            ${renderStepperCard("น้ำหนัก (กก.)", "weight", state.weight)}
            ${renderStepperCard("ส่วนสูง (ซม.)", "height", state.height)}
          </div>
          <div class="metric-card card" style="background:#1E2227; margin-top:14px;">
            <div class="summary-row">
              <div>
                <div class="small muted">BMI ของคุณ</div>
                <div class="bmi-value">${view.bmiDisplay}</div>
              </div>
              <div class="badge" style="background:${view.bmiStatus.color}22;color:${view.bmiStatus.color};">${escapeHtml(view.bmiStatus.label)}</div>
            </div>
          </div>
        ` : ""}
        ${state.step === "location" ? `
          <h1 class="title">ออกกำลังกายที่ไหน?</h1>
          <p class="subtitle">เลือกแล้วสลับได้ตลอดเวลาในหน้าแผนออกกำลังกาย</p>
          <div class="stack">${locationOptions}</div>
        ` : ""}
      </div>
      <div class="footer">
        <button class="primary-btn ${primary.disabled ? "disabled" : ""}" ${primary.disabled ? "" : 'data-action="primary-onboarding"'}>${primary.label}</button>
      </div>
    </div>
  `;
}

function renderStepperCard(label, field, value) {
  return `
    <div class="metric-card card">
      <div class="eyebrow">${escapeHtml(label)}</div>
      <div class="stepper">
        <button class="stepper-btn" data-action="adjust-stat" data-field="${field}" data-delta="-1">−</button>
        <div class="stepper-value">${escapeHtml(value)}</div>
        <button class="stepper-btn" data-action="adjust-stat" data-field="${field}" data-delta="1">+</button>
      </div>
    </div>
  `;
}

function renderHome(view) {
  return `
    <div>
      <h1 class="page-title">ภาพรวมของคุณ</h1>
      <div class="subtitle" style="margin-bottom:18px;">${escapeHtml(GENDER_LABELS[state.gender] || "-")} · ${escapeHtml(LOCATION_LABELS[state.location] || "-")}</div>

      <div class="metric-card gradient card">
        <div class="bmi-row">
          <div>
            <div class="eyebrow">ดัชนีมวลกาย (BMI)</div>
            <div class="hero-number">${view.bmiDisplay}</div>
          </div>
          <div class="badge" style="background:${view.bmiStatus.color}22;color:${view.bmiStatus.color};">${escapeHtml(view.bmiStatus.label)}</div>
        </div>
        <div class="gauge" style="margin-top:14px;">
          <div class="gauge-fill"></div>
          <div class="gauge-marker" style="left:${view.bmiMarkerLeft}%"></div>
        </div>
        <div class="scale-row"><span>15</span><span>25</span><span>35</span></div>
      </div>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">อายุ</div><div class="stat-value">${state.age} ปี</div></div>
        <div class="stat-card"><div class="stat-label">น้ำหนัก</div><div class="stat-value">${state.weight} กก.</div></div>
        <div class="stat-card"><div class="stat-label">ส่วนสูง</div><div class="stat-value">${state.height} ซม.</div></div>
        <div class="stat-card"><div class="stat-label">แคลอรี่/วัน</div><div class="stat-value accent">${view.tdee}</div></div>
      </div>

      <button class="link-card card" data-action="set-tab" data-value="plan">
        <div class="home-row" style="margin-bottom:6px;">
          <div class="eyebrow">แผนวันนี้ · ${view.summaryTodayShort}</div>
          <div class="small" style="color:var(--accent);font-weight:600;">ดูแผน ›</div>
        </div>
        <div class="section-title">${escapeHtml(view.summaryTodayTitle)}</div>
        <div class="small muted">${escapeHtml(view.summaryTodayCount)}</div>
      </button>
    </div>
  `;
}

function renderPlan(view) {
  const dayPills = DAYS_SHORT.map((short, index) => `
    <button class="pill ${state.day === index ? "active" : ""}" data-action="set-day" data-value="${index}">${short}</button>
  `).join("");

  const planLocationPills = [
    { key: "home", label: "บ้าน" },
    { key: "gym", label: "ยิม" },
  ].map((item) => `
    <button class="segment-btn ${state.planLocation === item.key ? "active" : ""}" data-action="set-plan-location" data-value="${item.key}">${item.label}</button>
  `).join("");

  const exerciseList = view.currentDayExercises.map((exercise) => {
    const key = `${state.day}-${exercise.id}`;
    const done = !!state.completed[key];
    return `
      <div class="exercise-row">
        <button class="check ${done ? "done" : ""}" data-action="toggle-complete" data-value="${key}"></button>
        <button class="exercise-meta" data-action="open-exercise" data-value="${exercise.id}">
          <div class="exercise-name ${done ? "done" : ""}">${escapeHtml(exercise.name)}</div>
          <div class="exercise-subtext">${escapeHtml(exercise.muscle)} · ${exercise.sets} เซ็ต x ${escapeHtml(exercise.reps)}</div>
        </button>
        <button class="chevron" data-action="open-exercise" data-value="${exercise.id}">›</button>
      </div>
    `;
  }).join("");

  return `
    <div>
      <h1 class="page-title" style="margin-bottom:14px;">แผนออกกำลังกาย</h1>
      <div class="pill-row">${dayPills}</div>
      <div class="segment">${planLocationPills}</div>
      <h2 class="section-title">${escapeHtml(DAYS[state.day])} · ${escapeHtml(view.dayPlan.title)}</h2>
      ${view.dayPlan.rest ? `
        <div class="rest-card card">
          <div class="subtitle" style="margin:0;">วันนี้พักผ่อนให้กล้ามเนื้อฟื้นตัว ยืดเหยียดเบาๆ และนอนหลับให้เพียงพอ</div>
        </div>
      ` : `
        <div class="inline-summary">${view.doneCount}/${view.currentDayExercises.length} ท่าเสร็จแล้ว</div>
        <div class="progress-track"><div class="progress-fill" style="width:${view.progressPct}%"></div></div>
        <div class="stack">${exerciseList || `<div class="empty-state">ไม่มีท่าที่รองรับสำหรับโหมดนี้</div>`}</div>
      `}
    </div>
  `;
}

function renderMoves(view) {
  const filters = MOVE_CATEGORIES.map((item) => `
    <button class="chip ${state.moveFilter === item ? "active" : ""}" data-action="set-move-filter" data-value="${item}">${escapeHtml(item)}</button>
  `).join("");

  const cards = view.filteredMoves.map((exercise) => `
    <button class="list-card" data-action="open-exercise" data-value="${exercise.id}">
      <div class="home-row">
        <div class="list-title">${escapeHtml(exercise.name)}</div>
        <div class="chevron">›</div>
      </div>
      <div class="exercise-subtext">${escapeHtml(exercise.muscle)} · ${escapeHtml(exercise.equip)}</div>
      <div class="location-badges">
        <div class="mini-badge" style="background:${exercise.locations.includes("home") ? "rgba(182,255,59,0.15)" : "#1E2227"};color:${exercise.locations.includes("home") ? "#B6FF3B" : "#5B636D"};">บ้าน</div>
        <div class="mini-badge" style="background:${exercise.locations.includes("gym") ? "rgba(255,106,43,0.15)" : "#1E2227"};color:${exercise.locations.includes("gym") ? "#FF6A2B" : "#5B636D"};">ยิม</div>
      </div>
    </button>
  `).join("");

  return `
    <div>
      <h1 class="page-title" style="margin-bottom:14px;">คลังท่าออกกำลังกาย</h1>
      <div class="pill-row">${filters}</div>
      <div class="stack">${cards}</div>
    </div>
  `;
}

function renderFood(view) {
  const dayPills = DAYS_SHORT.map((short, index) => `
    <button class="pill ${state.day === index ? "active" : ""}" data-action="set-day" data-value="${index}">${short}</button>
  `).join("");

  const meals = view.mealsForDay.map((meal) => `
    <div class="meal-card">
      <div class="meal-type">${escapeHtml(meal.type)}</div>
      <div class="meal-name">${escapeHtml(meal.name)}</div>
      <div class="exercise-subtext">${meal.kcal} kcal · โปรตีน ${meal.protein}g</div>
    </div>
  `).join("");

  return `
    <div>
      <h1 class="page-title" style="margin-bottom:14px;">แผนอาหาร</h1>
      <div class="pill-row">${dayPills}</div>
      <div class="summary-card card">
        <div class="home-row small muted" style="margin-bottom:8px;">
          <span>รวมวันนี้</span>
          <span>${view.mealTotalKcal} / ${view.tdee} kcal</span>
        </div>
        <div class="progress-track" style="margin-bottom:0;"><div class="progress-fill" style="width:${view.mealPct}%;background:var(--accent);"></div></div>
      </div>
      <div class="stack">${meals}</div>
    </div>
  `;
}

function renderProgress(view) {
  const dots = DAYS_SHORT.map((short, index) => `
    <div class="week-day">
      <div class="week-dot ${view.weekDoneFlags[index] && !WEEKLY_PLAN[index].rest ? "done" : ""} ${todayIndex() === index ? "today" : ""}"></div>
      <div class="week-label">${short}</div>
    </div>
  `).join("");

  const bars = view.chartBars.map((bar) => `
    <div class="chart-item">
      <div class="chart-value">${bar.weight}</div>
      <div class="chart-bar ${bar.latest ? "latest" : ""}" style="height:${bar.height}%"></div>
    </div>
  `).join("");

  const labels = view.chartBars.map((bar) => `<div class="chart-label" style="flex:1;text-align:center;">${escapeHtml(bar.label)}</div>`).join("");

  const prCards = PR_EXERCISES.map((item) => {
    const record = state.prRecords[item.id] || { weight: 0, reps: 0 };
    return `
      <div class="pr-card card">
        <div class="pr-name">${escapeHtml(EXERCISES[item.id].name)}</div>
        <div class="pr-grid">
          ${item.trackWeight ? `
            <div class="pr-field">
              <div class="pr-label">น้ำหนัก (กก.)</div>
              <div class="stepper compact">
                <button class="stepper-btn small" data-action="adjust-pr" data-id="${item.id}" data-field="weight" data-delta="-2.5">−</button>
                <div class="stepper-value small">${record.weight} กก.</div>
                <button class="stepper-btn small" data-action="adjust-pr" data-id="${item.id}" data-field="weight" data-delta="2.5">+</button>
              </div>
            </div>
          ` : ""}
          <div class="pr-field">
            <div class="pr-label">Reps สูงสุด</div>
            <div class="stepper compact">
              <button class="stepper-btn small" data-action="adjust-pr" data-id="${item.id}" data-field="reps" data-delta="-1">−</button>
              <div class="stepper-value small">${record.reps}</div>
              <button class="stepper-btn small" data-action="adjust-pr" data-id="${item.id}" data-field="reps" data-delta="1">+</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div>
      <h1 class="page-title" style="margin-bottom:14px;">ผลลัพธ์ของคุณ</h1>

      <div class="summary-card card">
        <div class="summary-row" style="margin-bottom:14px;">
          <div>
            <div class="small muted">สตรีค</div>
            <div class="bmi-value" style="color:var(--accent);">${view.streak} วัน</div>
          </div>
          <div style="text-align:right;">
            <div class="small muted">สำเร็จสัปดาห์นี้</div>
            <div class="bmi-value">${view.weekDoneCount}/${view.totalWorkoutDays} วัน</div>
          </div>
        </div>
        <div class="week-dots">${dots}</div>
      </div>

      <div class="summary-card gradient card">
        <div class="eyebrow" style="margin-bottom:10px;">คาดการณ์ใน 1 สัปดาห์ (ถ้าทำครบตามแผน)</div>
        <div class="home-row" style="justify-content:flex-start;align-items:baseline;gap:10px;margin-bottom:6px;">
          <div class="hero-number" style="font-size:36px;">${view.predictedWeight} กก.</div>
          <div class="small" style="font-weight:600;color:${view.forecastColor};">${escapeHtml(view.forecastText)}</div>
        </div>
        <div class="week-label" style="font-size:11px;line-height:1.5;">ประมาณการจากแคลอรี่ที่แนะนำเทียบกับแผนอาหาร เป็นค่าคร่าวๆ ไม่แม่นยำ 100%</div>
      </div>

      <div class="summary-card card">
        <div class="chart-head">
          <div class="eyebrow">น้ำหนักตามเวลา</div>
          <button class="ghost-btn" data-action="log-weight-today">+ บันทึกวันนี้</button>
        </div>
        <div class="chart">${bars}</div>
        <div style="display:flex;gap:8px;">${labels}</div>
      </div>

      <div class="pr-header">สถิติส่วนตัวต่อท่า</div>
      <div class="stack">${prCards}</div>
    </div>
  `;
}

function renderProfile(view) {
  const rows = [
    ["เพศ/อัตลักษณ์", GENDER_LABELS[state.gender] || "-"],
    ["อายุ", `${state.age} ปี`],
    ["น้ำหนัก", `${state.weight} กก.`],
    ["ส่วนสูง", `${state.height} ซม.`],
    ["ค่า BMI", `${view.bmiDisplay} (${view.bmiStatus.label})`],
    ["สถานที่ออกกำลังกาย", LOCATION_LABELS[state.location] || "-"],
  ].map(([label, value]) => `
    <div class="profile-row">
      <div class="profile-label">${escapeHtml(label)}</div>
      <div class="profile-value">${escapeHtml(value)}</div>
    </div>
  `).join("");

  return `
    <div>
      <h1 class="page-title" style="margin-bottom:14px;">โปรไฟล์</h1>
      <div class="profile-card">${rows}</div>
      <button class="secondary-btn" data-action="start-edit">แก้ไขข้อมูล</button>
      <button class="danger-btn" data-action="reset-profile">รีเซ็ตข้อมูลทั้งหมด</button>
    </div>
  `;
}

function renderTabBar() {
  const tabs = [
    { key: "home", label: "หน้าแรก" },
    { key: "plan", label: "แผน" },
    { key: "moves", label: "ท่า" },
    { key: "food", label: "อาหาร" },
    { key: "progress", label: "ผลลัพธ์" },
    { key: "profile", label: "โปรไฟล์" },
  ];

  return `
    <div class="tabs">
      ${tabs.map((tab) => `
        <button class="tab-btn ${state.tab === tab.key ? "active" : ""}" data-action="set-tab" data-value="${tab.key}">
          <div class="tab-dot"></div>
          <div class="tab-label">${tab.label}</div>
        </button>
      `).join("")}
    </div>
  `;
}

function renderExerciseSheet(view) {
  if (!view.selectedExercise) return "";

  const exercise = view.selectedExercise;
  const badges = [
    `<div class="mini-badge" style="background:#1E2227;color:#8B939E;">${escapeHtml(exercise.muscle)}</div>`,
    `<div class="mini-badge" style="background:#1E2227;color:#8B939E;">${escapeHtml(exercise.equip)}</div>`,
    `<div class="mini-badge" style="background:rgba(255,106,43,0.15);color:#FF6A2B;">${exercise.sets} เซ็ต x ${escapeHtml(exercise.reps)}</div>`,
  ].join("");

  const steps = exercise.steps.map((step, index) => `
    <div class="sheet-step">
      <div class="sheet-step-num">${index + 1}</div>
      <div class="sheet-step-text">${escapeHtml(step)}</div>
    </div>
  `).join("");

  return `
    <button class="sheet-backdrop" data-action="close-exercise" aria-label="close"></button>
    <div class="sheet">
      <div class="sheet-handle"></div>
      <div class="title" style="font-size:24px;margin-bottom:6px;">${escapeHtml(exercise.name)}</div>
      <div class="sheet-badges">${badges}</div>
      <div class="stack">${steps}</div>
    </div>
  `;
}

function renderApp(view) {
  const pages = {
    home: renderHome(view),
    plan: renderPlan(view),
    moves: renderMoves(view),
    food: renderFood(view),
    progress: renderProgress(view),
    profile: renderProfile(view),
  };

  return `
    <div class="screen">
      <div class="scroll">${pages[state.tab] || pages.home}</div>
      ${renderTabBar()}
      ${renderExerciseSheet(view)}
    </div>
  `;
}

function render() {
  const view = computeViewModel();
  app.innerHTML = state.step === "app" ? renderApp(view) : renderOnboarding(view);
}

function clamp(field, value) {
  if (field === "age") return Math.max(10, Math.min(90, value));
  if (field === "weight") return Math.max(30, Math.min(200, value));
  if (field === "height") return Math.max(120, Math.min(220, value));
  return value;
}

function finishOnboarding() {
  if (!state.location) return;
  setState({
    step: "app",
    tab: "home",
    isEditing: false,
    planLocation: state.location === "gym" ? "gym" : "home",
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;

  const { action, value, field, delta, id } = target.dataset;

  switch (action) {
    case "select-gender":
      setState({ gender: value }, false);
      break;
    case "select-location":
      setState({ location: value, planLocation: value === "gym" ? "gym" : "home" }, false);
      break;
    case "primary-onboarding":
      if (state.step === "gender" && state.gender) setState({ step: "body" }, false);
      else if (state.step === "body") setState({ step: "location" }, false);
      else finishOnboarding();
      break;
    case "back-step":
      if (state.step === "location") setState({ step: "body" }, false);
      else if (state.step === "body") setState({ step: "gender" }, false);
      else if (state.step === "gender" && state.isEditing) setState({ step: "app", isEditing: false }, false);
      break;
    case "adjust-stat":
      setState((current) => ({ [field]: clamp(field, current[field] + Number(delta)) }), false);
      break;
    case "set-tab":
      setState({ tab: value }, false);
      break;
    case "set-day":
      setState({ day: Number(value) }, false);
      break;
    case "set-plan-location":
      setState({ planLocation: value });
      break;
    case "set-move-filter":
      setState({ moveFilter: value }, false);
      break;
    case "open-exercise":
      setState({ selectedExId: value }, false);
      break;
    case "close-exercise":
      setState({ selectedExId: null }, false);
      break;
    case "toggle-complete":
      setState((current) => ({ completed: { ...current.completed, [value]: !current.completed[value] } }));
      break;
    case "log-weight-today":
      setState((current) => {
        const weightLog = current.weightLog.slice();
        const last = weightLog[weightLog.length - 1];
        if (last?.label === "วันนี้") weightLog[weightLog.length - 1] = { label: "วันนี้", weight: current.weight };
        else weightLog.push({ label: "วันนี้", weight: current.weight });
        return { weightLog };
      });
      break;
    case "adjust-pr":
      setState((current) => {
        const record = { ...(current.prRecords[id] || { weight: 0, reps: 0 }) };
        if (field === "weight") record.weight = Math.max(0, Math.min(300, record.weight + Number(delta)));
        if (field === "reps") record.reps = Math.max(0, Math.min(100, record.reps + Number(delta)));
        return { prRecords: { ...current.prRecords, [id]: record } };
      });
      break;
    case "start-edit":
      setState({ step: "gender", isEditing: true, selectedExId: null }, false);
      break;
    case "reset-profile":
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      state = defaultState();
      render();
      break;
    default:
      break;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.selectedExId) {
    setState({ selectedExId: null }, false);
  }
});

render();
