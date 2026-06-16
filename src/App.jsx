import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css"
import {
  FaCalendarAlt,
  FaMicroscope,
  FaUserFriends,
  FaChartLine,
  FaHeartbeat,
  FaBell,
  FaLock,
  FaBrain,
  FaFlask,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaHospitalUser,
  FaUserMd,
  FaBars,
  FaHome,
  FaRobot,
  FaPlus,
  FaEdit,
  FaSearch,
  FaArrowRight,
  FaArrowLeft,
  FaTicketAlt,
  FaSyncAlt,
  FaRegStar,
} from "react-icons/fa";

import {
  MdDashboard,
  MdBiotech,
  MdHealthAndSafety,
  MdMonitorHeart,
  MdAnalytics,
} from "react-icons/md";


// ===================== CORES & TOKENS =====================
const C = {
  primary: "#083B82",
  primaryLight: "#0A4FA8",
  secondary: "#1CB7C9",
  secondaryDark: "#179AAA",
  accent: "#7FC4D3",
  success: "#22C55E",
  successBg: "#F0FDF4",
  warning: "#F59E0B",
  warningBg: "#FFFBEB",
  danger: "#EF4444",
  dangerBg: "#FEF2F2",
  bg: "#F0F4F8",
  surface: "#FFFFFF",
  text: "#111827",
  textSec: "#6B7280",
  textHint: "#9CA3AF",
  border: "#E5EAF0",
  borderStrong: "#CBD5E1",
  gradient: "linear-gradient(135deg, #083B82 0%, #0A4FA8 40%, #1CB7C9 100%)",
};

// ===================== HOOK: MEDIA QUERY =====================
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

// ===================== MOCK DATA =====================
const USERS = {
  "admin@biolab.com": { password: "123456", role: "admin", name: "Dr. Rafael Mendes" },
  "paciente@biolab.com": { password: "123456", role: "patient", name: "Ana Paula Silva" },
};

const PATIENTS = [
  { id: 1, name: "Ana Paula Silva", cpf: "123.456.789-00", dob: "1985-03-12", phone: "(31) 99812-3456", email: "ana@email.com", plan: "BIOLAB 360 Premium", score: 82, risk: "baixo", lastExam: "2025-05-10" },
  { id: 2, name: "Carlos Eduardo Lima", cpf: "987.654.321-00", dob: "1972-07-24", phone: "(31) 98734-5678", email: "carlos@email.com", plan: "BIOLAB 360 Básico", score: 61, risk: "médio", lastExam: "2025-04-28" },
  { id: 3, name: "Mariana Costa", cpf: "456.789.123-00", dob: "1990-11-05", phone: "(31) 97645-6789", email: "mariana@email.com", plan: "BIOLAB 360 Premium", score: 91, risk: "baixo", lastExam: "2025-05-15" },
  { id: 4, name: "Roberto Alves", cpf: "321.654.987-00", dob: "1965-02-18", phone: "(31) 96556-7890", email: "roberto@email.com", plan: "Avulso", score: 44, risk: "alto", lastExam: "2025-03-20" },
  { id: 5, name: "Fernanda Rocha", cpf: "654.321.987-00", dob: "1995-08-30", phone: "(31) 95467-8901", email: "fernanda@email.com", plan: "BIOLAB 360 Básico", score: 75, risk: "baixo", lastExam: "2025-05-02" },
  { id: 6, name: "José Antônio Melo", cpf: "789.123.456-00", dob: "1958-12-03", phone: "(31) 94378-9012", email: "jose@email.com", plan: "Avulso", score: 38, risk: "alto", lastExam: "2025-02-14" },
  { id: 7, name: "Luciana Ferreira", cpf: "258.369.147-00", dob: "1982-06-17", phone: "(31) 93289-0123", email: "luciana@email.com", plan: "BIOLAB 360 Premium", score: 88, risk: "baixo", lastExam: "2025-05-18" },
  { id: 8, name: "Marcos Paulo Dias", cpf: "147.258.369-00", dob: "1978-04-22", phone: "(31) 92190-1234", email: "marcos@email.com", plan: "BIOLAB 360 Básico", score: 55, risk: "médio", lastExam: "2025-04-10" },
];

const EXAMS = [
  { id: 1, patient: "Ana Paula Silva", type: "Hematologia", name: "Hemograma Completo", date: "2025-05-10", status: "concluído", result: "normal", value: 120 },
  { id: 2, patient: "Carlos Eduardo Lima", type: "Bioquímica", name: "Glicemia em Jejum", date: "2025-05-12", status: "concluído", result: "atenção", value: 145 },
  { id: 3, patient: "Mariana Costa", type: "Imunologia", name: "TSH / T4 Livre", date: "2025-05-15", status: "concluído", result: "normal", value: 180 },
  { id: 4, patient: "Roberto Alves", type: "Bioquímica", name: "Colesterol Total + Frações", date: "2025-05-18", status: "pendente", result: "—", value: 220 },
  { id: 5, patient: "Fernanda Rocha", type: "Parasitologia", name: "Parasitológico de Fezes", date: "2025-05-20", status: "pendente", result: "—", value: 80 },
  { id: 6, patient: "José Antônio Melo", type: "Microbiologia", name: "Urocultura + Antibiograma", date: "2025-05-08", status: "concluído", result: "crítico", value: 195 },
  { id: 7, patient: "Luciana Ferreira", type: "Hematologia", name: "Coagulograma", date: "2025-05-19", status: "em análise", result: "—", value: 150 },
  { id: 8, patient: "Marcos Paulo Dias", type: "Imunologia", name: "HIV (ELISA)", date: "2025-05-06", status: "concluído", result: "normal", value: 130 },
  { id: 9, patient: "Ana Paula Silva", type: "Bioquímica", name: "Perfil Lipídico", date: "2025-04-22", status: "concluído", result: "atenção", value: 160 },
  { id: 10, patient: "Carlos Eduardo Lima", type: "Microbiologia", name: "Hemocultura", date: "2025-04-30", status: "concluído", result: "normal", value: 210 },
];

const APPOINTMENTS = [
  { id: 1, patient: "Ana Paula Silva", date: "2025-06-05", time: "08:00", type: "Checkup Anual", status: "confirmado" },
  { id: 2, patient: "Carlos Eduardo Lima", date: "2025-06-05", time: "09:30", type: "Coleta de Sangue", status: "confirmado" },
  { id: 3, patient: "Mariana Costa", date: "2025-06-06", time: "07:30", type: "Hemograma + Bioquímica", status: "pendente" },
  { id: 4, patient: "Roberto Alves", date: "2025-06-07", time: "10:00", type: "Painel Cardiovascular", status: "confirmado" },
  { id: 5, patient: "Fernanda Rocha", date: "2025-06-10", time: "08:30", type: "Checkup Preventivo", status: "pendente" },
  { id: 6, patient: "Luciana Ferreira", date: "2025-06-12", time: "11:00", type: "Hormônios Tireóideos", status: "confirmado" },
];

const PATIENT_EXAMS_HISTORY = [
  {
    id: 1, name: "Hemograma Completo", date: "Mai 2025", category: "Hematologia", status: "normal",
    items: [
      { name: "Hemoglobina", value: "14.2 g/dL", ref: "12–16 g/dL", status: "normal" },
      { name: "Hematócrito", value: "42%", ref: "36–46%", status: "normal" },
      { name: "Leucócitos", value: "7.200/mm³", ref: "4.000–10.000/mm³", status: "normal" },
      { name: "Plaquetas", value: "218.000/mm³", ref: "150.000–400.000/mm³", status: "normal" },
    ]
  },
  {
    id: 2, name: "Perfil Lipídico", date: "Abr 2025", category: "Bioquímica", status: "atenção",
    items: [
      { name: "Colesterol Total", value: "212 mg/dL", ref: "< 200 mg/dL", status: "atenção" },
      { name: "HDL", value: "58 mg/dL", ref: "> 50 mg/dL", status: "normal" },
      { name: "LDL", value: "138 mg/dL", ref: "< 130 mg/dL", status: "atenção" },
      { name: "Triglicerídeos", value: "145 mg/dL", ref: "< 150 mg/dL", status: "normal" },
    ]
  },
  {
    id: 3, name: "Glicemia em Jejum", date: "Mar 2025", category: "Bioquímica", status: "normal",
    items: [
      { name: "Glicose", value: "94 mg/dL", ref: "70–99 mg/dL", status: "normal" },
    ]
  },
];

