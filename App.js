import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

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

const DAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const DAYS_SHORT = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];
const MOVE_CATEGORIES = ["ทั้งหมด", "อก", "หลัง", "ขา", "ไหล่&แขน", "แกนกลาง&คาร์ดิโอ", "ฟูลบอดี้"];

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

function getPlanExercises(dayIndex, mode) {
  const dayPlan = WEEKLY_PLAN[dayIndex];
  if (!dayPlan || dayPlan.rest) return [];
  return dayPlan.exIds.filter((id) => mode === "both" || EXERCISES[id].locations.includes(mode));
}

function getSummaryMode(location) {
  if (location === "both") return "both";
  if (location === "gym") return "gym";
  return "home";
}

function Badge({ label, color, accent }) {
  return (
    <View style={[styles.badge, { backgroundColor: accent ? "rgba(255,106,43,0.15)" : `${color}22` }]}>
      <Text style={[styles.badgeText, { color: accent ? colors.accent : color }]}>{label}</Text>
    </View>
  );
}

function StepperCard({ label, value, onDecrease, onIncrease }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.eyebrow}>{label}</Text>
      <View style={styles.stepperRow}>
        <Pressable onPress={onDecrease} style={styles.stepperButton}>
          <Text style={styles.stepperButtonText}>−</Text>
        </Pressable>
        <Text style={styles.stepperValue}>{value}</Text>
        <Pressable onPress={onIncrease} style={styles.stepperButton}>
          <Text style={styles.stepperButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Chip({ label, active, onPress, compact }) {
  return (
    <Pressable onPress={onPress} style={[compact ? styles.compactChip : styles.filterChip, active && styles.filterChipActive]}>
      <Text style={[compact ? styles.compactChipText : styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.tabButton}>
      <View style={[styles.tabDot, active && styles.tabDotActive]} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function ExerciseSheet({ exercise, visible, onClose }) {
  if (!exercise) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.sheetBackdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{exercise.name}</Text>
        <View style={styles.sheetBadges}>
          <View style={styles.metaPill}><Text style={styles.metaPillText}>{exercise.muscle}</Text></View>
          <View style={styles.metaPill}><Text style={styles.metaPillText}>{exercise.equip}</Text></View>
          <Badge label={`${exercise.sets} เซ็ต x ${exercise.reps}`} color={colors.accent} accent />
        </View>
        <View style={styles.stack}>
          {exercise.steps.map((step, index) => (
            <View key={`${exercise.name}-${index}`} style={styles.sheetStepRow}>
              <View style={styles.sheetStepIndex}><Text style={styles.sheetStepIndexText}>{index + 1}</Text></View>
              <Text style={styles.sheetStepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const colors = {
  bg: "#0B0D10",
  surface: "#16191D",
  surface2: "#1E2227",
  border: "#262B31",
  text: "#F5F6F7",
  muted: "#8B939E",
  muted2: "#5B636D",
  accent: "#FF6A2B",
  lime: "#B6FF3B",
};

export default function App() {
  const [state, setState] = useState(defaultState);
  const [isReady, setIsReady] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    async function hydrate() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = JSON.parse(raw);
          setState((current) => ({ ...current, ...saved, step: "app", isEditing: false, selectedExId: null }));
        }
      } catch {}
      setHasLoaded(true);
      setIsReady(true);
    }

    hydrate();
  }, []);

  useEffect(() => {
    if (!hasLoaded || state.step !== "app") return;

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

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
  }, [hasLoaded, state]);

  if (!isReady) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ExpoStatusBar style="light" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const bmi = state.weight / Math.pow(state.height / 100, 2);
  const bmiDisplay = bmi.toFixed(1);
  const bmiState = bmiCategory(bmi);
  const markerLeft = Math.max(2, Math.min(98, ((bmi - 15) / 20) * 100));
  const bmr = 10 * state.weight + 6.25 * state.height - 5 * state.age + (GENDER_BMR_OFFSET[state.gender] ?? -78);
  const tdee = Math.round(bmr * 1.55);
  const dayPlan = WEEKLY_PLAN[state.day];
  const currentDayExerciseIds = getPlanExercises(state.day, state.planLocation);
  const currentDayExercises = currentDayExerciseIds.map((id) => ({ id, ...EXERCISES[id] }));
  const doneCount = currentDayExerciseIds.filter((id) => state.completed[`${state.day}-${id}`]).length;
  const progressRatio = currentDayExercises.length ? doneCount / currentDayExercises.length : 0;
  const mealDay = MEALS_BY_DAY[state.day];
  const mealsForDay = [
    { type: "มื้อเช้า", ...mealDay.breakfast },
    { type: "มื้อกลางวัน", ...mealDay.lunch },
    { type: "มื้อเย็น", ...mealDay.dinner },
    { type: "ของว่าง", ...mealDay.snack },
  ];
  const mealTotal = mealsForDay.reduce((sum, meal) => sum + meal.kcal, 0);
  const summaryMode = getSummaryMode(state.location);
  const todayPlanIds = getPlanExercises(todayIndex(), summaryMode);
  const filteredMoves = Object.entries(EXERCISES)
    .filter(([, exercise]) => state.moveFilter === "ทั้งหมด" || exercise.muscle === state.moveFilter)
    .map(([id, exercise]) => ({ id, ...exercise }));
  const weekDoneFlags = WEEKLY_PLAN.map((plan, index) => {
    if (plan.rest) return true;
    const ids = getPlanExercises(index, summaryMode);
    if (!ids.length) return false;
    return ids.every((id) => state.completed[`${index}-${id}`]);
  });
  const workoutDaysTotal = WEEKLY_PLAN.filter((plan) => !plan.rest).length;
  const workoutDaysDone = WEEKLY_PLAN.reduce((sum, plan, index) => sum + (!plan.rest && weekDoneFlags[index] ? 1 : 0), 0);
  let streak = 0;
  for (let index = todayIndex(); index >= 0; index -= 1) {
    if (weekDoneFlags[index]) streak += 1;
    else break;
  }

  const avgMealKcal = MEALS_BY_DAY.reduce((sum, day) => sum + day.breakfast.kcal + day.lunch.kcal + day.dinner.kcal + day.snack.kcal, 0) / MEALS_BY_DAY.length;
  const dailyBalance = tdee - avgMealKcal;
  const weeklyChangeKg = (dailyBalance * 7) / 7700;
  const predictedWeight = (state.weight - weeklyChangeKg).toFixed(1);
  const forecastColor = weeklyChangeKg > 0.05 ? colors.lime : weeklyChangeKg < -0.05 ? colors.accent : colors.muted;
  const forecastText = weeklyChangeKg > 0.05 ? `ลดลง ~${weeklyChangeKg.toFixed(1)} กก.` : weeklyChangeKg < -0.05 ? `เพิ่มขึ้น ~${Math.abs(weeklyChangeKg).toFixed(1)} กก.` : "คงที่";
  const weights = state.weightLog.map((entry) => entry.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  const selectedExercise = state.selectedExId ? { id: state.selectedExId, ...EXERCISES[state.selectedExId] } : null;

  function update(patch) {
    setState((current) => ({ ...current, ...(typeof patch === "function" ? patch(current) : patch) }));
  }

  function clamp(field, value) {
    if (field === "age") return Math.max(10, Math.min(90, value));
    if (field === "weight") return Math.max(30, Math.min(200, value));
    if (field === "height") return Math.max(120, Math.min(220, value));
    return value;
  }

  function finishOnboarding() {
    if (!state.location) return;
    update({
      step: "app",
      tab: "home",
      isEditing: false,
      planLocation: state.location === "gym" ? "gym" : "home",
    });
  }

  function resetProfile() {
    Alert.alert("รีเซ็ตข้อมูลทั้งหมด", "ล้างข้อมูลโปรไฟล์และความคืบหน้าทั้งหมด?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "รีเซ็ต",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem(STORAGE_KEY);
          } catch {}
          setState(defaultState());
        },
      },
    ]);
  }

  function renderOnboarding() {
    const showBack = !(state.step === "gender" && !state.isEditing);
    const primaryDisabled = state.step === "gender" ? !state.gender : state.step === "location" ? !state.location : false;
    const primaryLabel = state.step === "location" ? (state.isEditing ? "บันทึก" : "เริ่มใช้งาน") : "ถัดไป";

    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.onboardingContent} showsVerticalScrollIndicator={false}>
          <View style={styles.topRow}>
            <Pressable onPress={() => {
              if (state.step === "location") update({ step: "body" });
              else if (state.step === "body") update({ step: "gender" });
              else if (state.step === "gender" && state.isEditing) update({ step: "app", isEditing: false });
            }} style={showBack ? null : styles.hidden}>
              <Text style={styles.backButton}>‹ ย้อนกลับ</Text>
            </Pressable>
          </View>

          <View style={styles.progressRow}>
            <View style={[styles.progressSegment, styles.progressSegmentActive]} />
            <View style={[styles.progressSegment, (state.step === "body" || state.step === "location") && styles.progressSegmentActive]} />
            <View style={[styles.progressSegment, state.step === "location" && styles.progressSegmentActive]} />
          </View>

          {state.step === "gender" && (
            <>
              <Text style={styles.title}>คุณคือใคร?</Text>
              <Text style={styles.subtitle}>เลือกเพศ/อัตลักษณ์ของคุณ เพื่อออกแบบโปรแกรมให้เหมาะสม</Text>
              <View style={styles.stack}>
                {Object.keys(GENDER_LABELS).map((key) => (
                  <Pressable key={key} onPress={() => update({ gender: key })} style={[styles.optionCard, state.gender === key && styles.optionCardActive]}>
                    <Text style={styles.optionLabel}>{GENDER_LABELS[key]}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}

          {state.step === "body" && (
            <>
              <Text style={styles.title}>น้ำหนัก & ส่วนสูง</Text>
              <Text style={styles.subtitle}>ใช้คำนวณค่า BMI และแคลอรี่ที่แนะนำ</Text>
              <View style={styles.stack}>
                <StepperCard label="อายุ (ปี)" value={state.age} onDecrease={() => update((s) => ({ age: clamp("age", s.age - 1) }))} onIncrease={() => update((s) => ({ age: clamp("age", s.age + 1) }))} />
                <StepperCard label="น้ำหนัก (กก.)" value={state.weight} onDecrease={() => update((s) => ({ weight: clamp("weight", s.weight - 1) }))} onIncrease={() => update((s) => ({ weight: clamp("weight", s.weight + 1) }))} />
                <StepperCard label="ส่วนสูง (ซม.)" value={state.height} onDecrease={() => update((s) => ({ height: clamp("height", s.height - 1) }))} onIncrease={() => update((s) => ({ height: clamp("height", s.height + 1) }))} />
              </View>
              <View style={[styles.previewCard, { marginTop: 14 }]}>
                <View>
                  <Text style={styles.previewLabel}>BMI ของคุณ</Text>
                  <Text style={styles.previewValue}>{bmiDisplay}</Text>
                </View>
                <Badge label={bmiState.label} color={bmiState.color} />
              </View>
            </>
          )}

          {state.step === "location" && (
            <>
              <Text style={styles.title}>ออกกำลังกายที่ไหน?</Text>
              <Text style={styles.subtitle}>เลือกแล้วสลับได้ตลอดเวลาในหน้าแผนออกกำลังกาย</Text>
              <View style={styles.stack}>
                {[
                  { key: "home", label: "ที่บ้าน", sub: "ใช้น้ำหนักตัว/ดัมเบล เป็นหลัก" },
                  { key: "gym", label: "ที่ยิม", sub: "เข้าถึงเครื่องและอุปกรณ์ครบ" },
                  { key: "both", label: "ทั้งสองที่", sub: "สลับได้ตามความสะดวก" },
                ].map((item) => (
                  <Pressable key={item.key} onPress={() => update({ location: item.key, planLocation: item.key === "gym" ? "gym" : "home" })} style={[styles.optionCard, state.location === item.key && styles.optionCardActive]}>
                    <Text style={styles.optionTitle}>{item.label}</Text>
                    <Text style={styles.optionSub}>{item.sub}</Text>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={primaryDisabled}
            onPress={() => {
              if (state.step === "gender" && state.gender) update({ step: "body" });
              else if (state.step === "body") update({ step: "location" });
              else finishOnboarding();
            }}
            style={[styles.primaryButton, primaryDisabled && styles.primaryButtonDisabled]}
          >
            <Text style={[styles.primaryButtonText, primaryDisabled && styles.primaryButtonTextDisabled]}>{primaryLabel}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  function renderHome() {
    return (
      <>
        <Text style={styles.pageTitle}>ภาพรวมของคุณ</Text>
        <Text style={[styles.subtitle, { marginBottom: 18 }]}>{GENDER_LABELS[state.gender] || "-"} · {LOCATION_LABELS[state.location] || "-"}</Text>
        <LinearGradient colors={["#16191D", "#1E2227"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.eyebrow}>ดัชนีมวลกาย (BMI)</Text>
              <Text style={styles.heroValue}>{bmiDisplay}</Text>
            </View>
            <Badge label={bmiState.label} color={bmiState.color} />
          </View>
          <View style={styles.gaugeTrack}>
            <LinearGradient colors={["#4FA8FF", "#B6FF3B", "#FFD23B", "#FF6A2B", "#FF3B3B"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={StyleSheet.absoluteFillObject} />
            <View style={[styles.gaugeMarker, { left: `${markerLeft}%` }]} />
          </View>
          <View style={styles.scaleRow}>
            <Text style={styles.scaleText}>15</Text>
            <Text style={styles.scaleText}>25</Text>
            <Text style={styles.scaleText}>35</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsGrid}>
          {[
            { label: "อายุ", value: `${state.age} ปี` },
            { label: "น้ำหนัก", value: `${state.weight} กก.` },
            { label: "ส่วนสูง", value: `${state.height} ซม.` },
            { label: "แคลอรี่/วัน", value: `${tdee}`, accent: true },
          ].map((item) => (
            <View key={item.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={[styles.statValue, item.accent && styles.statValueAccent]}>{item.value}</Text>
            </View>
          ))}
        </View>

        <Pressable onPress={() => update({ tab: "plan" })} style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.eyebrow}>แผนวันนี้ · {DAYS_SHORT[todayIndex()]}</Text>
            <Text style={styles.inlineAccent}>ดูแผน ›</Text>
          </View>
          <Text style={styles.sectionTitle}>{WEEKLY_PLAN[todayIndex()].title}</Text>
          <Text style={styles.inlineMuted}>{WEEKLY_PLAN[todayIndex()].rest ? "วันพักผ่อน" : `${todayPlanIds.length} ท่าออกกำลังกาย`}</Text>
        </Pressable>
      </>
    );
  }

  function renderPlan() {
    return (
      <>
        <Text style={[styles.pageTitle, { marginBottom: 14 }]}>แผนออกกำลังกาย</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
          {DAYS_SHORT.map((short, index) => (
            <Chip key={short} label={short} active={state.day === index} onPress={() => update({ day: index })} compact />
          ))}
        </ScrollView>
        <View style={styles.segmentRow}>
          {["home", "gym"].map((loc) => (
            <Pressable key={loc} onPress={() => update({ planLocation: loc })} style={[styles.segmentButton, state.planLocation === loc && styles.segmentButtonActive]}>
              <Text style={[styles.segmentButtonText, state.planLocation === loc && styles.segmentButtonTextActive]}>{loc === "home" ? "บ้าน" : "ยิม"}</Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.sectionTitle}>{DAYS[state.day]} · {dayPlan.title}</Text>

        {dayPlan.rest ? (
          <View style={styles.restCard}>
            <Text style={styles.subtitle}>วันนี้พักผ่อนให้กล้ามเนื้อฟื้นตัว ยืดเหยียดเบาๆ และนอนหลับให้เพียงพอ</Text>
          </View>
        ) : (
          <>
            <Text style={styles.inlineMuted}>{doneCount}/{currentDayExercises.length} ท่าเสร็จแล้ว</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
            </View>
            <View style={styles.stack}>
              {currentDayExercises.length === 0 ? (
                <Text style={styles.emptyText}>ไม่มีท่าที่รองรับสำหรับโหมดนี้</Text>
              ) : currentDayExercises.map((exercise) => {
                const key = `${state.day}-${exercise.id}`;
                const done = !!state.completed[key];
                return (
                  <View key={exercise.id} style={styles.exerciseRow}>
                    <Pressable onPress={() => update((s) => ({ completed: { ...s.completed, [key]: !s.completed[key] } }))} style={[styles.checkBox, done && styles.checkBoxDone]} />
                    <Pressable onPress={() => update({ selectedExId: exercise.id })} style={styles.exerciseContent}>
                      <Text style={[styles.exerciseName, done && styles.exerciseNameDone]}>{exercise.name}</Text>
                      <Text style={styles.exerciseMeta}>{exercise.muscle} · {exercise.sets} เซ็ต x {exercise.reps}</Text>
                    </Pressable>
                    <Pressable onPress={() => update({ selectedExId: exercise.id })}>
                      <Text style={styles.chevron}>›</Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </>
    );
  }

  function renderMoves() {
    return (
      <>
        <Text style={[styles.pageTitle, { marginBottom: 14 }]}>คลังท่าออกกำลังกาย</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {MOVE_CATEGORIES.map((category) => (
            <Chip key={category} label={category} active={state.moveFilter === category} onPress={() => update({ moveFilter: category })} />
          ))}
        </ScrollView>
        <View style={styles.stack}>
          {filteredMoves.map((exercise) => (
            <Pressable key={exercise.id} onPress={() => update({ selectedExId: exercise.id })} style={styles.listCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.listTitle}>{exercise.name}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
              <Text style={styles.exerciseMeta}>{exercise.muscle} · {exercise.equip}</Text>
              <View style={styles.badgeRow}>
                <View style={[styles.locationBadge, { backgroundColor: exercise.locations.includes("home") ? "rgba(182,255,59,0.15)" : colors.surface2 }]}>
                  <Text style={[styles.locationBadgeText, { color: exercise.locations.includes("home") ? colors.lime : colors.muted2 }]}>บ้าน</Text>
                </View>
                <View style={[styles.locationBadge, { backgroundColor: exercise.locations.includes("gym") ? "rgba(255,106,43,0.15)" : colors.surface2 }]}>
                  <Text style={[styles.locationBadgeText, { color: exercise.locations.includes("gym") ? colors.accent : colors.muted2 }]}>ยิม</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </>
    );
  }

  function renderFood() {
    return (
      <>
        <Text style={[styles.pageTitle, { marginBottom: 14 }]}>แผนอาหาร</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
          {DAYS_SHORT.map((short, index) => (
            <Chip key={short} label={short} active={state.day === index} onPress={() => update({ day: index })} compact />
          ))}
        </ScrollView>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.inlineMuted}>รวมวันนี้</Text>
            <Text style={styles.inlineMuted}>{mealTotal} / {tdee} kcal</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.max(2, Math.min(100, (mealTotal / tdee) * 100))}%`, backgroundColor: colors.accent }]} />
          </View>
        </View>
        <View style={styles.stack}>
          {mealsForDay.map((meal) => (
            <View key={meal.type} style={styles.mealCard}>
              <Text style={styles.mealType}>{meal.type}</Text>
              <Text style={styles.mealName}>{meal.name}</Text>
              <Text style={styles.exerciseMeta}>{meal.kcal} kcal · โปรตีน {meal.protein}g</Text>
            </View>
          ))}
        </View>
      </>
    );
  }

  function renderProgress() {
    return (
      <>
        <Text style={[styles.pageTitle, { marginBottom: 14 }]}>ผลลัพธ์ของคุณ</Text>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryRow, { marginBottom: 14, alignItems: "flex-start" }]}>
            <View>
              <Text style={styles.summaryLabel}>สตรีค</Text>
              <Text style={[styles.summaryBig, { color: colors.accent }]}>{streak} วัน</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.summaryLabel}>สำเร็จสัปดาห์นี้</Text>
              <Text style={styles.summaryBig}>{workoutDaysDone}/{workoutDaysTotal} วัน</Text>
            </View>
          </View>
          <View style={styles.weekDots}>
            {DAYS_SHORT.map((short, index) => (
              <View key={short} style={styles.weekDay}>
                <View style={[styles.weekDot, weekDoneFlags[index] && !WEEKLY_PLAN[index].rest && styles.weekDotDone, todayIndex() === index && styles.weekDotToday]} />
                <Text style={styles.weekLabel}>{short}</Text>
              </View>
            ))}
          </View>
        </View>

        <LinearGradient colors={["#16191D", "#1E2227"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.summaryCard}>
          <Text style={styles.eyebrow}>คาดการณ์ใน 1 สัปดาห์ (ถ้าทำครบตามแผน)</Text>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastValue}>{predictedWeight} กก.</Text>
            <Text style={[styles.forecastDelta, { color: forecastColor }]}>{forecastText}</Text>
          </View>
          <Text style={styles.forecastNote}>ประมาณการจากแคลอรี่ที่แนะนำเทียบกับแผนอาหาร เป็นค่าคร่าวๆ ไม่แม่นยำ 100%</Text>
        </LinearGradient>

        <View style={styles.summaryCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.eyebrow}>น้ำหนักตามเวลา</Text>
            <Pressable onPress={() => update((s) => {
              const last = s.weightLog[s.weightLog.length - 1];
              const weightLog = last?.label === "วันนี้"
                ? [...s.weightLog.slice(0, -1), { label: "วันนี้", weight: s.weight }]
                : [...s.weightLog, { label: "วันนี้", weight: s.weight }];
              return { weightLog };
            })} style={styles.ghostButton}>
              <Text style={styles.ghostButtonText}>+ บันทึกวันนี้</Text>
            </Pressable>
          </View>
          <View style={styles.chartRow}>
            {state.weightLog.map((entry, index) => {
              const height = maxWeight === minWeight ? 60 : 20 + ((entry.weight - minWeight) / (maxWeight - minWeight)) * 70;
              const isLatest = index === state.weightLog.length - 1;
              return (
                <View key={`${entry.label}-${index}`} style={styles.chartItem}>
                  <Text style={styles.chartValue}>{entry.weight}</Text>
                  <View style={[styles.chartBar, { height: `${height}%` }, isLatest && styles.chartBarLatest]} />
                </View>
              );
            })}
          </View>
          <View style={styles.chartLabels}>
            {state.weightLog.map((entry, index) => (
              <Text key={`${entry.label}-${index}-label`} style={styles.weekLabel}>{entry.label}</Text>
            ))}
          </View>
        </View>

        <Text style={styles.eyebrowSection}>สถิติส่วนตัวต่อท่า</Text>
        <View style={styles.stack}>
          {[
            { id: "squat", trackWeight: true },
            { id: "deadlift", trackWeight: true },
            { id: "dbBenchPress", trackWeight: true },
            { id: "shoulderPress", trackWeight: true },
            { id: "bentRow", trackWeight: true },
            { id: "pushup", trackWeight: false },
          ].map((item) => {
            const record = state.prRecords[item.id] || { weight: 0, reps: 0 };
            return (
              <View key={item.id} style={styles.prCard}>
                <Text style={styles.prTitle}>{EXERCISES[item.id].name}</Text>
                <View style={styles.prRow}>
                  {item.trackWeight && (
                    <View style={styles.prField}>
                      <Text style={styles.prLabel}>น้ำหนัก (กก.)</Text>
                      <View style={styles.prStepper}>
                        <Pressable onPress={() => update((s) => ({ prRecords: { ...s.prRecords, [item.id]: { ...record, weight: Math.max(0, record.weight - 2.5) } } }))} style={styles.smallStepperButton}>
                          <Text style={styles.smallStepperText}>−</Text>
                        </Pressable>
                        <Text style={styles.prValue}>{record.weight} กก.</Text>
                        <Pressable onPress={() => update((s) => ({ prRecords: { ...s.prRecords, [item.id]: { ...record, weight: Math.min(300, record.weight + 2.5) } } }))} style={styles.smallStepperButton}>
                          <Text style={styles.smallStepperText}>+</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                  <View style={styles.prField}>
                    <Text style={styles.prLabel}>Reps สูงสุด</Text>
                    <View style={styles.prStepper}>
                      <Pressable onPress={() => update((s) => ({ prRecords: { ...s.prRecords, [item.id]: { ...record, reps: Math.max(0, record.reps - 1) } } }))} style={styles.smallStepperButton}>
                        <Text style={styles.smallStepperText}>−</Text>
                      </Pressable>
                      <Text style={styles.prValue}>{record.reps}</Text>
                      <Pressable onPress={() => update((s) => ({ prRecords: { ...s.prRecords, [item.id]: { ...record, reps: Math.min(100, record.reps + 1) } } }))} style={styles.smallStepperButton}>
                        <Text style={styles.smallStepperText}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </>
    );
  }

  function renderProfile() {
    const rows = [
      ["เพศ/อัตลักษณ์", GENDER_LABELS[state.gender] || "-"],
      ["อายุ", `${state.age} ปี`],
      ["น้ำหนัก", `${state.weight} กก.`],
      ["ส่วนสูง", `${state.height} ซม.`],
      ["ค่า BMI", `${bmiDisplay} (${bmiState.label})`],
      ["สถานที่ออกกำลังกาย", LOCATION_LABELS[state.location] || "-"],
    ];

    return (
      <>
        <Text style={[styles.pageTitle, { marginBottom: 14 }]}>โปรไฟล์</Text>
        <View style={styles.profileCard}>
          {rows.map(([label, value], index) => (
            <View key={label} style={[styles.profileRow, index === rows.length - 1 && styles.profileRowLast]}>
              <Text style={styles.profileLabel}>{label}</Text>
              <Text style={styles.profileValue}>{value}</Text>
            </View>
          ))}
        </View>
        <Pressable onPress={() => update({ step: "gender", isEditing: true, selectedExId: null })} style={styles.primaryAction}>
          <Text style={styles.primaryActionText}>แก้ไขข้อมูล</Text>
        </Pressable>
        <Pressable onPress={resetProfile} style={styles.resetAction}>
          <Text style={styles.resetActionText}>รีเซ็ตข้อมูลทั้งหมด</Text>
        </Pressable>
      </>
    );
  }

  function renderAppScreen() {
    const tabs = [
      { key: "home", label: "หน้าแรก" },
      { key: "plan", label: "แผน" },
      { key: "moves", label: "ท่า" },
      { key: "food", label: "อาหาร" },
      { key: "progress", label: "ผลลัพธ์" },
      { key: "profile", label: "โปรไฟล์" },
    ];

    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.appContent} showsVerticalScrollIndicator={false}>
          {state.tab === "home" && renderHome()}
          {state.tab === "plan" && renderPlan()}
          {state.tab === "moves" && renderMoves()}
          {state.tab === "food" && renderFood()}
          {state.tab === "progress" && renderProgress()}
          {state.tab === "profile" && renderProfile()}
        </ScrollView>

        <View style={styles.tabBar}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} label={tab.label} active={state.tab === tab.key} onPress={() => update({ tab: tab.key })} />
          ))}
        </View>

        <ExerciseSheet exercise={selectedExercise} visible={!!selectedExercise} onClose={() => update({ selectedExId: null })} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="light" />
      <StatusBar barStyle="light-content" />
      {state.step === "app" ? renderAppScreen() : renderOnboarding()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: colors.text,
    fontSize: 16,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  onboardingContent: {
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  appContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  topRow: {
    marginBottom: 8,
  },
  hidden: {
    opacity: 0,
  },
  backButton: {
    color: colors.muted,
    fontSize: 14,
  },
  progressRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  progressSegment: {
    height: 4,
    borderRadius: 999,
    flex: 1,
    backgroundColor: colors.border,
  },
  progressSegmentActive: {
    backgroundColor: colors.accent,
  },
  title: {
    color: colors.text,
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 6,
  },
  pageTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 2,
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 22,
  },
  stack: {
    gap: 10,
  },
  optionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  optionCardActive: {
    borderColor: colors.accent,
    backgroundColor: "rgba(255,106,43,0.12)",
  },
  optionLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
  },
  optionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
  },
  optionSub: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: colors.border,
  },
  primaryButtonText: {
    color: colors.bg,
    fontSize: 16,
    fontWeight: "700",
  },
  primaryButtonTextDisabled: {
    color: colors.muted2,
  },
  metricCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface2,
  },
  stepperButtonText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  stepperValue: {
    color: colors.text,
    fontSize: 44,
    fontWeight: "900",
  },
  previewCard: {
    backgroundColor: colors.surface2,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  previewValue: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  heroCard: {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  heroValue: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "900",
  },
  gaugeTrack: {
    height: 8,
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: colors.border,
    position: "relative",
  },
  gaugeMarker: {
    position: "absolute",
    top: -3,
    width: 3,
    height: 14,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
  },
  scaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  scaleText: {
    color: colors.muted2,
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    width: "48.5%",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  statLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  statValueAccent: {
    color: colors.accent,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  inlineAccent: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  inlineMuted: {
    color: colors.muted,
    fontSize: 13,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  pillRow: {
    gap: 6,
    marginBottom: 14,
  },
  filterRow: {
    gap: 6,
    marginBottom: 16,
  },
  compactChip: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  compactChipText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  filterChip: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterChipText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: colors.bg,
  },
  segmentRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  segmentButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: colors.surface2,
  },
  segmentButtonText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600",
  },
  segmentButtonTextActive: {
    color: colors.text,
  },
  restCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 24,
    marginTop: 14,
  },
  progressTrack: {
    height: 6,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: colors.lime,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center",
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderColor: "#3A3F46",
    borderWidth: 2,
  },
  checkBoxDone: {
    borderColor: colors.lime,
    backgroundColor: colors.lime,
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  exerciseNameDone: {
    color: colors.muted2,
    textDecorationLine: "line-through",
  },
  exerciseMeta: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  chevron: {
    color: colors.muted2,
    fontSize: 18,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  listTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  locationBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  locationBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  mealType: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  mealName: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  summaryBig: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
  },
  alignRight: {
    alignItems: "flex-end",
  },
  weekDots: {
    flexDirection: "row",
    gap: 6,
  },
  weekDay: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  weekDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#3A3F46",
  },
  weekDotDone: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  weekDotToday: {
    shadowColor: colors.accent,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    borderColor: colors.accent,
  },
  weekLabel: {
    color: colors.muted2,
    fontSize: 10,
    textAlign: "center",
    flex: 1,
  },
  forecastRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
    marginTop: 10,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  forecastValue: {
    color: colors.text,
    fontSize: 36,
    fontWeight: "900",
  },
  forecastDelta: {
    fontSize: 13,
    fontWeight: "600",
  },
  forecastNote: {
    color: colors.muted2,
    fontSize: 11,
    lineHeight: 17,
  },
  ghostButton: {
    backgroundColor: "rgba(255,106,43,0.15)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ghostButtonText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    height: 100,
    marginBottom: 8,
  },
  chartItem: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 4,
  },
  chartValue: {
    color: colors.muted,
    fontSize: 10,
  },
  chartBar: {
    width: "100%",
    backgroundColor: "#3A3F46",
    borderRadius: 6,
  },
  chartBarLatest: {
    backgroundColor: colors.accent,
  },
  chartLabels: {
    flexDirection: "row",
    gap: 8,
  },
  eyebrowSection: {
    color: colors.muted,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  prCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },
  prTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },
  prRow: {
    flexDirection: "row",
    gap: 16,
  },
  prField: {
    flex: 1,
  },
  prLabel: {
    color: colors.muted2,
    fontSize: 11,
    marginBottom: 6,
  },
  prStepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  smallStepperButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surface2,
    alignItems: "center",
    justifyContent: "center",
  },
  smallStepperText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  prValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(84,84,88,0.4)",
  },
  profileRowLast: {
    borderBottomWidth: 0,
  },
  profileLabel: {
    color: colors.muted,
    fontSize: 14,
  },
  profileValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  primaryAction: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryActionText: {
    color: colors.bg,
    fontSize: 15,
    fontWeight: "700",
  },
  resetAction: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  resetActionText: {
    color: "#FF3B3B",
    fontSize: 15,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
    backgroundColor: "rgba(11,13,16,0.96)",
    borderTopWidth: 1,
    borderTopColor: colors.surface2,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
  },
  tabDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "transparent",
  },
  tabDotActive: {
    backgroundColor: colors.accent,
  },
  tabLabel: {
    color: colors.muted2,
    fontSize: 11,
    fontWeight: "600",
  },
  tabLabelActive: {
    color: colors.accent,
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "75%",
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#3A3F46",
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
  },
  sheetBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 14,
  },
  metaPill: {
    backgroundColor: colors.surface2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPillText: {
    color: colors.muted,
    fontSize: 12,
  },
  sheetStepRow: {
    flexDirection: "row",
    gap: 10,
  },
  sheetStepIndex: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface2,
  },
  sheetStepIndexText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
  },
  sheetStepText: {
    flex: 1,
    color: "#D5D9DE",
    fontSize: 14,
    lineHeight: 21,
  },
});
