import { useState, useEffect, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const EXAM_DATE  = new Date("2027-08-01T00:00:00");
const START_DATE = new Date("2026-05-25T00:00:00");
const TOTAL_DAYS = 433;

const PHASES = [
  { id:1, label:"Phase 1", desc:"Foundation & Learning",  start:new Date("2026-05-25"), end:new Date("2027-01-31"), color:"#3B82F6" },
  { id:2, label:"Phase 2", desc:"First Revision",         start:new Date("2027-02-01"), end:new Date("2027-05-15"), color:"#8B5CF6" },
  { id:3, label:"Phase 3", desc:"Speed Drills",           start:new Date("2027-05-16"), end:new Date("2027-07-15"), color:"#F59E0B" },
  { id:4, label:"Phase 4", desc:"Mock Sprint",            start:new Date("2027-07-16"), end:new Date("2027-07-31"), color:"#EF4444" },
];

const MOTIVATIONAL = [
  "Rome wasn't built in a day. But they worked every single day. 🏛️",
  "Your future self is watching you right now. Make them proud. 💪",
  "SBI PO isn't a dream — it's a decision. Stay decided. 🎯",
  "Every mock test is a dress rehearsal for your victory. 📝",
  "3-4 hours today. A lifetime of pride tomorrow. ⚡",
  "Consistency beats talent when talent doesn't work consistently. 🔥",
  "Hard days build the strongest candidates. Push through. 🌊",
  "You're one revision away from a breakthrough. Keep going. 🚀",
  "TCS by day, SBI PO warrior by night. That's your story. ⭐",
  "Puzzles and DI today. Probationary Officer designation tomorrow. 🏦",
  "Small daily improvements lead to stunning yearly results. 📈",
  "Your dedication is your competitive advantage. Use it. 🏆",
  "Every question you solve today is one less surprise on exam day. 🎓",
];

// All topics in rotation
const FLAT_TOPICS = [
  // Reasoning
  { id:"r1",  name:"Puzzles & Seating Arrangement", sub:"Linear, Circular, Floor, Box, Month-based",          subject:"Reasoning", weight:4 },
  { id:"r2",  name:"Syllogism",                      sub:"All/Some/No, Possibility cases",                     subject:"Reasoning", weight:2 },
  { id:"r3",  name:"Inequality",                     sub:"Direct & Coded Inequality",                          subject:"Reasoning", weight:2 },
  { id:"r4",  name:"Coding-Decoding",                sub:"Letter shifting, Number pattern",                    subject:"Reasoning", weight:2 },
  { id:"r5",  name:"Blood Relations",                sub:"Family tree, Coded relations",                       subject:"Reasoning", weight:2 },
  { id:"r6",  name:"Direction & Distance",           sub:"North/South/East/West problems",                    subject:"Reasoning", weight:1 },
  { id:"r7",  name:"Alphanumeric Series",            sub:"Letter-number pattern",                              subject:"Reasoning", weight:1 },
  { id:"r8",  name:"Input-Output",                   sub:"Word/number shifting machines",                      subject:"Reasoning", weight:2 },
  { id:"r9",  name:"Order & Ranking",                sub:"Top/Bottom/Position based",                          subject:"Reasoning", weight:1 },
  { id:"r10", name:"Data Sufficiency",               sub:"2-statement DS problems",                            subject:"Reasoning", weight:2 },
  { id:"r11", name:"Critical Reasoning",             sub:"Cause-Effect, Assumption, Argument",                 subject:"Reasoning", weight:2 },
  { id:"r12", name:"Miscellaneous Reasoning",        sub:"Analogy, Classification, Statement-Conclusion",      subject:"Reasoning", weight:1 },
  // Quant
  { id:"q1",  name:"Number System & Simplification",sub:"BODMAS, Approximation, Surds",                       subject:"Quant",     weight:2 },
  { id:"q2",  name:"Number Series",                  sub:"Missing term, Wrong term",                           subject:"Quant",     weight:2 },
  { id:"q3",  name:"Quadratic Equations",            sub:"Comparing roots of two equations",                   subject:"Quant",     weight:2 },
  { id:"q4",  name:"Data Interpretation",            sub:"Bar, Line, Pie, Tabular, Caselet",                  subject:"Quant",     weight:5 },
  { id:"q5",  name:"Percentage",                     sub:"Increase/Decrease, Applications",                    subject:"Quant",     weight:2 },
  { id:"q6",  name:"Ratio & Proportion",             sub:"Direct, Inverse, Mixtures",                          subject:"Quant",     weight:2 },
  { id:"q7",  name:"Average",                        sub:"Mean, Weighted average",                             subject:"Quant",     weight:1 },
  { id:"q8",  name:"Profit & Loss",                  sub:"SP/CP, Discount, Marked price",                      subject:"Quant",     weight:2 },
  { id:"q9",  name:"Simple & Compound Interest",     sub:"SI, CI, Instalments",                                subject:"Quant",     weight:2 },
  { id:"q10", name:"Time, Speed & Distance",         sub:"Trains, Boats, Races",                               subject:"Quant",     weight:2 },
  { id:"q11", name:"Time & Work",                    sub:"Pipes & Cisterns, Work efficiency",                  subject:"Quant",     weight:2 },
  { id:"q12", name:"Probability",                    sub:"Classical, Conditional",                             subject:"Quant",     weight:2 },
  { id:"q13", name:"Permutation & Combination",      sub:"Arrangement, Selection",                             subject:"Quant",     weight:2 },
  { id:"q14", name:"Mixture & Alligation",           sub:"Weighted averages, Vessels",                         subject:"Quant",     weight:1 },
  { id:"q15", name:"Partnership",                    sub:"Profit sharing, Time-ratio",                         subject:"Quant",     weight:1 },
  { id:"q16", name:"Ages",                           sub:"Linear equations for age problems",                  subject:"Quant",     weight:1 },
  // English
  { id:"e1",  name:"Reading Comprehension",          sub:"Main idea, Inference, Vocab in context",             subject:"English",   weight:3 },
  { id:"e2",  name:"Cloze Test",                     sub:"Contextual word filling",                            subject:"English",   weight:2 },
  { id:"e3",  name:"Error Detection",                sub:"Grammatical errors in sentences",                    subject:"English",   weight:2 },
  { id:"e4",  name:"Sentence Improvement",           sub:"Replace underlined part",                            subject:"English",   weight:1 },
  { id:"e5",  name:"Fillers",                        sub:"Single & Double fillers",                            subject:"English",   weight:2 },
  { id:"e6",  name:"Para Jumbles",                   sub:"Rearranging 5-6 sentences",                          subject:"English",   weight:2 },
  { id:"e7",  name:"Vocabulary",                     sub:"Synonyms, Antonyms, Idioms, Phrases",                subject:"English",   weight:2 },
  { id:"e8",  name:"Sentence Connectors",            sub:"Joining sentences logically",                        subject:"English",   weight:1 },
  { id:"e9",  name:"Word Usage / Spotting Errors",   sub:"Correct usage, Misfit words",                        subject:"English",   weight:1 },
];

const ALL_TOPICS = {
  Reasoning: FLAT_TOPICS.filter(t => t.subject === "Reasoning"),
  Quant:     FLAT_TOPICS.filter(t => t.subject === "Quant"),
  English:   FLAT_TOPICS.filter(t => t.subject === "English"),
};

const SKIP_TOPICS = [
  { name:"Computer Aptitude",       reason:"Only in Mains — not in Prelims" },
  { name:"Banking Awareness",       reason:"Mains only — don't sacrifice Prelims time" },
  { name:"General Knowledge",       reason:"Not directly tested in Prelims" },
  { name:"Current Affairs",         reason:"Only in Mains — focus on Prelims first" },
  { name:"Essay / Letter Writing",  reason:"Mains Descriptive only" },
  { name:"Advanced Statistics",     reason:"Not in SBI PO pattern" },
  { name:"Geometry & Mensuration",  reason:"Very rarely appears — low ROI for Prelims" },
  { name:"Trigonometry",            reason:"Not in SBI PO Prelims syllabus" },
];

const SUBJ_COLOR = { Reasoning:"#3B82F6", Quant:"#F59E0B", English:"#22C55E" };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const pad = n => String(n).padStart(2,"0");
const daysBetween = (a,b) => Math.floor((b-a)/86400000);
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

function getPhase(d) {
  for (const p of PHASES) if (d >= p.start && d <= p.end) return p;
  return PHASES[3];
}

function getDayTasks(dayNum, isWeekend, phase) {
  const t = FLAT_TOPICS[dayNum % FLAT_TOPICS.length];
  const { subject: subj, name: topic, sub } = t;

  if (isWeekend) {
    if (phase.id === 1) return [
      { time:"8:00–9:00 AM",    act:`[${subj}] Deep Theory`,           detail:`${topic} — read concept thoroughly` },
      { time:"9:00–10:30 AM",   act:`[${subj}] Concept Practice`,      detail:`${sub} — solve 30–40 questions` },
      { time:"10:30–11:00 AM",  act:"Break + Short Notes",             detail:"Summarise key points in notebook" },
      { time:"11:00 AM–1:00 PM",act:`[${subj}] Advanced Problems`,     detail:`${topic} — PYQs, high-difficulty Qs` },
      { time:"2:00–4:00 PM",    act:"Sectional Mock (Full, Timed)",    detail:"60-Q section under exam conditions" },
      { time:"4:00–5:00 PM",    act:"Mock Analysis",                   detail:"Error log, formula re-check" },
      { time:"5:00–6:00 PM",    act:"Weak Topic Extra Drill",          detail:"Pick your weakest sub-topic and drill" },
      { time:"6:00–7:00 PM",    act:"Weekly Consolidation",            detail:"Summarise the week's topics in notebook" },
    ];
    if (phase.id === 2) return [
      { time:"8:00–9:30 AM",    act:`[${subj}] Revision`,              detail:`${topic} — short notes + 20 Qs` },
      { time:"9:30–11:00 AM",   act:"Full Mock Test #1",               detail:"Complete 100-Q prelims mock in 60 min" },
      { time:"11:00–12:00 PM",  act:"Mock Analysis",                   detail:"Detailed error analysis, note patterns" },
      { time:"1:00–3:00 PM",    act:"Targeted Weak Area Drill",        detail:"From mock analysis — fix weak spots" },
      { time:"3:00–5:00 PM",    act:"Full Mock Test #2",               detail:"Second mock — beat your previous score" },
      { time:"5:00–6:00 PM",    act:"Mock Comparison + Planning",      detail:"Compare scores, plan next week" },
      { time:"6:00–7:00 PM",    act:"Light Banking News",              detail:"5 important banking/economy headlines" },
    ];
    if (phase.id === 3) return [
      { time:"8:00–9:00 AM",    act:"Formula Blast Revision",          detail:"All formulas: Quant + Reasoning shortcuts" },
      { time:"9:00–11:00 AM",   act:"Full Mock Test #1 (60 min)",      detail:"Strict exam simulation" },
      { time:"11:00–12:00 PM",  act:"Detailed Mock Analysis",          detail:"Section-by-section error review" },
      { time:"12:30–2:30 PM",   act:"Full Mock Test #2",               detail:"Focus on accuracy + speed" },
      { time:"2:30–4:00 PM",    act:`Speed Drill — ${subj}`,           detail:"Rapid-fire 50 questions in 25 min" },
      { time:"4:00–5:00 PM",    act:"PYQ Practice",                    detail:"Last 5 years SBI PO Prelims PYQs" },
      { time:"5:00–6:30 PM",    act:"English Sprint",                  detail:"2 full RC passages + 2 Cloze tests" },
      { time:"6:30–7:00 PM",    act:"Day Summary",                     detail:"Write 5 things you improved today" },
    ];
    return [
      { time:"7:00–8:00 AM",    act:"Formula & Shortcut Revision",     detail:"Last-minute formula sheet review" },
      { time:"8:00–10:00 AM",   act:"Full Mock Test + Analysis",       detail:"60-min prelims simulation + deep analysis" },
      { time:"10:30–12:00 PM",  act:"Full Mock Test #2",               detail:"Aim for 90%+ accuracy" },
      { time:"1:00–3:00 PM",    act:"Top-50 Mistakes Review",          detail:"Error log — never repeat the same mistake" },
      { time:"3:00–5:00 PM",    act:"Section Speed Drill",             detail:"Reasoning 20m + Quant 20m + English 20m" },
      { time:"5:00–6:00 PM",    act:"Mental Math Practice",            detail:"Rapid calculation and approximation drills" },
      { time:"6:00–7:00 PM",    act:"Relax + Visualise",               detail:"Light walk, review your journey, sleep well" },
    ];
  } else {
    if (phase.id === 1) return [
      { time:"7:00–8:00 AM",    act:`[${subj}] Theory`,                detail:`${topic} — read concept, note formulas/rules` },
      { time:"9:00–9:30 PM",    act:`[${subj}] Practice`,              detail:`${topic} — solve 20 questions` },
      { time:"9:30–10:30 PM",   act:`[${subj}] Deep Drill`,            detail:`${sub} — focus on weak sub-areas` },
      { time:"10:30–11:00 PM",  act:"Review + Preview",                detail:"Revise today's notes, check tomorrow's topic" },
    ];
    if (phase.id === 2) return [
      { time:"7:00–8:00 AM",    act:`[${subj}] Revision`,              detail:`${topic} — re-read short notes + formulas` },
      { time:"9:00–10:00 PM",   act:`[${subj}] Mixed Practice`,        detail:"30 questions timed (30 min)" },
      { time:"10:00–10:30 PM",  act:"Error Log Review",                detail:"Review previously wrong answers" },
      { time:"10:30–11:00 PM",  act:"Sectional Quiz",                  detail:"15 Qs in 15 min — self-timed mini-test" },
    ];
    if (phase.id === 3) return [
      { time:"7:00–7:30 AM",    act:`[${subj}] Flash Revision`,        detail:`${topic} — quick scan of formula sheet` },
      { time:"9:00–10:30 PM",   act:`[${subj}] Speed Drill`,           detail:"40 questions in 30 min — race the clock" },
      { time:"10:30–11:00 PM",  act:"Mock Section Practice",           detail:"One section of a mock (20 min)" },
    ];
    return [
      { time:"7:00–8:00 AM",    act:"Full Mock Part 1",                detail:"Reasoning + English (40 min)" },
      { time:"9:00–10:00 PM",   act:"Full Mock Part 2",                detail:"Quantitative Aptitude (20 min)" },
      { time:"10:00–11:00 PM",  act:"Mock Analysis",                   detail:"Identify mistakes, revise weak spots" },
    ];
  }
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
function useLs(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function CountdownBlock({ label, value }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
      <div style={{
        background:"linear-gradient(135deg,#1e3a5f,#0f2040)",
        border:"1px solid rgba(251,191,36,0.35)",
        borderRadius:10, minWidth:58, padding:"8px 6px 5px",
        boxShadow:"0 4px 18px rgba(0,0,0,0.4), inset 0 1px 0 rgba(251,191,36,0.1)"
      }}>
        <div style={{
          fontFamily:"'Courier New',monospace", fontSize:26, fontWeight:900,
          color:"#FBD038", letterSpacing:2, textAlign:"center",
          textShadow:"0 0 18px rgba(251,208,56,0.5)"
        }}>{pad(value)}</div>
      </div>
      <div style={{ fontSize:9, color:"#94A3B8", marginTop:3, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
    </div>
  );
}

function ProgressBar({ value, max, color="#FBD038", height=7 }) {
  const pct = max > 0 ? Math.min(100, Math.round((value/max)*100)) : 0;
  return (
    <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:99, height, overflow:"hidden" }}>
      <div style={{
        width:`${pct}%`, height:"100%", borderRadius:99,
        background:`linear-gradient(90deg,${color}88,${color})`,
        transition:"width 0.7s ease", boxShadow:`0 0 8px ${color}55`
      }}/>
    </div>
  );
}

function Checkbox({ checked, onChange, label, sub }) {
  return (
    <label style={{
      display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer",
      padding:"10px 12px", borderRadius:10, marginBottom:6,
      background: checked ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
      border:`1px solid ${checked ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.07)"}`,
      transition:"all 0.2s"
    }}>
      <div onClick={onChange} style={{
        width:19, height:19, borderRadius:5, flexShrink:0, marginTop:2,
        background: checked ? "#22C55E" : "transparent",
        border:`2px solid ${checked ? "#22C55E" : "rgba(251,191,36,0.4)"}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.2s", cursor:"pointer"
      }}>
        {checked && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 3.5l2.5 2.5 5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>}
      </div>
      <div style={{ flex:1 }}>
        <div style={{
          fontSize:13, fontWeight:600, lineHeight:1.4,
          color: checked ? "#64748B" : "#E2E8F0",
          textDecoration: checked ? "line-through" : "none"
        }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:"#4B5563", marginTop:2 }}>{sub}</div>}
      </div>
    </label>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SBIPOTracker() {
  const realNow     = new Date();
  const [viewDate, setViewDate] = useState(realNow);  // date being viewed (for calendar navigation)
  const isToday     = viewDate.toDateString() === realNow.toDateString();

  const dayOfWeek   = viewDate.getDay();
  const isWeekend   = dayOfWeek === 0 || dayOfWeek === 6;
  const dayNum      = Math.max(0, daysBetween(START_DATE, viewDate));
  const phase       = getPhase(viewDate);
  const tasks       = getDayTasks(dayNum, isWeekend, phase);
  const todayKey    = viewDate.toISOString().slice(0,10);
  const motivIdx    = dayNum % MOTIVATIONAL.length;

  // ── State
  const [taskChecks,    setTaskChecks]    = useLs(`sbi-tasks-${todayKey}`, {});
  const [topicChecks,   setTopicChecks]   = useLs("sbi-topics", {});
  const [sessionsToday, setSessionsToday] = useLs(`sbi-sessions-${realNow.toISOString().slice(0,10)}`, 0);
  const [timerMins,     setTimerMins]     = useState(25);
  const [timerSecs,     setTimerSecs]     = useState(0);
  const [timerRunning,  setTimerRunning]  = useState(false);
  const [timerDone,     setTimerDone]     = useState(false);
  const [customMins,    setCustomMins]    = useState(25);
  const [skipOpen,      setSkipOpen]      = useState(false);
  const [activeTab,     setActiveTab]     = useState("today");
  const [countdown,     setCountdown]     = useState({ days:0, hours:0, mins:0, secs:0 });
  const [showCalendar,  setShowCalendar]  = useState(false);
  const timerRef = useRef(null);

  // Live countdown
  useEffect(() => {
    const tick = () => {
      const diff = EXAM_DATE - new Date();
      if (diff <= 0) { setCountdown({ days:0, hours:0, mins:0, secs:0 }); return; }
      setCountdown({
        days:  Math.floor(diff/86400000),
        hours: Math.floor((diff%86400000)/3600000),
        mins:  Math.floor((diff%3600000)/60000),
        secs:  Math.floor((diff%60000)/1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Timer engine
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSecs(s => {
          if (s > 0) return s - 1;
          setTimerMins(m => {
            if (m > 0) return m - 1;
            clearInterval(timerRef.current);
            setTimerRunning(false);
            setTimerDone(true);
            setSessionsToday(n => n + 1);
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain); gain.connect(ctx.destination);
              osc.frequency.value = 523;
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
              osc.start(); osc.stop(ctx.currentTime + 1.5);
            } catch {}
            return 0;
          });
          return 59;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimerDone(false);
    setTimerMins(customMins);
    setTimerSecs(0);
  };

  // Navigation helpers
  const shiftDay = delta => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + delta);
    const minDate = new Date("2026-05-25");
    const maxDate = new Date("2027-08-01");
    if (d >= minDate && d <= maxDate) setViewDate(d);
  };

  // Derived
  const daysElapsed   = clamp(dayNum, 0, TOTAL_DAYS);
  const pctDone       = Math.round((daysElapsed/TOTAL_DAYS)*100);
  const daysLeft      = Math.max(0, daysBetween(realNow, EXAM_DATE));
  const tasksDoneToday= Object.values(taskChecks).filter(Boolean).length;
  const studyHrs      = Math.round(sessionsToday * customMins / 60 * 10) / 10;

  const subjectCounts = {};
  Object.entries(ALL_TOPICS).forEach(([subj, topics]) => {
    subjectCounts[subj] = { done: topics.filter(t => topicChecks[t.id]).length, total: topics.length };
  });
  const totalTopicsDone = Object.values(subjectCounts).reduce((s,v)=>s+v.done, 0);

  // ── Calendar picker component
  function CalendarPicker() {
    const [calYear,  setCalYear]  = useState(viewDate.getFullYear());
    const [calMonth, setCalMonth] = useState(viewDate.getMonth());
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
    const minDate = new Date("2026-05-25");
    const maxDate = new Date("2027-08-01");
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const prevMonth = () => {
      if (calMonth === 0) { setCalMonth(11); setCalYear(y=>y-1); }
      else setCalMonth(m=>m-1);
    };
    const nextMonth = () => {
      if (calMonth === 11) { setCalMonth(0); setCalYear(y=>y+1); }
      else setCalMonth(m=>m+1);
    };

    return (
      <div style={{
        position:"fixed", inset:0, zIndex:200,
        background:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center"
      }} onClick={() => setShowCalendar(false)}>
        <div onClick={e=>e.stopPropagation()} style={{
          background:"#0D1B2E", border:"1px solid rgba(251,208,56,0.3)",
          borderRadius:16, padding:20, width:320, boxShadow:"0 20px 60px rgba(0,0,0,0.7)"
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
            <button onClick={prevMonth} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:8, padding:"6px 10px", color:"#94A3B8", cursor:"pointer", fontSize:16 }}>‹</button>
            <div style={{ fontSize:15, fontWeight:700, color:"#FBD038" }}>{monthNames[calMonth]} {calYear}</div>
            <button onClick={nextMonth} style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:8, padding:"6px 10px", color:"#94A3B8", cursor:"pointer", fontSize:16 }}>›</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:8 }}>
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=>(
              <div key={d} style={{ textAlign:"center", fontSize:10, color:"#475569", fontWeight:700, padding:"2px 0" }}>{d}</div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {Array(firstDay).fill(null).map((_,i)=><div key={`e${i}`}/>)}
            {Array(daysInMonth).fill(null).map((_,i)=>{
              const day = i+1;
              const d = new Date(calYear, calMonth, day);
              const isDisabled = d < minDate || d > maxDate;
              const isSelected = d.toDateString() === viewDate.toDateString();
              const isRealToday= d.toDateString() === realNow.toDateString();
              return (
                <button key={day} disabled={isDisabled} onClick={()=>{ setViewDate(d); setShowCalendar(false); }} style={{
                  padding:"6px 2px", borderRadius:7, border:"none", cursor:isDisabled?"not-allowed":"pointer",
                  background: isSelected ? "#FBD038" : isRealToday ? "rgba(251,208,56,0.2)" : "rgba(255,255,255,0.04)",
                  color: isDisabled ? "#1E293B" : isSelected ? "#0A1628" : isRealToday ? "#FBD038" : "#CBD5E1",
                  fontSize:12, fontWeight: isSelected||isRealToday ? 700 : 400
                }}>{day}</button>
              );
            })}
          </div>
          <button onClick={()=>{ setViewDate(realNow); setShowCalendar(false); }} style={{
            width:"100%", marginTop:14, padding:"10px", borderRadius:10,
            background:"rgba(251,208,56,0.12)", border:"1px solid rgba(251,208,56,0.3)",
            color:"#FBD038", fontSize:13, fontWeight:700, cursor:"pointer"
          }}>Go to Today</button>
        </div>
      </div>
    );
  }

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#060D1F 0%,#0A1628 50%,#06111F 100%)",
      fontFamily:"Georgia,serif",
      color:"#E2E8F0",
    }}>
      {showCalendar && <CalendarPicker />}

      <div style={{ maxWidth:480, margin:"0 auto", paddingBottom:60, position:"relative" }}>

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div style={{
          background:"linear-gradient(135deg,#0D2B6E 0%,#0A1F50 60%,#071530 100%)",
          borderBottom:"1px solid rgba(251,208,56,0.2)",
          padding:"20px 16px 16px",
          position:"sticky", top:0, zIndex:100,
          boxShadow:"0 8px 32px rgba(0,0,0,0.5)"
        }}>
          {/* Title row */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:10, color:"#FBD038", letterSpacing:3, textTransform:"uppercase", fontFamily:"monospace", marginBottom:2 }}>SBI PO 2027</div>
              <div style={{ fontSize:18, fontWeight:900, color:"#F1F5F9", letterSpacing:-0.5 }}>
                {viewDate.toLocaleDateString("en-IN",{ weekday:"long" })}
              </div>
              <div style={{ fontSize:12, color:"#94A3B8", fontFamily:"monospace" }}>
                {viewDate.toLocaleDateString("en-IN",{ day:"2-digit", month:"long", year:"numeric" })}
                {!isToday && <span style={{ color:"#F59E0B", marginLeft:6, fontSize:10 }}>← BROWSING</span>}
              </div>
            </div>
            <div style={{
              background:"rgba(251,208,56,0.1)", border:"1px solid rgba(251,208,56,0.3)",
              borderRadius:10, padding:"6px 12px", textAlign:"center"
            }}>
              <div style={{ fontSize:22, fontWeight:900, color:"#FBD038", fontFamily:"monospace" }}>{daysLeft}</div>
              <div style={{ fontSize:9, color:"#94A3B8", letterSpacing:1, textTransform:"uppercase" }}>days left</div>
            </div>
          </div>

          {/* Countdown */}
          <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:10 }}>
            <CountdownBlock label="Days"  value={countdown.days} />
            <div style={{ color:"#FBD038", fontSize:22, fontWeight:900, alignSelf:"center", marginBottom:14 }}>:</div>
            <CountdownBlock label="Hours" value={countdown.hours} />
            <div style={{ color:"#FBD038", fontSize:22, fontWeight:900, alignSelf:"center", marginBottom:14 }}>:</div>
            <CountdownBlock label="Mins"  value={countdown.mins} />
            <div style={{ color:"#FBD038", fontSize:22, fontWeight:900, alignSelf:"center", marginBottom:14 }}>:</div>
            <CountdownBlock label="Secs"  value={countdown.secs} />
          </div>

          {/* Date navigation bar */}
          <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:10 }}>
            <button onClick={()=>shiftDay(-1)} style={{
              flex:"0 0 36px", height:36, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)",
              background:"rgba(255,255,255,0.06)", color:"#94A3B8", cursor:"pointer", fontSize:16
            }}>‹</button>
            <button onClick={()=>setShowCalendar(true)} style={{
              flex:1, height:36, borderRadius:8, border:"1px solid rgba(251,208,56,0.25)",
              background:"rgba(251,208,56,0.06)", color:"#FBD038", cursor:"pointer",
              fontSize:12, fontWeight:700, letterSpacing:0.5
            }}>📅 {isToday ? "Today" : viewDate.toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"2-digit" })}</button>
            {!isToday && (
              <button onClick={()=>setViewDate(realNow)} style={{
                flex:"0 0 60px", height:36, borderRadius:8, border:"1px solid rgba(34,197,94,0.3)",
                background:"rgba(34,197,94,0.08)", color:"#22C55E", cursor:"pointer", fontSize:11, fontWeight:700
              }}>Today</button>
            )}
            <button onClick={()=>shiftDay(1)} style={{
              flex:"0 0 36px", height:36, borderRadius:8, border:"1px solid rgba(255,255,255,0.1)",
              background:"rgba(255,255,255,0.06)", color:"#94A3B8", cursor:"pointer", fontSize:16
            }}>›</button>
          </div>

          {/* Motivational */}
          <div style={{
            background:"rgba(251,208,56,0.06)", border:"1px solid rgba(251,208,56,0.15)",
            borderRadius:8, padding:"7px 12px", fontSize:11, color:"#CBD5E1",
            fontStyle:"italic", textAlign:"center", lineHeight:1.5
          }}>
            {MOTIVATIONAL[motivIdx]}
          </div>
        </div>

        {/* ── NAV TABS ───────────────────────────────────────────── */}
        <div style={{
          display:"flex", background:"#060D1F",
          borderBottom:"1px solid rgba(255,255,255,0.07)",
          position:"sticky", top:238, zIndex:90
        }}>
          {[
            { id:"today",    label:"📅 Today"    },
            { id:"timer",    label:"⏱ Timer"    },
            { id:"progress", label:"📊 Progress" },
            { id:"topics",   label:"📚 Topics"   },
          ].map(tab=>(
            <button key={tab.id} onClick={()=>setActiveTab(tab.id)} style={{
              flex:1, padding:"11px 4px", fontSize:10.5, fontWeight:700,
              background:"transparent", border:"none", cursor:"pointer",
              color: activeTab===tab.id ? "#FBD038" : "#64748B",
              borderBottom:`2px solid ${activeTab===tab.id ? "#FBD038" : "transparent"}`,
              transition:"all 0.2s", letterSpacing:0.3
            }}>{tab.label}</button>
          ))}
        </div>

        <div style={{ padding:"14px 14px 0" }}>

          {/* ══ TODAY TAB ══════════════════════════════════════════ */}
          {activeTab==="today" && (
            <div>
              {/* Phase + type badges */}
              <div style={{ display:"flex", gap:8, marginBottom:12, flexWrap:"wrap" }}>
                <div style={{
                  background:`${phase.color}22`, border:`1px solid ${phase.color}55`,
                  borderRadius:8, padding:"5px 11px", fontSize:11, color:phase.color, fontWeight:700
                }}>🎯 {phase.label} — {phase.desc}</div>
                <div style={{
                  background: isWeekend ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.12)",
                  border:`1px solid ${isWeekend ? "rgba(34,197,94,0.3)" : "rgba(59,130,246,0.3)"}`,
                  borderRadius:8, padding:"5px 11px", fontSize:11,
                  color: isWeekend ? "#22C55E" : "#60A5FA", fontWeight:700
                }}>{isWeekend?"🏖 Weekend · 6–8 hrs":"💼 Weekday · 3–4 hrs"}</div>
              </div>

              {/* Day num info */}
              <div style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:10, padding:"10px 14px", marginBottom:12,
                display:"flex", justifyContent:"space-between", alignItems:"center"
              }}>
                <div>
                  <div style={{ fontSize:11, color:"#64748B" }}>Study Day</div>
                  <div style={{ fontSize:20, fontWeight:900, color:"#FBD038", fontFamily:"monospace" }}>
                    {dayNum+1}<span style={{ fontSize:12, color:"#475569" }}>/{TOTAL_DAYS}</span>
                  </div>
                </div>
                <div style={{ flex:1, margin:"0 16px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                    <span style={{ fontSize:11, color:"#94A3B8" }}>Today's tasks</span>
                    <span style={{ fontSize:11, color:"#FBD038", fontWeight:700 }}>{tasksDoneToday}/{tasks.length}</span>
                  </div>
                  <ProgressBar value={tasksDoneToday} max={tasks.length}/>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11, color:"#64748B" }}>Topic today</div>
                  <div style={{ fontSize:11, color:"#E2E8F0", fontWeight:600, maxWidth:90, textAlign:"right" }}>
                    {FLAT_TOPICS[dayNum%FLAT_TOPICS.length].name}
                  </div>
                </div>
              </div>

              {/* Task checklist */}
              <div style={{ marginBottom:12 }}>
                {tasks.map((task,i)=>(
                  <Checkbox
                    key={i}
                    checked={!!taskChecks[i]}
                    onChange={()=>setTaskChecks(c=>({...c,[i]:!c[i]}))}
                    label={`${task.time} — ${task.act}`}
                    sub={task.detail}
                  />
                ))}
              </div>

              {/* Skip section */}
              <div style={{
                background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.2)",
                borderRadius:12, overflow:"hidden", marginBottom:12
              }}>
                <button onClick={()=>setSkipOpen(o=>!o)} style={{
                  width:"100%", background:"none", border:"none", cursor:"pointer",
                  padding:"11px 14px", display:"flex", justifyContent:"space-between", alignItems:"center"
                }}>
                  <span style={{ fontSize:13, color:"#EF4444", fontWeight:700 }}>❌ Topics to SKIP for Prelims</span>
                  <span style={{ color:"#EF4444" }}>{skipOpen?"▲":"▼"}</span>
                </button>
                {skipOpen && (
                  <div style={{ padding:"0 14px 14px" }}>
                    {SKIP_TOPICS.map((t,i)=>(
                      <div key={i} style={{
                        padding:"7px 10px", borderRadius:8, marginBottom:5,
                        background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.15)"
                      }}>
                        <div style={{ fontSize:12, color:"#FCA5A5", fontWeight:700 }}>{t.name}</div>
                        <div style={{ fontSize:11, color:"#94A3B8", marginTop:1 }}>{t.reason}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ TIMER TAB ══════════════════════════════════════════ */}
          {activeTab==="timer" && (
            <div style={{ textAlign:"center" }}>
              {/* Stats */}
              <div style={{ display:"flex", gap:8, marginBottom:18 }}>
                {[
                  { label:"Sessions", val:sessionsToday, color:"#3B82F6" },
                  { label:"Hrs Studied", val:`${studyHrs}h`, color:"#22C55E" },
                  { label:"Min/Session", val:customMins, color:"#FBD038" },
                ].map((s,i)=>(
                  <div key={i} style={{
                    flex:1, background:`${s.color}11`, border:`1px solid ${s.color}33`,
                    borderRadius:12, padding:"11px 8px"
                  }}>
                    <div style={{ fontSize:22, fontWeight:900, color:s.color, fontFamily:"monospace" }}>{s.val}</div>
                    <div style={{ fontSize:10, color:"#64748B", marginTop:2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Timer circle */}
              <div style={{
                background: timerDone
                  ? "radial-gradient(circle,rgba(34,197,94,0.15) 0%,rgba(6,13,31,0.95) 70%)"
                  : timerRunning
                    ? "radial-gradient(circle,rgba(251,208,56,0.1) 0%,rgba(6,13,31,0.95) 70%)"
                    : "radial-gradient(circle,rgba(14,36,80,0.8) 0%,rgba(6,13,31,0.95) 70%)",
                border:`2px solid ${timerDone?"#22C55E":timerRunning?"#FBD038":"rgba(251,208,56,0.2)"}`,
                borderRadius:"50%", width:200, height:200, margin:"0 auto 22px",
                display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                boxShadow: timerRunning ? "0 0 40px rgba(251,208,56,0.2)" : timerDone ? "0 0 40px rgba(34,197,94,0.2)" : "none",
                transition:"all 0.5s"
              }}>
                {timerDone ? (
                  <div>
                    <div style={{ fontSize:38 }}>🎉</div>
                    <div style={{ fontSize:14, color:"#22C55E", fontWeight:700 }}>Done!</div>
                    <div style={{ fontSize:11, color:"#94A3B8", marginTop:3 }}>+1 session logged</div>
                  </div>
                ) : (
                  <>
                    <div style={{
                      fontFamily:"'Courier New',monospace", fontSize:48, fontWeight:900,
                      color: timerRunning ? "#FBD038" : "#E2E8F0",
                      textShadow: timerRunning ? "0 0 28px rgba(251,208,56,0.6)" : "none",
                      letterSpacing:3
                    }}>{pad(timerMins)}:{pad(timerSecs)}</div>
                    <div style={{ fontSize:10, color:"#64748B", marginTop:4, letterSpacing:2 }}>
                      {timerRunning?"FOCUS MODE":"READY"}
                    </div>
                  </>
                )}
              </div>

              {/* Duration selector */}
              {!timerRunning && (
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontSize:11, color:"#64748B", marginBottom:8 }}>Session Duration</div>
                  <div style={{ display:"flex", gap:7, justifyContent:"center", flexWrap:"wrap" }}>
                    {[15,25,30,45,60,90].map(m=>(
                      <button key={m} onClick={()=>{ setCustomMins(m); setTimerMins(m); setTimerSecs(0); setTimerDone(false); }} style={{
                        padding:"7px 13px", borderRadius:8,
                        border:`1px solid ${customMins===m?"#FBD038":"rgba(255,255,255,0.1)"}`,
                        background: customMins===m?"rgba(251,208,56,0.15)":"rgba(255,255,255,0.04)",
                        color: customMins===m?"#FBD038":"#94A3B8", fontSize:12, cursor:"pointer", fontWeight:600
                      }}>{m}m</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div style={{ display:"flex", gap:10, justifyContent:"center" }}>
                <button onClick={resetTimer} style={{
                  padding:"11px 22px", borderRadius:10, border:"1px solid rgba(255,255,255,0.15)",
                  background:"rgba(255,255,255,0.06)", color:"#94A3B8", fontSize:13, cursor:"pointer", fontWeight:600
                }}>↺ Reset</button>
                <button onClick={()=>{ setTimerDone(false); setTimerRunning(r=>!r); }} style={{
                  padding:"11px 30px", borderRadius:10, border:"none",
                  background: timerRunning
                    ? "linear-gradient(135deg,#EF4444,#DC2626)"
                    : "linear-gradient(135deg,#FBD038,#F59E0B)",
                  color: timerRunning?"white":"#0A1628",
                  fontSize:14, cursor:"pointer", fontWeight:800,
                  boxShadow: timerRunning?"0 4px 18px rgba(239,68,68,0.4)":"0 4px 18px rgba(251,208,56,0.4)"
                }}>{timerRunning?"⏸ Pause":"▶ Start"}</button>
              </div>

              <div style={{
                marginTop:18, padding:"9px 13px", borderRadius:10,
                background:"rgba(251,208,56,0.05)", border:"1px solid rgba(251,208,56,0.15)",
                fontSize:11, color:"#94A3B8", lineHeight:1.6
              }}>
                💡 <b style={{ color:"#FBD038" }}>Pomodoro:</b> 25 min study → 5 min break. After 4 sessions → 20 min long break.
              </div>
            </div>
          )}

          {/* ══ PROGRESS TAB ═══════════════════════════════════════ */}
          {activeTab==="progress" && (
            <div>
              {/* Overall */}
              <div style={{
                background:"linear-gradient(135deg,rgba(13,43,110,0.6),rgba(10,31,80,0.4))",
                border:"1px solid rgba(251,208,56,0.2)", borderRadius:14, padding:"16px", marginBottom:12
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:12, color:"#94A3B8" }}>Overall Progress</div>
                    <div style={{ fontSize:28, fontWeight:900, color:"#FBD038", fontFamily:"monospace" }}>{pctDone}%</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:12, color:"#94A3B8" }}>Day</div>
                    <div style={{ fontSize:26, fontWeight:900, color:"#E2E8F0", fontFamily:"monospace" }}>
                      {daysElapsed}<span style={{ fontSize:13, color:"#475569" }}>/{TOTAL_DAYS}</span>
                    </div>
                  </div>
                </div>
                <ProgressBar value={daysElapsed} max={TOTAL_DAYS} height={11}/>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                  <span style={{ fontSize:10, color:"#475569" }}>25 May 2026</span>
                  <span style={{ fontSize:10, color:"#475569" }}>01 Aug 2027</span>
                </div>
              </div>

              {/* Current phase */}
              <div style={{
                background:`linear-gradient(135deg,${phase.color}22,rgba(6,13,31,0.8))`,
                border:`1px solid ${phase.color}44`, borderRadius:14, padding:"13px 15px", marginBottom:12
              }}>
                <div style={{ fontSize:11, color:"#94A3B8", marginBottom:5 }}>Current Phase</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:17, fontWeight:900, color:phase.color }}>{phase.label}</div>
                    <div style={{ fontSize:12, color:"#94A3B8" }}>{phase.desc}</div>
                  </div>
                  <div style={{
                    background:`${phase.color}22`, border:`1px solid ${phase.color}44`,
                    borderRadius:8, padding:"3px 9px", fontSize:11, color:phase.color, fontWeight:700
                  }}>Phase {phase.id}/4</div>
                </div>
                <div style={{ marginTop:10 }}>
                  <ProgressBar
                    value={Math.max(0, daysBetween(phase.start, viewDate))}
                    max={daysBetween(phase.start, phase.end)}
                    color={phase.color} height={7}
                  />
                  <div style={{ fontSize:10, color:"#475569", marginTop:3, textAlign:"right" }}>
                    {Math.max(0, daysBetween(viewDate, phase.end))} days remaining in this phase
                  </div>
                </div>
              </div>

              {/* All phases */}
              <div style={{ marginBottom:12 }}>
                <div style={{ fontSize:12, color:"#94A3B8", marginBottom:9, fontWeight:600 }}>All Phases</div>
                {PHASES.map(p=>{
                  const isActive = p.id===phase.id;
                  const isDone   = p.end < viewDate;
                  const phDays  = Math.max(0, daysBetween(p.start, viewDate));
                  const phTotal = daysBetween(p.start, p.end);
                  return (
                    <div key={p.id} style={{
                      background: isActive ? `${p.color}12` : "rgba(255,255,255,0.02)",
                      border:`1px solid ${isActive?p.color+"44":"rgba(255,255,255,0.07)"}`,
                      borderRadius:10, padding:"9px 12px", marginBottom:7
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <div style={{ display:"flex", gap:7, alignItems:"center" }}>
                          <span style={{ fontSize:12, fontWeight:700, color:isDone?"#22C55E":isActive?p.color:"#475569" }}>
                            {isDone?"✅":isActive?"▶":"○"} {p.label}
                          </span>
                          <span style={{ fontSize:11, color:"#475569" }}>{p.desc}</span>
                        </div>
                        <span style={{ fontSize:10, color:"#475569", fontFamily:"monospace" }}>
                          {p.start.toLocaleDateString("en-IN",{ day:"2-digit", month:"short" })}–{p.end.toLocaleDateString("en-IN",{ day:"2-digit", month:"short", year:"2-digit" })}
                        </span>
                      </div>
                      <ProgressBar value={Math.min(phDays,phTotal)} max={phTotal} color={p.color} height={5}/>
                    </div>
                  );
                })}
              </div>

              {/* Topic summary */}
              <div style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:14, padding:"13px 15px"
              }}>
                <div style={{ fontSize:12, color:"#94A3B8", marginBottom:10, fontWeight:600 }}>Topic Completion</div>
                <div style={{ textAlign:"center", marginBottom:12 }}>
                  <div style={{ fontSize:34, fontWeight:900, color:"#FBD038", fontFamily:"monospace" }}>{totalTopicsDone}/37</div>
                  <div style={{ fontSize:11, color:"#475569" }}>topics marked complete</div>
                </div>
                {Object.entries(subjectCounts).map(([subj,{done,total}])=>(
                  <div key={subj} style={{ marginBottom:10 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:SUBJ_COLOR[subj] }}>{subj}</span>
                      <span style={{ fontSize:11, color:"#94A3B8", fontFamily:"monospace" }}>{done}/{total}</span>
                    </div>
                    <ProgressBar value={done} max={total} color={SUBJ_COLOR[subj]} height={6}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ TOPICS TAB ═════════════════════════════════════════ */}
          {activeTab==="topics" && (
            <div>
              {Object.entries(ALL_TOPICS).map(([subj,topics])=>{
                const { done, total } = subjectCounts[subj];
                return (
                  <div key={subj} style={{ marginBottom:18 }}>
                    <div style={{
                      background:`${SUBJ_COLOR[subj]}15`, border:`1px solid ${SUBJ_COLOR[subj]}44`,
                      borderRadius:10, padding:"9px 13px", marginBottom:9
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                        <div style={{ fontSize:14, fontWeight:900, color:SUBJ_COLOR[subj] }}>
                          {{ Reasoning:"🧠", Quant:"📐", English:"📖" }[subj]} {subj}
                        </div>
                        <div style={{ fontSize:12, color:"#94A3B8", fontFamily:"monospace" }}>{done}/{total}</div>
                      </div>
                      <ProgressBar value={done} max={total} color={SUBJ_COLOR[subj]} height={5}/>
                    </div>
                    {topics.map(t=>(
                      <Checkbox
                        key={t.id}
                        checked={!!topicChecks[t.id]}
                        onChange={()=>setTopicChecks(c=>({...c,[t.id]:!c[t.id]}))}
                        label={t.name}
                        sub={t.sub}
                      />
                    ))}
                  </div>
                );
              })}
              <button onClick={()=>{ if(confirm("Reset all topic progress?")) setTopicChecks({}); }} style={{
                width:"100%", padding:"11px", borderRadius:10, marginTop:6, marginBottom:20,
                border:"1px solid rgba(239,68,68,0.3)", background:"rgba(239,68,68,0.08)",
                color:"#EF4444", fontSize:13, cursor:"pointer", fontWeight:600
              }}>Reset Topic Progress</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}