const CHOLESTEROL_DATA = [
  { month: "Nov", total: 228, hdl: 52, ldl: 148 },
  { month: "Dez", total: 220, hdl: 54, ldl: 142 },
  { month: "Jan", total: 218, hdl: 55, ldl: 140 },
  { month: "Fev", total: 215, hdl: 57, ldl: 138 },
  { month: "Mar", total: 212, hdl: 58, ldl: 136 },
  { month: "Abr", total: 210, hdl: 60, ldl: 133 },
];

const GLUCOSE_DATA = [
  { month: "Nov", value: 102 }, { month: "Dez", value: 98 }, { month: "Jan", value: 96 },
  { month: "Fev", value: 95 }, { month: "Mar", value: 94 }, { month: "Abr", value: 92 },
];
const WEIGHT_DATA = [
  { month: "Nov", value: 72 }, { month: "Dez", value: 71.5 }, { month: "Jan", value: 70.8 },
  { month: "Fev", value: 70.2 }, { month: "Mar", value: 69.8 }, { month: "Abr", value: 69.2 },
];
const PRESSURE_DATA = [
  { month: "Nov", sys: 128, dia: 84 }, { month: "Dez", sys: 126, dia: 82 }, { month: "Jan", sys: 124, dia: 82 },
  { month: "Fev", sys: 122, dia: 80 }, { month: "Mar", sys: 120, dia: 80 }, { month: "Abr", sys: 118, dia: 78 },
];
const REVENUE_DATA = [
  { month: "Jan", value: 48200 }, { month: "Fev", value: 51400 }, { month: "Mar", value: 55800 },
  { month: "Abr", value: 58200 }, { month: "Mai", value: 63500 }, { month: "Jun", value: 71200 },
];

const AI_RESPONSES = {
  colesterol: "Seus níveis de colesterol merecem atenção. O LDL de 138 mg/dL está acima do ideal (< 130). Recomendo reduzir gorduras saturadas, aumentar fibras solúveis (aveia, leguminosas) e praticar 150 min/semana de aeróbicos. Vamos agendar revisão em 3 meses?",
  glicemia: "Sua glicemia em jejum de 94 mg/dL está dentro da faixa normal (70–99 mg/dL). A tendência de queda nos últimos meses é excelente! Continue com alimentação equilibrada e atividade física regular.",
  hemograma: "Hemograma de Maio/2025 perfeito — hemoglobina, hematócrito, leucócitos e plaquetas dentro dos valores de referência. Parabéns pelo cuidado com sua saúde! Próxima coleta recomendada em 6 meses.",
  pressão: "Pressão 118/78 mmHg — ideal! A redução gradual nos últimos 6 meses é notável. Mantenha hidratação, reduza sódio (< 2g/dia) e continue os exercícios. Monitoramento mensal é suficiente.",
  default: "Olá, Ana Paula! Sou a BIIA, sua assistente de saúde inteligente. Posso analisar seus exames de colesterol, glicemia, hemograma e pressão arterial. O que você gostaria de saber hoje?",
};

// ===================== HELPERS =====================
function Avatar({ name, size = 36, fontSize = 13 }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("");
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: C.gradient, display: "flex", alignItems: "center",
      justifyContent: "center", color: "#fff", fontWeight: 700,
      fontSize, flexShrink: 0, letterSpacing: 0.5,
    }}>{initials}</div>
  );
}

function Badge({ children, color, bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: bg || `${color}18`,
      borderRadius: 100, padding: "3px 10px",
      textTransform: "capitalize", letterSpacing: 0.2, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Card({ children, style = {}, hover = false }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: C.surface, borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: hov ? "0 8px 32px rgba(8,59,130,0.12)" : "0 2px 8px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: hov ? "translateY(-2px)" : "none",
        ...style,
      }}
    >{children}</div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: s = {} }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    border: "none", borderRadius: 10, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit", transition: "all 0.15s", opacity: disabled ? 0.6 : 1,
    whiteSpace: "nowrap",
  };
  const sizes = { sm: { padding: "7px 14px", fontSize: 12 }, md: { padding: "11px 20px", fontSize: 14 }, lg: { padding: "15px 28px", fontSize: 15 } };
  const variants = {
    primary: { background: hov ? C.primaryLight : C.gradient, color: "#fff", boxShadow: hov ? `0 6px 20px ${C.primary}40` : "0 2px 8px rgba(8,59,130,0.2)" },
    secondary: { background: hov ? `${C.secondary}20` : `${C.secondary}12`, color: C.secondary, border: `1px solid ${C.secondary}40` },
    ghost: { background: hov ? C.bg : "transparent", color: C.textSec, border: `1px solid ${C.border}` },
    danger: { background: hov ? "#DC2626" : C.danger, color: "#fff" },
  };
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...s }}>
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, type = "text", style: s = {} }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: "100%", padding: "11px 14px",
        border: `1.5px solid ${focus ? C.secondary : C.border}`,
        borderRadius: 10, fontSize: 14, outline: "none",
        boxSizing: "border-box", fontFamily: "inherit",
        background: C.surface, color: C.text,
        transition: "border-color 0.15s",
        ...s,
      }}
    />
  );
}

// ===================== GRÁFICOS SVG =====================
function LineChart({ data, dataKey, color, height = 70 }) {
  const w = 300, h = height, pad = 6;
  const vals = data.map(d => d[dataKey]);
  const mx = Math.max(...vals) * 1.08;
  const mn = Math.min(...vals) * 0.92;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d[dataKey] - mn) / (mx - mn)) * (h - pad * 2);
    return { x, y };
  });
  const pathD = pts.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(" ");
  const areaD = `${pathD} L ${pts[pts.length - 1].x},${h} L ${pts[0].x},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`grad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke={C.surface} strokeWidth="2" />
      ))}
    </svg>
  );
}

function BarChart({ data, dataKey, color, height = 110 }) {
  const w = 360, h = height, pad = 8;
  const vals = data.map(d => d[dataKey]);
  const mx = Math.max(...vals) * 1.1;
  const barW = Math.max(((w - pad * 2) / data.length) - 6, 8);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id={`bgrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x = pad + i * ((w - pad * 2) / data.length) + 3;
        const bh = (d[dataKey] / mx) * (h - pad * 2 - 22);
        const y = h - pad - 22 - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx="4" fill={`url(#bgrad-${color.replace("#", "")})`} />
            <text x={x + barW / 2} y={h - 5} textAnchor="middle" fontSize="10" fill={C.textSec} fontFamily="inherit">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

function ScoreMeter({ score }) {
  const r = 56, cx = 72, cy = 72;
  const circ = 2 * Math.PI * r;
  const arc = (score / 100) * circ * 0.75;
  const color = score >= 75 ? C.success : score >= 50 ? C.warning : C.danger;
  const label = score >= 75 ? "Ótimo" : score >= 50 ? "Regular" : "Atenção";
  return (
    <svg viewBox="0 0 144 128" style={{ width: 140, height: 128 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="10"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        strokeDashoffset={circ * 0.125} strokeLinecap="round"
        style={{ transform: "rotate(-225deg)", transformOrigin: `${cx}px ${cy}px` }} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${arc} ${circ - arc}`}
        strokeDashoffset={circ * 0.125} strokeLinecap="round"
        style={{ transform: "rotate(-225deg)", transformOrigin: `${cx}px ${cy}px` }} />
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="28" fontWeight="800" fill={color} fontFamily="inherit">{score}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="11" fill={C.textSec} fontFamily="inherit">Score de Saúde</text>
      <text x={cx} y={cy + 26} textAnchor="middle" fontSize="12" fontWeight="700" fill={color} fontFamily="inherit">{label}</text>
    </svg>
  );
}

// ===================== LOGO =====================
function BiolabLogo({ height = 44, light = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <img src="/biolab-logo.png" alt="BIOLAB" style={{ height, maxWidth: 200, objectFit: "contain" }}
        onError={e => { e.currentTarget.style.display = "none"; }} />
      {light && (
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: 0.5 }}>BIOLAB</span>
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 500, letterSpacing: 1 }}>SAÚDE 360°</span>
        </div>
      )}
    </div>
  );
}

// ===================== LANDING PAGE =====================
function LandingPage({ onLogin }) {
  const [faq, setFaq] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const faqs = [
    {
      q: "Como funciona o BIOLAB 360?",
      a: "O BIOLAB 360 acompanha toda a jornada do paciente. Após a realização dos exames, os resultados ficam armazenados na plataforma, permitindo acompanhar a evolução da saúde ao longo do tempo através de gráficos, históricos e indicadores preventivos."
    },

    {
      q: "Em quanto tempo os resultados ficam disponíveis?",
      a: "Os exames realizados pelos setores integrados da BIOLAB possuem prazo de entrega de até 24 horas, permitindo acesso rápido às informações necessárias para o acompanhamento da saúde."
    },

    {
      q: "Quais áreas laboratoriais fazem parte da BIOLAB?",
      a: "Atualmente a BIOLAB integra os setores de Hematologia, Imunologia, Bioquímica, Microbiologia e Parasitologia, oferecendo exames essenciais para monitoramento e prevenção."
    },

    {
      q: "Como a plataforma identifica riscos à saúde?",
      a: "O BIOLAB 360 compara resultados anteriores e atuais, identificando alterações relevantes e gerando alertas preventivos que auxiliam no acompanhamento contínuo do paciente."
    },

    {
      q: "Os resultados ficam armazenados?",
      a: "Sim. Todos os exames ficam disponíveis no histórico do paciente, permitindo consultas futuras, comparações e acompanhamento da evolução dos indicadores de saúde."
    },

    {
      q: "A plataforma envia lembretes para novos exames?",
      a: "Sim. O BIOLAB 360 notifica o paciente sobre check-ups periódicos e exames recomendados, incentivando uma abordagem preventiva da saúde."
    },

    {
      q: "Os resultados são fáceis de entender?",
      a: "Sim. Além do laudo tradicional, a plataforma apresenta relatórios simplificados, gráficos comparativos e indicadores visuais que facilitam a interpretação dos resultados."
    },

    {
      q: "Por que escolher a BIOLAB?",
      a: "A BIOLAB une diagnóstico rápido, tecnologia e medicina preventiva em uma única plataforma, permitindo que pacientes acompanhem sua saúde de forma simples, contínua e inteligente."
    }
  ];

  const statsHero = [
    ["12.4k", "Pacientes"], ["98%", "Satisfação"], ["24h", "Resultado"], ["360°", "Monitoramento"],
  ];

  const problems = [
    { icon: <FaHospitalUser />, t: "Sem acompanhamento", d: "Apenas 23% dos brasileiros fazem checkup preventivo anual" },
    { icon: <FaClock />, t: "Resultados demorados", d: "Laboratórios tradicionais levam até 5 dias para liberar laudos" },
    { icon: <MdAnalytics />, t: "Laudos incompreensíveis", d: "Resultados técnicos sem contexto claro ou visual" },
    { icon: <FaExclamationTriangle />, t: "Prevenção negligenciada", d: "Doenças crônicas custam R$ 75bi/ano ao sistema" },
    { icon: <FaSyncAlt />, t: "Fragmentação de dados", d: "Histórico de saúde espalhado em diferentes clínicas" },
  ];

  const diferenciais = [
    { icon: <FaMicroscope />, t: "Resultado em 24h", d: "Automação que acelera sem perder qualidade" },
    { icon: <FaBrain />, t: "IA Preventiva", d: "Identifica tendências de risco antes dos sintomas" },
    { icon: <FaChartLine />, t: "Dashboard 360°", d: "Histórico visual completo em um só lugar" },
    { icon: <FaUserMd />, t: "Equipe Especializada", d: "Biomédicos revisam cada resultado" },
    { icon: <FaLock />, t: "Dados Protegidos", d: "LGPD compliant, criptografia end-to-end" },
    { icon: <FaBell />, t: "Alertas Preventivos", d: "Notificações automáticas e inteligentes" },
  ];

  const testimonials = [
    { name: "Dra. Cláudia Bittencourt", role: "Endocrinologista", text: "O BIOLAB 360 transformou o acompanhamento dos meus pacientes. As tendências gráficas mostram o que números isolados não conseguem comunicar.", stars: 5 },
    { name: "Thiago Nascimento", role: "Empresário, 48 anos", text: "Descobri pré-diabetes no monitoramento preventivo — antes de qualquer sintoma. A plataforma provavelmente me salvou de um diagnóstico tardio.", stars: 5 },
    { name: "Cristina Almeida", role: "Professora, 35 anos", text: "Nunca pensei que cuidar da saúde seria tão simples. Recebo tudo no celular com interpretação inteligente. Incrível!", stars: 5 },
  ];

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: C.text, background: C.surface, overflowX: "hidden" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.5} }
        @keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none} }
        .landing-section { animation: fadeIn 0.6s ease both; }
        .nav-link:hover { color: ${C.secondary} !important; }
        .faq-btn:hover { background: ${C.bg} !important; }
        @media (max-width:768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-preview { display:none !important; }
          .problems-grid { grid-template-columns: 1fr 1fr !important; }
          .solution-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .diff-grid { grid-template-columns: 1fr 1fr !important; }
          .test-grid { grid-template-columns: 1fr !important; }
          .cta-btns { flex-direction: column !important; align-items:stretch !important; }
          .stats-row { gap:16px !important; }
          .hero-title { font-size:36px !important; }
          .section-title { font-size:28px !important; }
          .nav-links { display:none !important; }
          .nav-cta { padding:8px 16px !important; font-size:13px !important; }
        }
        @media (max-width:480px) {
          .problems-grid { grid-template-columns: 1fr !important; }
          .solution-grid { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .diff-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrollY > 20 ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrollY > 20 ? `1px solid ${C.border}` : "1px solid transparent",
        transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "0 20px" : "0 48px", height: 68,
      }}>
        <BiolabLogo height={42} />
        <div className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["Serviços", "Planos", "BIOLAB 360", "Contato"].map(item => (
            <a key={item} href="#" className="nav-link" style={{ color: C.textSec, textDecoration: "none", fontSize: 14, fontWeight: 500, transition: "color .15s" }}>{item}</a>
          ))}
        </div>
        <button onClick={onLogin} className="nav-cta" style={{
          background: C.gradient, color: "#fff", border: "none",
          borderRadius: 10, padding: "10px 22px", fontWeight: 700, fontSize: 14, cursor: "pointer",
          boxShadow: `0 4px 16px ${C.primary}30`,
        }}>Entrar</button>
      </nav>

      {/* HERO */}
      <section style={{ background: C.gradient, minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 68 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "60px 24px" : "80px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="hero-grid">
          <div className="landing-section">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 100, padding: "6px 16px", marginBottom: 24, backdropFilter: "blur(10px)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }}></div>
              <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500 }}>Plataforma ativa · +12.400 pacientes</span>
            </div>
            <h1 className="hero-title" style={{ fontSize: 52, fontWeight: 900, color: "#fff", lineHeight: 1.08, margin: "0 0 20px", letterSpacing: -1 }}>
              Diagnóstico Rápido.<br />
              <span style={{ color: "#7FDFED" }}>Prevenção Inteligente.</span>
            </h1>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.82)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 480 }}>
              O primeiro laboratório diagnóstico com plataforma 360° de saúde preventiva. Seus exames, seus dados e sua evolução — tudo em um só lugar.
            </p>
            <div className="cta-btns" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button style={{
                background: "#fff", color: C.primary, border: "none", borderRadius: 12,
                padding: "15px 28px", fontWeight: 800, fontSize: 15, cursor: "pointer",
                boxShadow: "0 8px 28px rgba(0,0,0,0.18)", transition: "transform 0.15s",
              }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                <FaCalendarAlt />
                Agendar Exame
              </button>
              <button onClick={onLogin} style={{
                background: "rgba(255,255,255,0.10)", color: "#fff",
                border: "2px solid rgba(255,255,255,0.3)", borderRadius: 12,
                padding: "15px 28px", fontWeight: 600, fontSize: 15, cursor: "pointer",
                backdropFilter: "blur(10px)", transition: "background 0.15s",
              }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}>
                Conhecer o BIOLAB 360
              </button>
            </div>
            <div className="stats-row" style={{ display: "flex", gap: 36, marginTop: 52, flexWrap: "wrap" }}>
              {statsHero.map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "#fff", letterSpacing: -0.5 }}>{v}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2, fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Preview Card */}
          <div className="hero-preview" style={{ animation: "float 4s ease-in-out infinite" }}>
            <div style={{
              background: "rgba(255,255,255,0.07)", backdropFilter: "blur(24px)",
              borderRadius: 24, border: "1px solid rgba(255,255,255,0.15)",
              padding: 28, boxShadow: "0 40px 80px rgba(0,0,0,0.3)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginLeft: 8 }}>BIOLAB 360 · Dashboard</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                  { l: "Score de Saúde", v: "82", u: "/100", c: "#4ade80" },
                  { l: "Próximo Checkup", v: "12", u: "dias", c: "#60a5fa" },
                  { l: "Exames este ano", v: "8", u: "realizados", c: C.secondary },
                  { l: "Alertas Ativos", v: "1", u: "atenção", c: "#fbbf24" },
                ].map(m => (
                  <div key={m.l} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 6, fontWeight: 500 }}>{m.l}</div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: m.c, letterSpacing: -1 }}>
                      {m.v}<span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginLeft: 4, fontWeight: 400 }}>{m.u}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginBottom: 10, fontWeight: 500 }}>Colesterol Total (mg/dL)</div>
                <div style={{ display: "flex", gap: 5, alignItems: "flex-end", height: 44 }}>
                  {[228, 220, 218, 215, 212, 210].map((v, i) => (
                    <div key={i} style={{ flex: 1, background: `rgba(28,183,201,${0.35 + i * 0.12})`, borderRadius: "3px 3px 0 0", height: `${Math.round((v - 200) / 40 * 100)}%`, minHeight: 4, transition: "height 0.3s" }} />
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  {["N", "D", "J", "F", "M", "A"].map(m => <span key={m} style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>{m}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section style={{ background: C.bg, padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Badge color={C.danger} bg={`${C.danger}12`}>O PROBLEMA</Badge>
            <h2 className="section-title" style={{ fontSize: 38, fontWeight: 900, color: C.text, margin: "16px 0 12px", letterSpacing: -0.5 }}>A saúde brasileira ainda é <span style={{ color: C.danger }}>reativa</span></h2>
            <p style={{ color: C.textSec, fontSize: 16 }}>Só vamos ao médico quando já estamos doentes. Isso custa caro — e custa vidas.</p>
          </div>
          <div className="problems-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
            {problems.map(p => (
              <Card key={p.t} hover style={{ padding: 24, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{p.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "0 0 8px", lineHeight: 1.3 }}>{p.t}</h3>
                <p style={{ fontSize: 13, color: C.textSec, margin: 0, lineHeight: 1.5 }}>{p.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section style={{ background: C.surface, padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Badge color={C.secondary} bg={`${C.secondary}12`}>A SOLUÇÃO</Badge>
            <h2 className="section-title" style={{ fontSize: 38, fontWeight: 900, margin: "16px 0 0", letterSpacing: -0.5 }}>BIOLAB 360 — <span style={{ color: C.secondary }}>saúde completa</span></h2>
          </div>
          <div className="solution-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {[
              { icon: <FaFlask />, t: "Coleta Laboratorial", d: "Mais de 800 tipos de exames com equipamentos Roche de última geração", color: C.primary },
              { icon: <MdBiotech />, t: "Resultado em 24h", d: "Pipeline automatizado com liberação digital em tempo real", color: C.secondary },
              { icon: <MdDashboard />, t: "Plataforma BIOLAB 360", d: "Dashboard completo com histórico, gráficos e interpretação por IA", color: "#7C3AED" },
              { icon: <MdHealthAndSafety />, t: "Monitoramento Preventivo", d: "Alertas inteligentes baseados em tendências antes de virar problema", color: C.success },
            ].map(s => (
              <div key={s.t} style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ background: s.color, padding: "22px 24px 18px", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{s.icon}</span>
                  <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>{s.t}</h3>
                </div>
                <div style={{ background: C.surface, padding: "18px 24px", border: `1px solid ${C.border}`, borderTop: "none", borderRadius: "0 0 16px 16px" }}>
                  <p style={{ color: C.textSec, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ background: C.bg, padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 880, margin: "0 auto", textAlign: "center" }}>
          <Badge color={C.primary} bg={`${C.primary}10`}>COMO FUNCIONA</Badge>
          <h2 className="section-title" style={{ fontSize: 38, fontWeight: 900, margin: "16px 0 48px", letterSpacing: -0.5 }}>
            De zero ao monitoramento<br />em <span style={{ color: C.secondary }}>4 passos simples</span>
          </h2>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { n: "1", icon: <MdAnalytics />, t: "Agende", d: "Escolha a data pelo app ou telefone" },
              { n: "2", icon: <FaFlask />, t: "Coleta", d: "Compareça ao laboratório — rápido e indolor" },
              { n: "3", icon: <FaMicroscope />, t: "Análise", d: "Nossa equipe processa com automação avançada" },
              { n: "4", icon: <MdMonitorHeart />, t: "Resultado", d: "Receba no app em até 24h com interpretação" },
            ].map((s, i) => (
              <div key={s.t}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%", background: C.gradient,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, margin: "0 auto 16px",
                  boxShadow: `0 8px 24px ${C.primary}35`,
                }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.secondary, marginBottom: 6, letterSpacing: 1 }}>PASSO {s.n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px" }}>{s.t}</h3>
                <p style={{ fontSize: 13, color: C.textSec, lineHeight: 1.6, margin: 0 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section style={{ background: C.surface, padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <Badge color={C.secondary} bg={`${C.secondary}12`}>DIFERENCIAIS</Badge>
            <h2 className="section-title" style={{ fontSize: 38, fontWeight: 900, margin: "16px 0 0", letterSpacing: -0.5 }}>Por que o <span style={{ color: C.primary }}>BIOLAB 360?</span></h2>
          </div>
          <div className="diff-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {diferenciais.map(d => (
              <Card key={d.t} hover style={{ display: "flex", gap: 16, padding: 24 }}>
                <div style={{ fontSize: 28, flexShrink: 0 }}>{d.icon}</div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px" }}>{d.t}</h3>
                  <p style={{ fontSize: 13, color: C.textSec, margin: 0, lineHeight: 1.5 }}>{d.d}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ background: C.gradient, padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 className="section-title" style={{ fontSize: 38, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: -0.5 }}>
              Quem usa, <span style={{ color: "#7FDFED" }}>comprova</span>
            </h2>
          </div>
          <div className="test-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{
                background: "rgba(255,255,255,0.09)", backdropFilter: "blur(12px)",
                borderRadius: 18, padding: 28, border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <div style={{ color: "#FFD700", fontSize: 16, marginBottom: 14, display: "flex", gap: 3 }}>{Array.from({ length: t.stars }).map((_, i) => <FaRegStar key={i} />)}</div>
                <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 15, lineHeight: 1.7, margin: "0 0 18px", fontStyle: "italic" }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>{t.name}</div>
                  <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: C.bg, padding: isMobile ? "60px 24px" : "80px 48px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 className="section-title" style={{ fontSize: 38, fontWeight: 900, margin: 0, letterSpacing: -0.5 }}>
              Dúvidas <span style={{ color: C.secondary }}>frequentes</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((f, i) => (
              <Card key={i} style={{ overflow: "hidden" }}>
                <button className="faq-btn" onClick={() => setFaq(faq === i ? null : i)}
                  style={{
                    width: "100%", textAlign: "left", padding: "18px 22px",
                    background: faq === i ? `${C.secondary}08` : "none",
                    border: "none", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontWeight: 600, fontSize: 15, color: C.text, fontFamily: "inherit",
                    transition: "background 0.15s",
                  }}>
                  {f.q}
                  <span style={{ color: C.secondary, fontSize: 22, fontWeight: 300, transform: faq === i ? "rotate(45deg)" : "none", transition: "transform .2s", flexShrink: 0, marginLeft: 12 }}>+</span>
                </button>
                {faq === i && (
                  <div style={{ padding: "0 22px 18px", color: C.textSec, fontSize: 14, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 0 }}>
                    {f.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ background: C.surface, padding: isMobile ? "60px 24px" : "80px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          <h2 className="section-title" style={{ fontSize: 42, fontWeight: 900, margin: "0 0 14px", letterSpacing: -1 }}>
            Comece a cuidar da <span style={{ color: C.secondary }}>sua saúde hoje</span>
          </h2>
          <p style={{ color: C.textSec, fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
            Junte-se a mais de 12.000 pacientes que já monitoram sua saúde de forma inteligente com o BIOLAB 360.
          </p>
          <div className="cta-btns" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn size="lg"><FaCalendarAlt /> Agendar Exame Gratuito</Btn>
            <Btn size="lg" variant="ghost" onClick={onLogin}>Acessar Plataforma</Btn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.primary, padding: "36px 48px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <BiolabLogo height={38} light />
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
          © 2025 BIOLAB 360. Todos os direitos reservados. | Belo Horizonte, MG | (31) 3000-0360
        </p>
      </footer>
    </div>
  );
}

// ===================== LOGIN =====================
function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("admin@biolab.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      const user = USERS[email];
      if (user && user.password === password) onLogin({ email, ...user });
      else { setError("Email ou senha incorretos."); setLoading(false); }
    }, 700);
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.gradient,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', system-ui, sans-serif",
      padding: "24px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: isMobile ? "36px 28px" : "48px",
        width: "100%", maxWidth: 420, boxShadow: "0 40px 80px rgba(0,0,0,0.28)",
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <BiolabLogo height={56} />
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: "0 0 4px" }}>Bem-vindo de volta</h2>
          <p style={{ color: C.textSec, fontSize: 14, margin: 0 }}>Acesse sua conta BIOLAB 360</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Email</label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@biolab.com" type="email" />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Senha</label>
            <Input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••" />
          </div>
          {error && (
            <div style={{ background: C.dangerBg, color: C.danger, borderRadius: 10, padding: "11px 14px", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
              <FaExclamationTriangle /> {error}
            </div>
          )}
          <Btn onClick={handle} disabled={loading} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
            {loading ? "Entrando..." : <><span>Entrar</span><FaArrowRight /></>}
          </Btn>
        </div>
        <div style={{ marginTop: 24, padding: "16px", background: C.bg, borderRadius: 12, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: C.textSec, marginBottom: 8 }}>Credenciais de demonstração:</div>
          <div style={{ color: C.text, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><FaUserMd /> Admin: admin@biolab.com / 123456</div>
          <div style={{ color: C.text, display: "flex", alignItems: "center", gap: 6 }}><FaUserFriends /> Paciente: paciente@biolab.com / 123456</div>
        </div>
        <button onClick={onBack} style={{
          marginTop: 16, width: "100%", background: "none", border: "none",
          color: C.textSec, fontSize: 13, cursor: "pointer", textDecoration: "underline", fontFamily: "inherit",
        }}><FaArrowLeft /> Voltar para o site</button>
      </div>
    </div>
  );
}

// ===================== SIDEBAR =====================
function Sidebar({ menu, active, setActive, user, onLogout, open, setOpen }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sidebar = (
    <div style={{
      width: 240, background: C.primary, display: "flex", flexDirection: "column",
      minHeight: "100vh", flexShrink: 0,
      position: isMobile ? "fixed" : "relative",
      left: isMobile ? (open ? 0 : -280) : 0,
      top: 0, zIndex: isMobile ? 300 : 1,
      transition: isMobile ? "left 0.25s ease" : "none",
    }}>
      <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <BiolabLogo height={40} light />
      </div>
      <nav style={{ flex: 1, padding: "14px 10px", overflowY: "auto" }}>
        {menu.map(item => (
          <button key={item.id} onClick={() => { setActive(item.id); if (isMobile) setOpen(false); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12,
              padding: "11px 14px", marginBottom: 2,
              background: active === item.id ? "rgba(255,255,255,0.13)" : "transparent",
              borderRadius: 10, border: "none",
              color: active === item.id ? "#fff" : "rgba(255,255,255,0.55)",
              cursor: "pointer", fontSize: 14,
              fontWeight: active === item.id ? 600 : 400,
              transition: "all .15s", fontFamily: "inherit",
              borderLeft: active === item.id ? `3px solid ${C.secondary}` : "3px solid transparent",
            }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar name={user.name} size={36} fontSize={12} />
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name.split(" ")[0]}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{user.role === "admin" ? "Administrador" : "Paciente"}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{
          width: "100%", background: "rgba(255,255,255,0.08)", border: "none",
          color: "rgba(255,255,255,0.55)", borderRadius: 8, padding: "9px",
          fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          transition: "background 0.15s",
        }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile && open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 299 }} />
      )}
      {sidebar}
    </>
  );
}

// ===================== TOPBAR MOBILE =====================
function Topbar({ title, onMenu }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  if (!isMobile) return null;
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      padding: "14px 20px", display: "flex", alignItems: "center", gap: 14,
    }}>
      <button onClick={onMenu} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, padding: 0, color: C.primary }}><FaBars /></button>
      <BiolabLogo height={34} />
    </div>
  );
}

// ===================== ADMIN DASHBOARD =====================
function AdminDashboard() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const stats = [
    { label: "Pacientes", value: "1.284", icon: <FaUserFriends />, change: "+12%", color: C.primary },
    { label: "Exames Realizados", value: "8.432", icon: <FaMicroscope />, change: "+8%", color: C.secondary },
    { label: "Exames Pendentes", value: "47", icon: <FaClock />, change: "-3%", color: C.warning },
    { label: "Exames Concluídos", value: "8.385", icon: <FaCheckCircle />, change: "+9%", color: C.success },
    { label: "Receita Mensal", value: "R$ 71.2k", icon: <FaMoneyBillWave />, change: "+14%", color: "#7C3AED" },
    { label: "Assinaturas 360", value: "342", icon: <FaHeartbeat />, change: "+21%", color: C.secondary },
  ];

  const alerts = [
    { patient: "Roberto Alves", msg: "Colesterol crítico — aguardando consulta", level: "alto" },
    { patient: "José Antônio Melo", msg: "Urocultura positiva — tratamento iniciado", level: "alto" },
    { patient: "Carlos Eduardo Lima", msg: "Glicemia elevada — acompanhamento recomendado", level: "médio" },
    { patient: "Marcos Paulo Dias", msg: "Hemoglobina levemente abaixo do ideal", level: "médio" },
  ];
  const levelColor = { alto: C.danger, médio: C.warning, baixo: C.success };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: -0.5 }}>Dashboard</h1>
        <p style={{ color: C.textSec, fontSize: 14, margin: 0 }}>Visão geral — Junho 2025</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 14, marginBottom: 22 }}>
        {stats.map(s => (
          <Card key={s.label} hover style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: `${s.color}12`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 20, flexShrink: 0,
            }}>{s.icon}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: C.textSec, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
              <div style={{ fontSize: 11, color: s.change.startsWith("+") ? C.success : C.danger, fontWeight: 700, marginTop: 2 }}>{s.change} mês</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: C.text, display: "flex", alignItems: "center", gap: 8 }}><FaChartLine color={C.secondary} /> Receita Mensal</h3>
          <p style={{ fontSize: 12, color: C.textSec, margin: "0 0 14px" }}>Jan – Jun 2025</p>
          <BarChart data={REVENUE_DATA} dataKey="value" color={C.secondary} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {REVENUE_DATA.map(d => <span key={d.month} style={{ fontSize: 11, color: C.textSec, textAlign: "center" }}>{d.month}</span>)}
          </div>
        </Card>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 18px", color: C.text, display: "flex", alignItems: "center", gap: 8 }}><FaBell color={C.warning} /> Alertas Preventivos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {alerts.map((a, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 14px", borderRadius: 12,
                background: `${levelColor[a.level]}0C`,
                border: `1px solid ${levelColor[a.level]}25`,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: levelColor[a.level], marginTop: 5, flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{a.patient}</div>
                  <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>{a.msg}</div>
                </div>
                <Badge color={levelColor[a.level]}>{a.level}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===================== PATIENTS MODULE =====================
function PatientsModule() {
  const [patients, setPatients] = useState(PATIENTS);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", cpf: "", dob: "", phone: "", email: "", plan: "Avulso", score: 70, risk: "baixo", lastExam: "2025-05-01" });
  const isMobile = useMediaQuery("(max-width: 768px)");

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.email.includes(search)
  );
  const riskColor = { baixo: C.success, médio: C.warning, alto: C.danger };

  const openAdd = () => { setForm({ name: "", cpf: "", dob: "", phone: "", email: "", plan: "Avulso", score: 70, risk: "baixo", lastExam: "2025-05-01" }); setModal("add"); };
  const openEdit = (p) => { setForm(p); setModal("edit"); };
  const save = () => {
    if (modal === "add") setPatients([...patients, { ...form, id: Date.now() }]);
    else setPatients(patients.map(p => p.id === form.id ? form : p));
    setModal(null);
  };
  const del = (id) => { if (window.confirm("Remover paciente?")) setPatients(patients.filter(p => p.id !== id)); };

  return (
    <div>
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <Card style={{ padding: 32, width: "100%", maxWidth: 500 }}>
            <h3 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>{modal === "add" ? <><FaPlus /> Novo Paciente</> : <><FaEdit /> Editar Paciente</>}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[["name", "Nome completo"], ["cpf", "CPF"], ["dob", "Nascimento"], ["phone", "Telefone"], ["email", "Email"], ["plan", "Plano"]].map(([k, l]) => (
                <div key={k} style={{ gridColumn: (k === "name" || k === "email") ? "1 / -1" : "auto" }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: C.textSec, display: "block", marginBottom: 5 }}>{l}</label>
                  {k === "plan" ? (
                    <select value={form[k]} onChange={e => setForm({ ...form, [k]: e.target.value })}
                      style={{ width: "100%", padding: "11px 13px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: C.surface }}>
                      {["Avulso", "BIOLAB 360 Básico", "BIOLAB 360 Premium"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <Input value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} type={k === "dob" ? "date" : "text"} />
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <Btn onClick={save} style={{ flex: 1, justifyContent: "center" }}>Salvar</Btn>
              <Btn variant="ghost" onClick={() => setModal(null)}>Cancelar</Btn>
            </div>
          </Card>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 10 }}><FaUserFriends color={C.primary} /> Pacientes</h1>
        <Btn onClick={openAdd}>+ Novo Paciente</Btn>
      </div>

      <Card>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}` }}>
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou email..." />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Paciente", "CPF", "Plano", "Score", "Risco", "Ações"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textSec, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderTop: `1px solid ${C.border}`, transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.bg}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar name={p.name} size={34} fontSize={11} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.textSec }}>{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: C.textSec, whiteSpace: "nowrap" }}>{p.cpf}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <Badge color={p.plan.includes("360") ? C.secondary : C.textSec}>{p.plan}</Badge>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: p.score >= 75 ? C.success : p.score >= 50 ? C.warning : C.danger }}>{p.score}</span>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <Badge color={riskColor[p.risk]}>{p.risk}</Badge>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn size="sm" variant="secondary" onClick={() => openEdit(p)}>Editar</Btn>
                      <Btn size="sm" variant="danger" onClick={() => del(p.id)}>Excluir</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: "11px 18px", borderTop: `1px solid ${C.border}`, fontSize: 12, color: C.textSec, fontWeight: 500 }}>
          {filtered.length} paciente(s) encontrado(s)
        </div>
      </Card>
    </div>
  );
}

// ===================== EXAMS MODULE =====================
function ExamsModule() {
  const [filter, setFilter] = useState("todos");
  const categories = ["todos", "Hematologia", "Bioquímica", "Imunologia", "Microbiologia", "Parasitologia"];
  const statusColor = { "concluído": C.success, "pendente": C.warning, "em análise": C.secondary };
  const resultColor = { normal: C.success, atenção: C.warning, crítico: C.danger, "—": C.textSec };
  const filtered = filter === "todos" ? EXAMS : EXAMS.filter(e => e.type === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12, flexWrap: "wrap" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 10 }}><FaMicroscope color={C.primary} /> Exames</h1>
        <Btn>+ Novo Exame</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            style={{
              padding: "8px 16px", borderRadius: 100,
              border: `1.5px solid ${filter === c ? C.secondary : C.border}`,
              background: filter === c ? C.secondary : C.surface,
              color: filter === c ? "#fff" : C.textSec,
              fontSize: 13, fontWeight: filter === c ? 600 : 400,
              cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
            }}>{c}</button>
        ))}
      </div>
      <Card>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
            <thead>
              <tr style={{ background: C.bg }}>
                {["Paciente", "Categoria", "Exame", "Data", "Status", "Resultado", "Valor"].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textSec, whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} style={{ borderTop: `1px solid ${C.border}` }}
                  onMouseEnter={ev => ev.currentTarget.style.background = C.bg}
                  onMouseLeave={ev => ev.currentTarget.style.background = ""}>
                  <td style={{ padding: "13px 16px", fontWeight: 600, fontSize: 13, whiteSpace: "nowrap" }}>{e.patient}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <Badge color={C.primary}>{e.type}</Badge>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13 }}>{e.name}</td>
                  <td style={{ padding: "13px 16px", fontSize: 12, color: C.textSec, whiteSpace: "nowrap" }}>{e.date}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <Badge color={statusColor[e.status]}>{e.status}</Badge>
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: resultColor[e.result] }}>{e.result}</span>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: C.text }}>R$ {e.value},00</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ===================== APPOINTMENTS MODULE =====================
function AppointmentsModule() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const statusColor = { confirmado: C.success, pendente: C.warning };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22, gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 10 }}><FaCalendarAlt color={C.primary} /> Agendamentos</h1>
        <Btn>+ Novo</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 18px", display: "flex", alignItems: "center", gap: 8 }}><FaCalendarAlt color={C.secondary} /> Junho 2025</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 8 }}>
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: C.textSec, padding: "4px 0" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3 }}>
            {[...Array(6)].map((_, i) => <div key={`e${i}`} />)}
            {[...Array(30)].map((_, i) => {
              const day = i + 1;
              const hasApp = APPOINTMENTS.some(a => parseInt(a.date.split("-")[2]) === day);
              return (
                <div key={day} style={{
                  textAlign: "center", padding: "7px 3px", borderRadius: 8, fontSize: 13,
                  background: hasApp ? C.gradient : "transparent",
                  color: hasApp ? "#fff" : C.text,
                  fontWeight: hasApp ? 700 : 400, cursor: hasApp ? "pointer" : "default",
                  transition: "transform 0.1s",
                }}
                  onMouseEnter={e => hasApp && (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={e => hasApp && (e.currentTarget.style.transform = "none")}
                >{day}</div>
              );
            })}
          </div>
        </Card>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Próximos Agendamentos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 380, overflowY: "auto" }}>
            {APPOINTMENTS.map(a => (
              <div key={a.id} style={{
                display: "flex", gap: 12, padding: 14, borderRadius: 12,
                background: C.bg, border: `1px solid ${C.border}`,
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.secondary}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{
                  textAlign: "center", flexShrink: 0, background: C.gradient,
                  borderRadius: 10, padding: "10px 14px", color: "#fff",
                }}>
                  <div style={{ fontSize: 20, fontWeight: 900 }}>{a.date.split("-")[2]}</div>
                  <div style={{ fontSize: 9, opacity: 0.7, fontWeight: 600 }}>JUN</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>{a.patient}</div>
                  <div style={{ fontSize: 13, color: C.textSec }}>{a.type}</div>
                  <div style={{ fontSize: 12, color: C.textSec, marginTop: 2 }}>⏰ {a.time}</div>
                </div>
                <Badge color={statusColor[a.status]}>{a.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===================== FINANCIAL MODULE =====================
function FinancialModule() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const metrics = [
    { l: "Receita Jun/25", v: "R$ 71.200", c: C.success, icon: <FaChartLine /> },
    { l: "Ticket Médio", v: "R$ 185,40", c: C.secondary, icon: <FaTicketAlt /> },
    { l: "Assinaturas Ativas", v: "342", c: C.primary, icon: <FaHeartbeat /> },
    { l: "MRR 360", v: "R$ 34.200", c: "#7C3AED", icon: <FaSyncAlt /> },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 22px", letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 10 }}><FaMoneyBillWave color={C.primary} /> Financeiro</h1>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        {metrics.map(m => (
          <Card key={m.l} hover style={{ padding: "20px 20px", borderLeft: `4px solid ${m.c}`, borderRadius: "0 16px 16px 0" }}>
            <div style={{ fontSize: 24, marginBottom: 10 }}>{m.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: m.c, letterSpacing: -0.5 }}>{m.v}</div>
            <div style={{ fontSize: 12, color: C.textSec, marginTop: 3 }}>{m.l}</div>
          </Card>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "3fr 2fr", gap: 18 }}>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>Receita por Mês</h3>
          <p style={{ fontSize: 12, color: C.textSec, margin: "0 0 16px" }}>Jan – Jun 2025</p>
          <BarChart data={REVENUE_DATA} dataKey="value" color={C.secondary} height={120} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {REVENUE_DATA.map(d => <span key={d.month} style={{ fontSize: 11, color: C.textSec, flex: 1, textAlign: "center" }}>{d.month}</span>)}
          </div>
        </Card>
        <Card style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 18px" }}>Distribuição por Categoria</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { l: "Hematologia", pct: 32, c: C.secondary },
              { l: "Bioquímica", pct: 28, c: C.primary },
              { l: "Imunologia", pct: 18, c: "#7C3AED" },
              { l: "Microbiologia", pct: 14, c: C.warning },
              { l: "Parasitologia", pct: 8, c: C.success },
            ].map(item => (
              <div key={item.l}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: C.text }}>{item.l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: item.c }}>{item.pct}%</span>
                </div>
                <div style={{ height: 7, background: C.border, borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ width: `${item.pct}%`, height: "100%", background: item.c, borderRadius: 100, transition: "width 0.5s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ===================== PATIENT PORTAL =====================
function PatientPortal() {
  const [tab, setTab] = useState("dashboard");
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([{ from: "ai", text: AI_RESPONSES.default }]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatRef = useRef(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sendChat = useCallback((inputOverride) => {
    const text = inputOverride || chatInput;
    if (!text.trim()) return;
    const input = text.toLowerCase();
    const reply = input.includes("colesterol") ? AI_RESPONSES.colesterol
      : input.includes("glicemia") || input.includes("glicose") ? AI_RESPONSES.glicemia
        : input.includes("hemo") || input.includes("sangue") ? AI_RESPONSES.hemograma
          : input.includes("pressão") || input.includes("pressao") ? AI_RESPONSES.pressão
            : "Ótima pergunta! Para análise precisa do seu caso, leve o relatório completo da plataforma ao seu médico. Posso ajudar com mais dúvidas sobre seus exames — pergunte sobre colesterol, glicemia, hemograma ou pressão arterial.";

    setMessages(prev => [...prev, { from: "user", text }]);
    setChatInput("");
    setAiLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "ai", text: reply }]);
      setAiLoading(false);
      setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 50);
    }, 800);
  }, [chatInput]);

  const tabs = [
    { id: "dashboard", label: "Minha Saúde", icon: <FaHome /> },
    { id: "exams", label: "Exames", icon: <FaMicroscope /> },
    { id: "charts", label: "Evolução", icon: <FaChartLine /> },
    { id: "ai", label: "Assistente BIIA", icon: <FaRobot /> },
  ];

  const statusData = { normal: { color: C.success, bg: C.successBg, label: "Normal", icon: <FaCheckCircle /> }, atenção: { color: C.warning, bg: C.warningBg, label: "Atenção", icon: <FaExclamationTriangle /> }, crítico: { color: C.danger, bg: C.dangerBg, label: "Crítico", icon: <FaExclamationTriangle /> } };

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: "0 0 4px", letterSpacing: -0.5 }}>Portal do Paciente</h1>
        <p style={{ color: C.textSec, fontSize: 14, margin: 0 }}>Bem-vinda, <strong>Ana Paula</strong></p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: isMobile ? "9px 14px" : "10px 20px",
              borderRadius: 10, border: `1.5px solid ${tab === t.id ? C.secondary : C.border}`,
              background: tab === t.id ? C.secondary : C.surface,
              color: tab === t.id ? "#fff" : C.textSec,
              fontSize: isMobile ? 13 : 14, fontWeight: tab === t.id ? 600 : 400,
              cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.15s",
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* DASHBOARD */}
      {tab === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "auto 1fr 1fr 1fr", gap: 14, marginBottom: 18, alignItems: "start" }}>
            <Card style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "center", gridColumn: isMobile ? "1 / -1" : "auto" }}>
              <ScoreMeter score={82} />
            </Card>
            {[
              { l: "Próximo Checkup", v: "05 Jun 2025", sub: "Agendado", icon: <FaCalendarAlt />, c: C.secondary },
              { l: "Último Exame", v: "10 Mai 2025", sub: "Hemograma", icon: <FaMicroscope />, c: C.primary },
              { l: "Alertas Ativos", v: "1 Atenção", sub: "Colesterol LDL", icon: <FaExclamationTriangle />, c: C.warning },
            ].map(m => (
              <Card key={m.l} hover style={{ padding: "20px 20px", borderTop: `4px solid ${m.c}`, borderRadius: "16px" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{m.icon}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: m.c, marginBottom: 2, letterSpacing: -0.3 }}>{m.v}</div>
                <div style={{ fontSize: 12, color: C.textSec }}>{m.l}</div>
                <div style={{ fontSize: 12, color: m.c, fontWeight: 600, marginTop: 3 }}>{m.sub}</div>
              </Card>
            ))}
          </div>
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}><FaBell color={C.warning} /> Alertas Preventivos</h3>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 14 }}>
              {[
                { level: "atenção", title: "Colesterol LDL", desc: "138 mg/dL — levemente acima de 130 mg/dL. Atenção à alimentação." },
                { level: "normal", title: "Hemograma Completo", desc: "Todos os índices dentro dos valores de referência. Excelente!" },
                { level: "normal", title: "Glicemia", desc: "Glicose 94 mg/dL — dentro do ideal. Continue assim!" },
              ].map(a => {
                const s = statusData[a.level] || statusData.normal;
                return (
                  <div key={a.title} style={{ background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span>{s.icon}</span>
                      <span style={{ fontWeight: 700, fontSize: 13, color: s.color }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 5 }}>{a.title}</div>
                    <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>{a.desc}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* EXAMS */}
      {tab === "exams" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PATIENT_EXAMS_HISTORY.map(exam => {
            const s = statusData[exam.status] || statusData.normal;
            return (
              <Card key={exam.id} style={{ overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.textSec, marginRight: 8, letterSpacing: 0.5 }}>{exam.category.toUpperCase()}</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{exam.name}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, color: C.textSec, display: "inline-flex", alignItems: "center", gap: 6 }}><FaCalendarAlt /> {exam.date}</span>
                    <Badge color={s.color} bg={s.bg}>{s.icon} {s.label}</Badge>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
                    <thead>
                      <tr style={{ background: C.bg }}>
                        {["Exame", "Resultado", "Referência", "Status"].map(h => (
                          <th key={h} style={{ padding: "10px 22px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.textSec, letterSpacing: 0.5 }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {exam.items.map((item, i) => {
                        const is = statusData[item.status] || statusData.normal;
                        return (
                          <tr key={i} style={{ borderTop: `1px solid ${C.border}` }}
                            onMouseEnter={e => e.currentTarget.style.background = C.bg}
                            onMouseLeave={e => e.currentTarget.style.background = ""}>
                            <td style={{ padding: "12px 22px", fontSize: 14, fontWeight: 500 }}>{item.name}</td>
                            <td style={{ padding: "12px 22px", fontSize: 14, fontWeight: 700, color: is.color }}>{item.value}</td>
                            <td style={{ padding: "12px 22px", fontSize: 13, color: C.textSec }}>{item.ref}</td>
                            <td style={{ padding: "12px 22px" }}>
                              <Badge color={is.color} bg={is.bg}>{is.icon} {is.label}</Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* CHARTS */}
      {tab === "charts" && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 18 }}>
          {[
            { title: "Colesterol Total", unit: "mg/dL", data: CHOLESTEROL_DATA, key: "total", color: C.warning, ref: "< 200", last: "210", trend: "↓ em queda" },
            { title: "Glicemia em Jejum", unit: "mg/dL", data: GLUCOSE_DATA, key: "value", color: C.secondary, ref: "70–99", last: "92", trend: "ideal" },
            { title: "Peso Corporal", unit: "kg", data: WEIGHT_DATA, key: "value", color: C.primary, ref: "≈ 68–72", last: "69.2", trend: "↓ estável" },
            { title: "Pressão Sistólica", unit: "mmHg", data: PRESSURE_DATA, key: "sys", color: "#7C3AED", ref: "< 120", last: "118", trend: "ideal" },
          ].map(chart => (
            <Card key={chart.title} hover style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 3px", color: C.text }}>{chart.title}</h3>
                  <span style={{ fontSize: 11, color: C.textSec }}>{chart.unit} · Ref: {chart.ref}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: chart.color, letterSpacing: -1 }}>{chart.last}</div>
                  <div style={{ fontSize: 11, color: C.textSec, fontWeight: 500 }}>{chart.trend}</div>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <LineChart data={chart.data} dataKey={chart.key} color={chart.color} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                {chart.data.map(d => <span key={d.month} style={{ fontSize: 10, color: C.textHint }}>{d.month}</span>)}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* AI CHAT */}
      {tab === "ai" && (
        <Card style={{ overflow: "hidden", height: isMobile ? "70vh" : 540, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "18px 22px", background: C.gradient, display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "rgba(255,255,255,0.18)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 22,
            }}><FaRobot /></div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>BIIA — Assistente Inteligente</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }}></span>
                BIOLAB 360 · Online
              </div>
            </div>
          </div>

          <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: 18, display: "flex", flexDirection: "column", gap: 14, background: C.bg }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
                {m.from === "ai" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}><FaRobot /></div>
                )}
                <div style={{
                  maxWidth: "72%", padding: "12px 16px",
                  borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: m.from === "user" ? C.gradient : C.surface,
                  color: m.from === "user" ? "#fff" : C.text,
                  fontSize: 14, lineHeight: 1.65,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                }}>{m.text}</div>
              </div>
            ))}
            {aiLoading && (
              <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}><FaRobot /></div>
                <div style={{ padding: "12px 18px", borderRadius: "18px 18px 18px 4px", background: C.surface, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.secondary, animation: `pulse 1.4s ${delay}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: "12px 16px 6px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
              {["Meu colesterol", "Glicemia", "Pressão arterial", "Hemograma"].map(t => (
                <button key={t} onClick={() => sendChat(t)}
                  style={{
                    padding: "6px 14px", background: `${C.secondary}10`,
                    color: C.secondary, border: `1px solid ${C.secondary}30`,
                    borderRadius: 100, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = `${C.secondary}20`}
                  onMouseLeave={e => e.currentTarget.style.background = `${C.secondary}10`}
                >{t}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: "0 16px 16px", display: "flex", gap: 10, background: C.surface }}>
            <Input
              value={chatInput} onChange={e => setChatInput(e.target.value)}
              placeholder="Pergunte sobre seus exames..."
              style={{ flex: 1 }}
            />
            <button onClick={() => sendChat()}
              style={{
                background: C.gradient, color: "#fff", border: "none",
                borderRadius: 10, padding: "0 20px", fontWeight: 700, cursor: "pointer",
                fontSize: 18, transition: "opacity 0.15s",
              }}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            ><FaArrowRight /></button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ===================== LAYOUT WRAPPER =====================
function AppLayout({ user, onLogout, menu, defaultSection, children }) {
  const [active, setActive] = useState(defaultSection);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: C.bg }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.borderStrong}; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
      `}</style>
      <Sidebar menu={menu} active={active} setActive={setActive} user={user} onLogout={onLogout} open={sidebarOpen} setOpen={setSidebarOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Topbar title="BIOLAB 360" onMenu={() => setSidebarOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto", padding: isMobile ? "20px 16px" : "32px 32px" }}>
            {typeof children === "function" ? children(active) : children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ===================== ADMIN SYSTEM =====================
function AdminSystem({ user, onLogout }) {
  const menu = [
    { id: "dashboard", label: "Dashboard", icon: <FaChartLine /> },
    { id: "patients", label: "Pacientes", icon: <FaUserFriends /> },
    { id: "exams", label: "Exames", icon: <FaMicroscope /> },
    { id: "appointments", label: "Agendamentos", icon: <FaCalendarAlt /> },
    { id: "financial", label: "Financeiro", icon: <FaMoneyBillWave /> },
  ];
  const content = {
    dashboard: <AdminDashboard />,
    patients: <PatientsModule />,
    exams: <ExamsModule />,
    appointments: <AppointmentsModule />,
    financial: <FinancialModule />,
  };
  return (
    <AppLayout user={user} onLogout={onLogout} menu={menu} defaultSection="dashboard">
      {(active) => content[active]}
    </AppLayout>
  );
}

// ===================== PATIENT SYSTEM =====================
function PatientSystem({ user, onLogout }) {
  const menu = [{ id: "portal", label: "Minha Saúde", icon: <FaHome /> }];
  return (
    <AppLayout user={user} onLogout={onLogout} menu={menu} defaultSection="portal">
      {() => <PatientPortal />}
    </AppLayout>
  );
}

// ===================== ROOT =====================
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const handleLogin = (u) => { setUser(u); setPage(u.role === "admin" ? "admin" : "patient"); };
  const handleLogout = () => { setUser(null); setPage("landing"); };

  if (page === "landing") return <LandingPage onLogin={() => setPage("login")} />;
  if (page === "login") return <LoginPage onLogin={handleLogin} onBack={() => setPage("landing")} />;
  if (page === "admin") return <AdminSystem user={user} onLogout={handleLogout} />;
  if (page === "patient") return <PatientSystem user={user} onLogout={handleLogout} />;
}
