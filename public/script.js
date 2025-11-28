// ==================== CONFIGURAÇÕES ====================
// Config Supabase
const supabaseUrl = "https://qpiqntxpaqslfuylnydc.supabase.co"; // Cola o teu Project URL
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwaXFudHhwYXFzbGZ1eWxueWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Nzc1NjEsImV4cCI6MjA3NTA1MzU2MX0.beiX0GAfAWuFyXu9uKGbXXXsbcdz8cK64JZXFYgCf4M"; // Cola a anon key

let supabase; // Inicializa mais tarde

const WEBHOOK_WHATSAPP = "https://seu-webhook.n8n.cloud/webhook/whatsapp-otp"; // SUBSTITUIR (para enviar OTP via WhatsApp/WAHA)
const WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/GZpPv5O7lmL7UKxVFh1M7K"; // SUBSTITUIR
const WHATSAPP_SUPPORT = "https://wa.me/244931738075"; // Número de suporte
const CHATBOT_LINK = "https://codestart20.vercel.app/assistente.html"; // Link do chatbot principal
const PRICE_PER_COURSE = 11000; // Kz por área
const DISCOUNT_TWO_COURSES = 0.2; // 20% de desconto

const COURSE_START_DATE = new Date("2025-02-01T09:00:00");

// ==================== VARIÁVEIS GLOBAIS ====================
let data = {};
let step = 0;
let waiting = false;
let userIP = null;
let conversationEnded = false;
let alertSent5Hours = false;

const steps = [
  "Acordo", // 0
  "Nome", // 1
  "BI", // 2
  "Idade", // 3
  "Província", // 4
  "Município", // 5
  "Bairro", // 6
  "Educação", // 7
  "Telefone 1", // 8
  "Telefone 2", // 9
  "Email", // 10
  "Motivação", // 11
  "Referência", // 12
  "Cursos", // 13
  "Modalidade", // 14
  "Verificação", // 15
  "Pagamento", // 16
  "Horários", // 17
  "Confirmação", // 18
];

const provinces = [
  "Luanda",
  "Benguela",
  "Huambo",
  "Huíla",
  "Cuanza-Sul",
  "Malanje",
  "Bengo",
  "Bié",
  "Cabinda",
  "Cuando-Cubango",
  "Cuanza-Norte",
  "Cunene",
  "Lunda-Norte",
  "Lunda-Sul",
  "Moxico",
  "Namibe",
  "Uíge",
  "Zaire",
];

const municipalities = {
  Bengo: [
    "Ambriz",
    "Bula Atumba",
    "Dande",
    "Dembos-Quibaxe",
    "Nambuangongo",
    "Pango Aluquém",
  ],
  Benguela: [
    "Balombo",
    "Baía Farta",
    "Benguela",
    "Bocoio",
    "Caimbambo",
    "Catumbela",
    "Chongorói",
    "Cubal",
    "Ganda",
    "Lobito",
  ],
  Bié: [
    "Andulo",
    "Camacupa",
    "Catabola",
    "Chinguar",
    "Chitembo",
    "Cuemba",
    "Cunhinga",
    "Cuíto",
    "N'harea",
  ],
  Cabinda: ["Belize", "Buco-Zau", "Cabinda", "Cacongo"],
  "Cuando-Cubango": [
    "Calai",
    "Cuangar",
    "Cuchi",
    "Cuito Cuanavale",
    "Dirico",
    "Mavinga",
    "Menongue",
    "Nancova",
    "Rivungo",
  ],
  "Cuanza-Norte": [
    "Ambaca",
    "Banga",
    "Bolongongo",
    "Cambambe",
    "Cazengo",
    "Golungo Alto",
    "Gonguembo",
    "Lucala",
    "Quiculungo",
    "Samba Cajú",
  ],
  "Cuanza-Sul": [
    "Amboim",
    "Cassongue",
    "Cela",
    "Conda",
    "Ebo",
    "Libolo",
    "Mussende",
    "Quibala",
    "Quilenda",
    "Seles",
    "Sumbe",
    "Waku Kungo",
  ],
  Cunene: ["Cahama", "Cuanhama", "Curoca", "Cuvelai", "Namacunde", "Ombadja"],
  Huambo: [
    "Bailundo",
    "Caála",
    "Ekunha",
    "Huambo",
    "Katchiungo",
    "Londuimbale",
    "Longonjo",
    "Mungo",
    "Tchicala-Tcholoanga",
    "Tchindjenje",
    "Ucuma",
  ],
  Huíla: [
    "Caconda",
    "Caluquembe",
    "Chiange",
    "Chibia",
    "Chicomba",
    "Chipindo",
    "Gambos",
    "Humpata",
    "Jamba",
    "Kuvango",
    "Lubango",
    "Matala",
    "Quilengues",
    "Quipungo",
  ],
  Luanda: [
    "Belas",
    "Cacuaco",
    "Cazenga",
    "Icolo e Bengo",
    "Luanda",
    "Quilamba Quiaxi",
    "Quissama",
    "Talatona",
    "Viana",
  ],
  "Lunda-Norte": [
    "Cambulo",
    "Capenda-Camulemba",
    "Caungula",
    "Chitato",
    "Cuango",
    "Cuilo",
    "Lóvua",
    "Lubalo",
    "Lucapa",
    "Xá-Muteba",
  ],
  "Lunda-Sul": ["Cacolo", "Dala", "Muconda", "Saurimo"],
  Malanje: [
    "Cacuso",
    "Calandula",
    "Cambundi-Catembo",
    "Cangandala",
    "Caombo",
    "Cunda-dia-baze",
    "Kivaba Nzogi",
    "Luquembo",
    "Malanje",
    "Marimba",
    "Massango",
    "Mucari",
    "Quela",
    "Quirima",
  ],
  Moxico: [
    "Alto Zambeze",
    "Camanongue",
    "Cameia",
    "Leua",
    "Luau",
    "Luena",
    "Luacano",
    "Lumbala Nguimbo",
    "Luchazes",
  ],
  Namibe: ["Bibala", "Camacuio", "Moçâmedes", "Tômbua", "Virei"],
  Uíge: [
    "Ambuila",
    "Bembe",
    "Buengas",
    "Bungo",
    "Cangola",
    "Damba",
    "Maquela do Zombo",
    "Mucaba",
    "Negage",
    "Puri",
    "Quimbele",
    "Quitexe",
    "Santa Cruz",
    "Sanza Pombo",
    "Songo",
    "Uíge",
  ],
  Zaire: ["Cuimba", "M'Banza Kongo", "Noqui", "N'Zeto", "Soyo", "Tomboco"],
};

async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    userIP = data.ip;
    console.log("✅ IP obtido:", userIP);
  } catch (error) {
    console.error("❌ Erro ao obter IP:", error);
    userIP = "unknown";
  }
}

function checkExistingRegistration() {
  const registration = localStorage.getItem("codestart_registration");
  if (registration) {
    const regData = JSON.parse(registration);
    data = regData;
    showDashboard();
  } else {
    // Em vez de mostrar welcome diretamente, mostrar search para permitir busca no Supabase
    document.getElementById("searchView").style.display = "flex";
  }
}

// ==================== WELCOME MODAL ====================
function startApp() {
  document.getElementById("welcomeModal").style.display = "none";
  document.getElementById("app").style.display = "block";
  initSteps();
  setTimeout(() => showWelcomeMessage(), 500);
}

function showTerms() {
  alert(
    "Termos e Condições:\n\n1. Taxa: 15.000 Kz (total) ou 2x 7.500 Kz\n2. Prazo: 72h (3 dias úteis) para o pagamento\n3. Inscrições não pagas são anuladas\n4. Dados armazenados de forma segura\n5. Certificado após conclusão do curso"
  );
}

function showSearch() {
  document.getElementById("welcomeModal").style.display = "none";
  document.getElementById("searchView").style.display = "flex";
}

async function searchRegistration() {
  const bi = document.getElementById("searchBI").value.trim().toUpperCase();

  if (!validateBI(bi)) {
    alert("BI inválido. Use o formato: 000000000LA000");
    return;
  }

  // Buscar no localStorage primeiro
  let localMatch = false;
  const registration = localStorage.getItem("codestart_registration");
  if (registration) {
    const regData = JSON.parse(registration);
    if (regData.bi === bi) {
      data = regData;
      localMatch = true;
      document.getElementById("searchView").style.display = "none";
      showDashboard();
      return;
    }
  }

  // Se não encontrou no localStorage ou BI diferente, buscar na BD Supabase
  if (!supabase) {
    alert("Sistema ainda carregando. Tente novamente em breve.");
    return;
  }

  try {
    // MUDANÇA AQUI: Usa .maybeSingle() para evitar 406 em resultados vazios
    const { data: regData, error } = await supabase
      .from("inscricoes")
      .select("*")
      .eq("bi", bi)
      .maybeSingle(); // <- Esta é a correção principal

    if (error) throw error; // Remove a verificação de PGRST116, pois .maybeSingle() não gera erro em vazio

    if (regData) {
      // Atualizar localStorage com dados do Supabase (sync)
      data = regData;
      localStorage.setItem("codestart_registration", JSON.stringify(data));
      document.getElementById("searchView").style.display = "none";
      showDashboard();
    } else {
      // Não encontrado em nenhum lugar: iniciar nova inscrição
      alert("Inscrição não encontrada. Vamos iniciar uma nova.");
      document.getElementById("searchView").style.display = "none";
      document.getElementById("welcomeModal").style.display = "flex";
    }
  } catch (error) {
    console.error("Erro ao buscar na BD:", error);
    alert("Erro ao buscar inscrição. Tenta novamente.");
  }
}

function showWelcome() {
  document.getElementById("searchView").style.display = "none";
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("app").style.display = "none";
  document.getElementById("welcomeModal").style.display = "flex";
}

function joinCommunity() {
  window.open(WHATSAPP_COMMUNITY, "_blank");
}

// ==================== INICIALIZAR PASSOS ====================
function initSteps() {
  const list = document.getElementById("stepsList");
  list.innerHTML = "";
  steps.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "step" + (i === 0 ? " active" : "");
    div.innerHTML = `
            <div class="step-num">${i + 1}</div>
            <div class="step-name">${s}</div>
        `;
    list.appendChild(div);
  });
}

function updateProgress() {
  const pct = Math.round((step / (steps.length - 1)) * 100);
  document.getElementById("progressFill").style.width = pct + "%";
  document.getElementById("progressText").textContent = pct + "%";

  document.querySelectorAll(".step").forEach((el, i) => {
    el.className = "step";
    if (i < step) el.classList.add("done");
    if (i === step) el.classList.add("active");
  });
}

// ==================== MENSAGEM INICIAL ====================
function showWelcomeMessage() {
  conversationEnded = false;
  addBot(
    `Olá! Bem-vindo ao <strong>Code Start 2.0</strong> 🎓<br><br>
        Sou o CodeBot, seu assistente de inscrição.<br><br>
        <strong>Preços dos Cursos:</strong><br>
        • 1 área: <strong>11.000 Kz</strong><br>
        • 2 áreas: <strong>17.600 Kz</strong> (desconto de 20%)<br>
        <small>Economia de 4.400 Kz ao escolher 2 áreas! (O pagamento pode ser feito de forma parcelar)</small><br><br>
        <strong>Outras informações:</strong><br>
        • Prazo: <strong>72 horas</strong> para pagamento<br>
        • Inscrições não pagas são anuladas automaticamente<br>
        • Link da comunidade WhatsApp no final<br><br>
        Deseja prosseguir com a inscrição?`,
    [
      { text: '<i class="fas fa-check"></i> Sim, prosseguir', fn: agree },
      {
        text: '<i class="fas fa-building"></i> Sobre a Empresa',
        fn: showCompanyInfoInChat,
      },
      {
        text: '<i class="fas fa-file-contract"></i> Termos',
        fn: showTermsInChat,
      },
      { text: '<i class="fas fa-times"></i> Não agora', fn: decline },
    ]
  );
}

function showCompanyInfoInChat() {
  addUser("Ver informações da empresa");
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBot(
        `<strong>FORMACTIVA - FORMAÇÃO PROFISSIONAL E TECNOLÓGICA, (SU), Lda.</strong><br><br>
                📍 <strong>Localização: </strong><br>
                Benfica, Zona Verde 3 (em frente ao ISIA), rua 3, trav. 3<br>
                Belas, Luanda - Angola<br><br>
                📞 <strong>Contactos:</strong><br>
                Tel: +244 931 738 075<br>
                Email: codestart20.nzilax@gmail.com<br>
                Web: https://codestart20.vercel.app/<br><br>
                🆔 <strong>NIF:</strong> 5002495457<br><br>
                🕐 <strong>Horário de atendimento:</strong><br>
                Seg-Sex: 8h às 17h<br>
                Sábados: 9h às 13h<br><br>
                Deseja prosseguir com a inscrição?`,
        [
          { text: '<i class="fas fa-check"></i> Sim, prosseguir', fn: agree },
          {
            text: '<i class="fas fa-arrow-left"></i> Voltar',
            fn: showWelcomeMessage,
          },
        ]
      );
    }, 2000);
  }, 1000);
}

function showTermsInChat() {
  addUser("Ver termos e condições");
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBot(
        `<strong>Termos e Condições</strong><br><br>
                1. Taxa de inscrição não reembolsável<br>
                2. Pagamento em até 72h após inscrição<br>
                3. Inscrições não pagas serão anuladas<br>
                4. Dados protegidos conforme LGPD<br>
                5. Certificado após conclusão com 70% de aproveitamento<br><br>
                Deseja prosseguir?`,
        [
          { text: '<i class="fas fa-check"></i> Aceito', fn: agree },
          {
            text: '<i class="fas fa-times"></i> Voltar',
            fn: showWelcomeMessage,
          },
        ]
      );
    }, 2000);
  }, 1000);
}

function agree() {
  conversationEnded = false;
  addUser("Concordo e quero prosseguir");
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBot(
        "Perfeito! Vamos começar sua inscrição.<br><br>Qual é o seu <strong>nome completo</strong>?"
      );
      showInput();
      step = 1;
      updateProgress();
    }, 2000);
  }, 1000);
}

function decline() {
  conversationEnded = true;
  addUser("Não posso agora");
  hideInput();
  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBot(`Sem problema! 😊<br><br>
                <strong>Junte-se à nossa comunidade:</strong><br>
                <a href="${WHATSAPP_COMMUNITY}" target="_blank" style="color: var(--green); text-decoration: none;">
                    <i class="fab fa-whatsapp"></i> Entrar na Comunidade WhatsApp
                </a><br><br>
                Para mais informações:<br>
                📞 <strong>+244 931 738 075</strong><br><br>
                <small>Digite algo se desejar retomar a inscrição</small>`);
      showInput();
    }, 2000);
  }, 1000);
}

//================ CALCULAR PREÇOS =================
// Função para calcular preço
function calculatePrice(numCourses) {
  if (numCourses === 1) {
    return {
      total: PRICE_PER_COURSE,
      discount: 0,
      final: PRICE_PER_COURSE,
    };
  } else if (numCourses === 2) {
    const total = PRICE_PER_COURSE * 2;
    const discount = total * DISCOUNT_TWO_COURSES;
    return {
      total: total,
      discount: discount,
      final: total - discount,
    };
  }
  return { total: 0, discount: 0, final: 0 };
}

// Formatar valor em Kz
function formatKz(value) {
  return (
    new Intl.NumberFormat("pt-AO", {
      style: "decimal",
      minimumFractionDigits: 0,
    }).format(value) + " Kz"
  );
}

// Modal da empresa
function showCompanyInfo() {
  document.getElementById("companyModal").style.display = "flex";
}

function closeCompanyModal() {
  document.getElementById("companyModal").style.display = "none";
}

// Fechar modal ao clicar fora
document.addEventListener("click", (e) => {
  const modal = document.getElementById("companyModal");
  if (e.target === modal) {
    closeCompanyModal();
  }
});

// ==================== PROCESSAR RESPOSTAS ====================
function send() {
  if (waiting) return;
  const inp = document.getElementById("input");
  const val = inp.value.trim();
  if (!val) return;

  // Se conversa terminou, verificar intenção
  if (conversationEnded) {
    handlePostDeclineMessage(val);
    inp.value = "";
    return;
  }

  addUser(val);
  inp.value = "";
  inp.style.height = "auto";
  waiting = true;

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      process(val);
      waiting = false;
    }, 2000);
  }, 1000);
}

function handlePostDeclineMessage(val) {
  const valLower = val.toLowerCase();

  // Palavras-chave para retomar inscrição
  const retryKeywords = [
    "quero",
    "inscrever",
    "prosseguir",
    "continuar",
    "sim",
    "aceito",
    "desejo",
    "gostaria",
  ];
  const hasRetryKeyword = retryKeywords.some((keyword) =>
    valLower.includes(keyword)
  );

  if (hasRetryKeyword) {
    addUser(val);
    conversationEnded = false;
    agree();
  } else {
    addUser(val);
    setTimeout(() => {
      showTyping();
      setTimeout(() => {
        hideTyping();
        addBot(
          `Sou apenas um assistente de inscrição. Para outras questões, fale com nosso chatbot principal:<br><br>
                    <a href="${CHATBOT_LINK}" target="_blank" style="color: var(--green)">
                        <i class="fas fa-robot"></i> Ir para o Chatbot
                    </a><br><br>
                    Ou deseja <strong>prosseguir com a inscrição</strong>?`,
          [{ text: '<i class="fas fa-check"></i> Sim, inscrever', fn: agree }]
        );
      }, 2000);
    }, 1000);
  }
}

function process(val) {
  // Desabilitar cliques em opções antigas
  document.querySelectorAll(".opt-btn").forEach((btn) => {
    btn.disabled = true;
    btn.style.opacity = "0.5";
    btn.style.cursor = "not-allowed";
  });

  switch (step) {
    case 1: // Nome
      if (val.length < 3) {
        addBot("Nome muito curto. Digite seu <strong>nome completo</strong>:");
        return;
      }
      data.name = val;
      addBot(
        `Prazer, <strong>${val}</strong>! 😊<br><br>Agora preciso do número do seu <strong>Bilhete de Identidade (BI)</strong>.<br><br><small>Atenção: O número do BI deve ser válido</small>`
      );
      step = 2;
      updateProgress();
      break;

    case 2: // BI
      const biUpper = val.toUpperCase();
      if (!validateBI(biUpper)) {
        addBot(
          "BI inválido. Use o formato correto:<br><small>Exemplo: 123456789LA001</small>"
        );
        return;
      }
      data.bi = biUpper;
      addBot(
        `BI registado: <strong>${biUpper}</strong> ✅<br><br>Qual é sua <strong>idade</strong>?`
      );
      step = 3;
      updateProgress();
      break;

    case 3: // Idade
      const age = parseInt(val);
      if (isNaN(age) || age < 16 || age > 35) {
        addBot(
          "Idade fora do permitido. Aceita-se entre <strong>16 e 35 anos</strong>:"
        );
        return;
      }
      data.age = age;
      hideInput();
      addBot(
        `${age} anos, perfeito! 🎯<br><br>Em que <strong>província</strong> reside?`,
        provinces.map((p) => ({
          text: `<i class="fas fa-map-marker-alt"></i> ${p}`,
          fn: () => selectProvince(p),
        }))
      );
      step = 4;
      updateProgress();
      break;

    case 6: // Bairro
      data.neighborhood = val;
      hideInput();
      addBot(
        `Bairro: <strong>${val}</strong> ✅<br><br>Qual é seu <strong>nível académico</strong>?`,
        [
          {
            text: '<i class="fas fa-graduation-cap"></i> Ensino Secundário',
            fn: () => selectEdu("Ensino Secundário"),
          },
          {
            text: '<i class="fas fa-university"></i> Ensino Superior',
            fn: () => selectEdu("Ensino Superior"),
          },
        ]
      );
      step = 7;
      updateProgress();
      break;

    case 8: // Telefone 1
      if (!validatePhone(val)) {
        addBot(
          "Número inválido. Use formato: <strong>923456789</strong> ou <strong>+244923456789</strong>"
        );
        return;
      }
      data.phone1 = formatPhone(val);
      addBot(
        `Contacto principal: <strong>${data.phone1}</strong> ✅<br><br>Tem um <strong>segundo número</strong>? (Digite ou "não")`
      );
      step = 9;
      updateProgress();
      break;

    case 9: // Telefone 2
      if (
        val.toLowerCase().includes("não") ||
        val.toLowerCase().includes("nao")
      ) {
        data.phone2 = null;
        addBot(`Boa! Tem <strong>email</strong>? (Digite ou "não")`);
        step = 10;
        updateProgress();
      } else if (!validatePhone(val)) {
        addBot('Número inválido ou digite "não":');
        return;
      } else {
        data.phone2 = formatPhone(val);
        addBot(
          `Segundo contacto: <strong>${data.phone2}</strong> ✅<br><br>Tem <strong>email</strong>? (Digite ou "não")`
        );
        step = 10;
        updateProgress();
      }
      break;

    case 10: // Email
      if (
        val.toLowerCase().includes("não") ||
        val.toLowerCase().includes("nao")
      ) {
        data.email = null;
        addBot(
          `Sem problema! 👍<br><br>Qual é a sua <strong>motivação</strong> para fazer este curso?`
        );
        step = 11;
        updateProgress();
      } else if (!validateEmail(val)) {
        addBot('Email inválido ou digite "não":');
        return;
      } else {
        data.email = val.toLowerCase();
        addBot(
          `Email: <strong>${data.email}</strong> ✅<br><br>Qual sua <strong>motivação</strong> para fazer este curso?`
        );
        step = 11;
        updateProgress();
      }
      break;

    case 11: // Motivação
      if (val.length < 15) {
        addBot(
          "Conte-me um pouco mais sobre sua motivação (mínimo 15 caracteres):"
        );
        return;
      }
      data.motivation = val;
      hideInput();
      addBot(
        "Excelente motivação! 🌟<br><br>Como <strong>soube do curso</strong>?",
        [
          {
            text: '<i class="fab fa-facebook"></i> Redes Sociais',
            fn: () => selectRef("Redes Sociais"),
          },
          {
            text: '<i class="fas fa-user-friends"></i> Amigos/Família',
            fn: () => selectRef("Amigos/Família"),
          },
          {
            text: '<i class="fas fa-search"></i> Google',
            fn: () => selectRef("Google"),
          },
          {
            text: '<i class="fas fa-bullhorn"></i> Publicidade',
            fn: () => selectRef("Publicidade"),
          },
          {
            text: '<i class="fas fa-ellipsis-h"></i> Outro',
            fn: () => selectRef("Outro"),
          },
        ]
      );
      step = 12;
      updateProgress();
      break;

    case 14: // Verificação OTP
      if (val.length === 6 && /^\d+$/.test(val)) {
        if (val === data.otp) {
          data.otp = val; // Guardar o OTP verificado
          hideInput();
          const pricing = calculatePrice(data.courses.length);
          const totalAmount = formatKz(pricing.final);
          const parcelAmount = formatKz(Math.ceil(pricing.final / 2));
          addBot(
            `Código verificado com sucesso! ✅<br><br>Como prefere <strong>efetuar o pagamento</strong>?`,
            [
              {
                text: `<i class="fas fa-money-bill-wave"></i> Total (${totalAmount})`,
                fn: () => selectPaymentType("total"),
              },
              {
                text: `<i class="fas fa-credit-card"></i> Parcelado (2x ${parcelAmount})`,
                fn: () => selectPaymentType("parcelado"),
              },
            ]
          );
          step = 16; // ← MUDAR PARA 16, não 15!
          updateProgress();
        } else {
          addBot("❌ Código incorreto. Tente novamente:");
        }
      } else {
        addBot("Digite o código de <strong>6 dígitos</strong>:");
      }
      break;
    case 16: // Confirmação - ESTE CASE ESTAVA VAZIO
      if (
        val.toLowerCase().includes("sim") ||
        val.toLowerCase().includes("confirmo")
      ) {
        finalizeRegistration();
      } else if (
        val.toLowerCase().includes("não") ||
        val.toLowerCase().includes("nao")
      ) {
        hideInput();
        addBot(
          `Sem problema! Entre em contacto com nossa equipa para esclarecer dúvidas:<br><br>
            📞 <strong>+244 931 738 075</strong><br>
            📧 <strong>codestart20.nzilax@gmail.com</strong><br><br>
            Ou deseja refazer a inscrição?`,
          [
            {
              text: '<i class="fas fa-redo"></i> Refazer',
              fn: () => location.reload(),
            },
            {
              text: '<i class="fab fa-whatsapp"></i> Contactar Equipa',
              fn: contactSupport,
            },
          ]
        );
      } else {
        addBot(
          'Por favor, responda com "<strong>SIM</strong>" para confirmar ou "<strong>NÃO</strong>" para cancelar:'
        );
      }
      break;
    case 17: // Confirmação
      if (
        val.toLowerCase().includes("sim") ||
        val.toLowerCase().includes("confirmo")
      ) {
        finalizeRegistration();
      } else if (
        val.toLowerCase().includes("não") ||
        val.toLowerCase().includes("nao")
      ) {
        hideInput();
        addBot(
          `Sem problema! Entre em contacto com nossa equipa para esclarecer dúvidas:<br><br>
            📞 <strong>+244 931 738 075</strong><br>
            📧 <strong>codestart20.nzilax@gmail.com</strong><br><br>
            Ou deseja refazer a inscrição?`,
          [
            {
              text: '<i class="fas fa-redo"></i> Refazer',
              fn: () => location.reload(),
            },
            {
              text: '<i class="fab fa-whatsapp"></i> Contactar Equipa',
              fn: contactSupport,
            },
          ]
        );
      } else {
        addBot(
          'Por favor, responda com "<strong>SIM</strong>" para confirmar ou "<strong>NÃO</strong>" para cancelar:'
        );
      }
      break;
  }
}

// ==================== SELEÇÕES ====================
function selectProvince(prov) {
  data.province = prov;
  addUser(prov);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();

      // Sempre mostrar municípios por botões
      if (municipalities[prov] && municipalities[prov].length > 0) {
        const first6 = municipalities[prov].slice(0, 6).map((m) => ({
          text: `<i class="fas fa-building"></i> ${m}`,
          fn: () => selectMunicipality(m),
        }));

        let municipalityOptions = first6;

        if (municipalities[prov].length > 6) {
          // Expandir diretamente com "Ver todos" que mostra todos inline
          const showAllFn = () => {
            const allOpts = municipalities[prov].map((m) => ({
              text: `<i class="fas fa-building"></i> ${m}`,
              fn: () => selectMunicipality(m),
            }));
            addBot(`🏙️ <strong>Municípios de ${prov}:</strong>`, allOpts);
          };

          municipalityOptions.push({
            text: '<i class="fas fa-list"></i> Ver todos os municípios',
            fn: showAllFn,
          });
        }

        addBot(
          `Província: <strong>${prov}</strong> ✅<br><br>🏙️ Qual é seu <strong>município</strong>?`,
          municipalityOptions
        );
      } else {
        // Fallback removido, pois agora todos os municípios estão definidos
        addBot(
          `Província: <strong>${prov}</strong> ✅<br><br>Erro: Municípios não disponíveis para ${prov}.`
        );
      }
      step = 5;
      updateProgress();
    }, 2000);
  }, 1000);
}

function selectMunicipality(mun) {
  data.municipality = mun;
  addUser(mun);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBot(
        `Município: <strong>${mun}</strong> ✅<br><br>🏘️ Qual é seu <strong>bairro</strong>?`
      );
      showInput();
      step = 6;
      updateProgress();
    }, 2000);
  }, 1000);
}

function selectEdu(edu) {
  data.education = edu;
  addUser(edu);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBot(
        `Nível académico: <strong>${edu}</strong> ✅<br><br>📱 Qual é seu <strong>número de telefone principal</strong>?<br><small>Formato: 923456789</small>`
      );
      showInput();
      step = 8;
      updateProgress();
    }, 2000);
  }, 1000);
}

function selectRef(ref) {
  data.reference = ref;
  addUser(ref);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      showCourseSelection();
    }, 2000);
  }, 1000);
}

function showCourseSelection() {
  const msg = addBot(
    `Referência: <strong>${data.reference}</strong> ✅<br><br>💻 Escolha até <strong>2 áreas</strong> de interesse:`
  );

  const container = document.createElement("div");
  container.className = "checkbox-group";

  const courses = [
    {
      id: "logic",
      name: "Lógica de Programação",
      desc: "Fundamentos e algoritmos",
    },
    { id: "web", name: "Desenvolvimento Web", desc: "HTML, CSS, JavaScript" },
    {
      id: "design",
      name: "Design Gráfico + Motion",
      desc: "Design visual e animação",
    },
    {
      id: "cybersec",
      name: "Cibersegurança em Redes e Sistemas",
      desc: "Protecção de redes locais e sistemas empresariais",
    },
  ];

  courses.forEach((c) => {
    const item = document.createElement("div");
    item.className = "checkbox-item";
    item.innerHTML = `
            <input type="checkbox" id="${c.id}" value="${c.name}">
            <label class="checkbox-label" for="${c.id}">
                <strong>${c.name}</strong>
                <div class="checkbox-desc">${c.desc}</div>
            </label>
        `;
    container.appendChild(item);
  });

  const btn = document.createElement("button");
  btn.className = "opt-btn";
  btn.style.marginTop = "15px";
  btn.innerHTML = '<i class="fas fa-check"></i> Confirmar Seleção';
  btn.onclick = confirmCourses;
  btn.disabled = true;
  btn.id = "confirmBtn";

  container.querySelectorAll("input").forEach((inp) => {
    inp.onchange = () => {
      const checked = container.querySelectorAll("input:checked");
      if (checked.length > 2) {
        inp.checked = false;
        addBot("⚠️ Máximo 2 áreas permitidas!");
      }
      document.getElementById("confirmBtn").disabled = checked.length === 0;
    };
  });

  msg.querySelector(".msg-content").appendChild(container);
  msg.querySelector(".msg-content").appendChild(btn);
  step = 13;
  updateProgress();
}

function confirmCourses() {
  const selected = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((c) => c.value);

  if (selected.length === 0) {
    addBot("⚠️ Selecione pelo menos <strong>1 área</strong>!");
    return;
  }

  data.courses = selected;
  addUser(selected.join(" + "));

  // Desabilitar checkboxes
  document.querySelectorAll(".checkbox-item input").forEach((inp) => {
    inp.disabled = true;
  });
  document.getElementById("confirmBtn").disabled = true;
  document.getElementById("confirmBtn").style.opacity = "0.5";

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      // ← NOVO: Mostrar seleção de modalidade em vez de OTP
      showModalitySelection();
      step = 14;
      updateProgress();
    }, 2000);
  }, 1000);
}

function showModalitySelection() {
  addBot(
    `Cursos selecionados: <strong>${data.courses.join(
      ", "
    )}</strong> ✅<br><br>📍 Qual vai ser a  <strong>modalidade do curso</strong>?`,
    [
      {
        text: '<i class="fas fa-building"></i> Presencial',
        fn: () => selectModality("Presencial"),
      },
      {
        text: '<i class="fas fa-laptop"></i> Online',
        fn: () => selectModality("Online"),
      },
    ]
  );
}

function selectModality(modality) {
  data.modality = modality;
  addUser(modality);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      
      // ========== VALIDAÇÃO DE DISPONIBILIDADE ==========
      // Verificar se algum curso selecionado não está disponível na modalidade escolhida
      const unavailableCourses = [];
      data.courses.forEach(course => {
        const schedules = getSchedulesForCourse(course, modality);
        if (!schedules || schedules.length === 0) {
          unavailableCourses.push(course);
        }
      });
      
      // Se houver cursos indisponíveis, informar o usuário
      if (unavailableCourses.length > 0) {
        const courseList = unavailableCourses.join(", ");
        addBot(
          `⚠️ <strong>Atenção!</strong><br><br>
          ${unavailableCourses.length === 1 ? 'O curso' : 'Os cursos'} <strong>${courseList}</strong> 
          ${unavailableCourses.length === 1 ? 'não está disponível' : 'não estão disponíveis'} na modalidade <strong>${modality}</strong>.<br><br>
          ${unavailableCourses.includes("Cibersegurança em Redes e Sistemas") ? 
            '<small>📌 <strong>Cibersegurança</strong> só está disponível <strong>presencialmente</strong>.</small><br><br>' : ''}
          Por favor, escolha outra modalidade:`,
          [
            {
              text: '<i class="fas fa-building"></i> Presencial',
              fn: () => selectModality("Presencial"),
            },
            {
              text: '<i class="fas fa-laptop"></i> Online',
              fn: () => selectModality("Online"),
            },
          ]
        );
        return; // Para a execução aqui
      }
      // ========== FIM DA VALIDAÇÃO ==========
      
      // Se todos os cursos estão disponíveis, prosseguir com OTP
      const contactOptions = [
        {
          text: `<i class="fas fa-sms"></i> SMS (${data.phone1})`,
          fn: () => sendOTP("sms"),
        },
        {
          text: `<i class="fab fa-whatsapp"></i> WhatsApp (${data.phone1})`,
          fn: () => sendOTP("whatsapp"),
        },
      ];

      if (data.email) {
        contactOptions.push({
          text: `<i class="fas fa-envelope"></i> Email (${data.email})`,
          fn: () => sendOTP("email"),
        });
      }

      addBot(
        `Modalidade: <strong>${modality}</strong> ✅<br><br>🔐 Vou enviar um <strong>código de verificação</strong>.<br><br>Para onde prefere receber?`,
        contactOptions
      );
      step = 15;
      updateProgress();
    }, 2000);
  }, 1000);
}

// ==================== ENVIO OTP ====================
async function sendOTP() {
  addUser("SMS");

  showTyping();
  data.otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Enviar via API TelcoSMS
    const phone = data.phone1.replace(/\D/g, "");
    const phoneNumber = phone.startsWith("244") ? phone.substring(3) : phone;

    const response = await fetch("/api/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: phoneNumber,
        message_body: `Olá, ${data.name}.\n\nO seu código de verificação: ${data.otp}\n\nNão compartilhe este código.`,
      }),
    });

    const result = await response.json();
    hideTyping();

    if (result.success) {
      addBot(
        `✅ SMS enviado para <strong>${data.phone1}</strong>!<br><br>Digite o <strong>código de 6 dígitos</strong> que recebeu:`
      );
      showInput();
      step = 14; // Atualizar para step de verificação
      updateProgress();
    } else {
      throw new Error("Falha no envio");
    }
  } catch (error) {
    hideTyping();
    console.error("Erro ao enviar OTP:", error);
    addBot(
      `⚠️ Erro ao enviar. Use o código de teste: <strong>${data.otp}</strong><br><br>Digite o código:`
    );
    showInput();
  }
}

// ==================== ESTRUTURA DE HORÁRIOS POR CURSO ====================
const courseSchedules = {
  "Cibersegurança em Redes e Sistemas": {
    Presencial: [
      { turma: 1, sala: "Sala 1", horario: "8h:30  - 10h:30", dias: "Dias úteis" },
    ],
    Online: [] // Cibersegurança não disponível online
  },
  "Design Gráfico + Motion": {
    Presencial: [
      { turma: 2, sala: "Sala 2", horario: "10h:40 - 12h:40", dias: "Dias úteis" },
      { turma: 3, sala: "Sala 3", horario: "9h30 - 14h30", dias: "Sábados" },
    ],
    Online: [
      { turma: 10, sala: "Online", horario: "18h - 20h", dias: "Dias úteis" },
    ]
  },
  "Desenvolvimento Web": {
    Presencial: [
      { turma: 4, sala: "Sala 1", horario: "13h - 15h", dias: "Dias úteis" },
      { turma: 11, sala: "Sala 3", horario: "9h30 - 14h30", dias: "Sábados" },
    ],
    Online: [
      { turma: 12, sala: "Online", horario: "18h - 20h", dias: "Dias úteis" },
    ]
  },
  "Lógica de Programação": {
    Presencial: [
      { turma: 7, sala: "Sala 2", horario: "15h:15 - 17h:15", dias: "Dias úteis" }
    ],
    Online: [
      { turma: 13, sala: "Online", horario: "18h - 20h", dias: "Dias úteis" },
    ]
  },
};

// Mapeamento de nomes de cursos para a chave correta
const courseNameMapping = {
  "Lógica de Programação": "Lógica de Programação",
  "Desenvolvimento Web": "Desenvolvimento Web",
  "Design Gráfico + Motion Design": "Design Gráfico + Motion",
  "Cibersegurança em Redes e Sistemas": "Cibersegurança em Redes e Sistemas",
};

// ==================== FUNÇÃO PARA OBTER HORÁRIOS DE UM CURSO ====================
function getSchedulesForCourse(courseName, modality) {
  const key = courseNameMapping[courseName] || courseName;
  const courseData = courseSchedules[key];
  
  if (!courseData) return [];
  
  // Retornar horários baseados na modalidade
  return courseData[modality] || [];
}
// ==================== SELEÇÃO DE PAGAMENTO ====================
// Substituir a função selectPaymentType existente pela seguinte:

function selectPaymentType(type) {
  data.paymentType = type;
  const pricing = calculatePrice(data.courses.length);
  const amount =
    type === "total" ? pricing.final : Math.ceil(pricing.final / 2);

  data.totalAmount = pricing.final;
  data.paymentAmount = amount;

  addUser(type === "total" ? "Pagamento Total" : "Pagamento Parcelado");

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();

      // Se apenas 1 curso, ir direto para seleção de horário
      if (data.courses.length === 1) {
        showScheduleSelectionForCourse(0);
      } else {
        // Se 2 cursos, começar com o primeiro
        showScheduleSelectionForCourse(0);
      }

      step = 16;
      updateProgress();
    }, 2000);
  }, 1000);
}

function selectSchedule(schedule) {
  data.schedule = schedule;
  addUser(schedule);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();
      const pricing = calculatePrice(data.courses.length);
      const amount =
        data.paymentType === "total"
          ? pricing.final
          : Math.ceil(pricing.final / 2);
      addBot(`Horário selecionado: <strong>${schedule}</strong> ✅<br><br>
                <strong>Resumo da inscrição:</strong><br>
                • Nome: ${data.name}<br>
                • BI: ${data.bi}<br>
                • Telefone: ${data.phone1}<br>
                • Cursos: ${data.courses.join(", ")}<br>
                • Horário: ${schedule}<br>
                • Valor total: ${formatKz(pricing.final)}<br>
                • A pagar agora: ${formatKz(amount)}<br><br>
                Confirma os dados? Digite <strong>SIM</strong> para finalizar ou <strong>NÃO</strong> para revisar.`);
      showInput();
      step = 17; // Confirmação
      updateProgress();
    }, 2000);
  }, 1000);
}

// ==================== NOVA FUNÇÃO: SELEÇÃO DE HORÁRIO POR CURSO ====================
function showScheduleSelectionForCourse(courseIndex) {
  const courseName = data.courses[courseIndex];
  const schedules = getSchedulesForCourse(courseName, data.modality);

  if (!schedules || schedules.length === 0) {
    addBot(
      `⚠️ Nenhum horário disponível para <strong>${courseName}</strong> na modalidade <strong>${data.modality}</strong>.<br><br>
      Entre em contacto com o suporte para mais informações.`,
      [
        {
          text: '<i class="fas fa-headset"></i> Contactar Suporte',
          fn: contactSupport,
        },
      ]
    );
    return;
  }

  hideInput();

  const scheduleOptions = schedules.map((s) => ({
    text: `<i class="fas fa-clock"></i> ${s.horario} ${s.dias !== 'Dias úteis' ? '(' + s.dias + ')' : ''} (Turma ${s.turma}${s.sala !== 'Online' ? ' - ' + s.sala : ''})`,
    fn: () => selectCourseSchedule(s, courseIndex),
  }));

  const courseLabel =
    data.courses.length > 1
      ? `(${courseIndex + 1}/${data.courses.length})`
      : "";

  addBot(
    `Forma de pagamento: <strong>${
      data.paymentType === "total" ? "Total" : "Parcelado"
    }</strong> ✅<br><br>🕐 Selecione o horário para <strong>${courseName}</strong> ${courseLabel}:<br><small>Modalidade: ${data.modality}</small>`,
    scheduleOptions
  );
}
// ==================== NOVA FUNÇÃO: REGISTAR O HORÁRIO DO CURSO ====================
function selectCourseSchedule(schedule, courseIndex) {
  const courseName = data.courses[courseIndex];

  // Inicializar array de horários se não existir
  if (!data.schedules) {
    data.schedules = {};
  }

  // Armazenar horário com informações completas
  data.schedules[courseName] = {
    horario: schedule.horario,
    turma: schedule.turma,
    sala: schedule.sala,
    dias: schedule.dias  // ← NOVO CAMPO
  };

  const displayText = `${schedule.horario} ${schedule.dias !== 'Dias úteis' ? '(' + schedule.dias + ')' : ''} (Turma ${schedule.turma}${schedule.sala !== 'Online' ? ' - ' + schedule.sala : ''})`;
  addUser(displayText);

  setTimeout(() => {
    showTyping();
    setTimeout(() => {
      hideTyping();

      // Se há mais cursos, mostrar seleção para o próximo
      if (courseIndex + 1 < data.courses.length) {
        showScheduleSelectionForCourse(courseIndex + 1);
      } else {
        // Todos os horários foram selecionados, ir para confirmação
        showFinalConfirmation();
      }
    }, 2000);
  }, 1000);
}
// ==================== NOVA FUNÇÃO: CONFIRMAÇÃO FINAL ====================
function showFinalConfirmation() {
  const pricing = calculatePrice(data.courses.length);
  const amount =
    data.paymentType === "total" ? pricing.final : Math.ceil(pricing.final / 2);

  // ✅ CORREÇÃO: Construir texto de horários corretamente
  let schedulesText = "";
  if (data.schedules && Object.keys(data.schedules).length > 0) {
    data.courses.forEach((course) => {
      const schedule = data.schedules[course];
      if (schedule) {
        const daysText = schedule.dias && schedule.dias !== 'Dias úteis' ? ` (${schedule.dias})` : '';
        const salaText = schedule.sala && schedule.sala !== 'Online' ? ` - ${schedule.sala}` : '';
        schedulesText += `<br>• ${course}: ${schedule.horario}${daysText} (Turma ${schedule.turma}${salaText})`;
      }
    });
  } else {
    schedulesText = "<br>• Não selecionado";
  }

  addBot(
    `<strong>Resumo da inscrição:</strong><br>
    • Nome: ${data.name}<br>
    • BI: ${data.bi}<br>
    • Telefone: ${data.phone1}<br>
    • Cursos: ${data.courses.join(", ")}<br>
    • Modalidade: ${data.modality || "Não selecionado"}<br>
    • Horários:${schedulesText}<br>
    • Valor total: ${formatKz(pricing.final)}<br>
    • A pagar agora: ${formatKz(amount)}<br><br>
    Confirma os dados? Digite <strong>SIM</strong> para finalizar ou <strong>NÃO</strong> para revisar.`
  );
  showInput();
  step = 17;
  updateProgress();
}

// ==================== FINALIZAR INSCRIÇÃO ====================
async function finalizeRegistration() {
  hideInput();
  showTyping();

  const ref = "CS" + Date.now().toString().slice(-8);
  const pricing = calculatePrice(data.courses.length);
  const amountNum =
    data.paymentType === "total" ? pricing.final : Math.ceil(pricing.final / 2);
  const amount = formatKz(amountNum);

  data.paymentRef = ref;
  data.paymentAmount = amount;
  data.registrationDate = new Date().toISOString();
  data.expiryDate = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
  data.status = "pending";
  data.attempts = 0;
  data.ip = userIP || "unknown"; // ← Garantir que sempre tem valor

  localStorage.setItem("codestart_registration", JSON.stringify(data));

  // ✅ CORREÇÃO: Converter schedules para JSON string para armazenar no Supabase
  const schedulesJSON = data.schedules ? JSON.stringify(data.schedules) : null;

  const dbData = {
    name: data.name,
    bi: data.bi,
    age: data.age,
    province: data.province,
    municipality: data.municipality,
    neighborhood: data.neighborhood,
    education: data.education,
    phone1: data.phone1,
    phone2: data.phone2 || null,
    email: data.email || null,
    motivation: data.motivation,
    reference: data.reference,
    courses: data.courses, // array
    modality: data.modality || "Não selecionado", // ← Garantir valor
    otp: data.otp,
    payment_type: data.paymentType,
    total_amount: data.totalAmount,
    payment_amount: data.paymentAmount,
    schedule: schedulesJSON, // ← Agora é string JSON (CORRIGIDO)
    payment_ref: ref,
    registration_date: data.registrationDate,
    expiry_date: data.expiryDate,
    status: "pending",
    attempts: 0,
    ip: data.ip, // ← Incluir IP (CORRIGIDO)
  };

  try {
    if (!supabase) {
      throw new Error("Supabase não inicializado");
    }

    const { data: insertedData, error } = await supabase
      .from("inscricoes")
      .insert([dbData]); // ✅ Usar array para insert

    if (error) {
      console.error("Erro do Supabase:", error);
      throw error;
    }

    console.log("✅ Inscrição salva com sucesso no Supabase!", insertedData);
  } catch (error) {
    console.error("❌ Erro ao salvar no Supabase:", error.message);
    // Não interromper o fluxo - dados já estão no localStorage
  }

  hideTyping();

  const validStr = new Date(data.expiryDate).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  addBot(`
        🎉 <strong>Inscrição Concluída com Sucesso!</strong><br><br>
        <strong>Dados da Inscrição:</strong><br>
        • Referência: <strong>${ref}</strong><br>
        • Valor: <strong>${amount}</strong><br>
        • Prazo: <strong>${validStr}</strong><br><br>
        ✅ Dados salvos com sucesso!<br><br>
        🔗 <a href="${WHATSAPP_COMMUNITY}" target="_blank" style="color: var(--green)">
            <i class="fab fa-whatsapp"></i> Entrar na Comunidade WhatsApp
        </a><br><br>
        <small>Redirecionando para o painel...</small>
    `);

  setTimeout(() => {
    document.getElementById("app").style.display = "none";
    showDashboard();
  }, 4000);
}

// ==================== DASHBOARD ====================
function showDashboard() {
  document.getElementById("app").style.display = "none";
  document.getElementById("searchView").style.display = "none";
  document.getElementById("welcomeModal").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  updateDashboard();
  startCountdown();
}

function updateDashboard() {
  // ✅ CORREÇÃO: Recuperar schedules do localStorage se necessário
  if (!data.schedules && localStorage.getItem("codestart_registration")) {
    const stored = JSON.parse(localStorage.getItem("codestart_registration"));
    if (stored.schedules) {
      data.schedules = stored.schedules;
    }
  }

  // ✅ CORREÇÃO: Construir texto de horários
  let scheduleText = "Não selecionado";
  if (data.schedules && Object.keys(data.schedules).length > 0) {
    const scheduleArray = [];
    data.courses.forEach((course) => {
      const schedule = data.schedules[course];
      if (schedule) {
        const daysText = schedule.dias && schedule.dias !== 'Dias úteis' ? ` (${schedule.dias})` : '';
        scheduleArray.push(
          `${course}: ${schedule.horario}${daysText} (Turma ${schedule.turma})`
        );
      }
    });
    if (scheduleArray.length > 0) {
      scheduleText = scheduleArray.join("<br>");
    }
  } else if (data.schedule) {
    // Fallback para dados antigos
    scheduleText = data.schedule;
  }

  const info = document.getElementById("dashInfo");
  info.innerHTML = `
        <p style="margin: 8px 0;"><strong>Nome:</strong> ${data.name}</p>
        <p style="margin: 8px 0;"><strong>BI:</strong> ${data.bi}</p>
        <p style="margin: 8px 0;"><strong>Telefone:</strong> ${data.phone1}</p>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${
          data.email || "Não informado"
        }</p>
        <p style="margin: 8px 0;"><strong>Cursos:</strong> ${data.courses.join(
          ", "
        )}</p>
        <p style="margin: 8px 0;"><strong>Modalidade:</strong> ${
          data.modality || "Não selecionado"
        }</p>
        <p style="margin: 8px 0;"><strong>Horário:</strong><br>${scheduleText}</p>
        <p style="margin: 8px 0;"><strong>Referência:</strong> <code style="background: #222; padding: 4px 8px; border-radius: 4px;">${
          data.paymentRef
        }</code></p>
    `;

  // Status
  const statusEl = document.getElementById("dashStatus");
  let statusClass = "status-pending";
  let statusText = "⏳ Pagamento Pendente";
  let statusDesc = "Aguardando confirmação do pagamento";

  if (data.status === "completed") {
    statusClass = "status-completed";
    statusText = "✅ Inscrição Concluída";
    statusDesc = "Pagamento confirmado";
  } else if (data.status === "cancelled") {
    statusClass = "status-cancelled";
    statusText = "❌ Inscrição Anulada";
    statusDesc = "Prazo de pagamento expirado";
  }

  statusEl.innerHTML = `
    <span class="status-badge ${statusClass}">${statusText}</span>
    <p style="margin-top: 10px; color: #999; font-size: 14px;">${statusDesc}</p>
  `;

  // ========== ESTA PARTE ESTAVA FALTANDO ==========
  // Ações
  const actions = document.getElementById("dashActions");
  actions.innerHTML = "";

  if (data.status === "pending") {
    actions.innerHTML = `
      <button class="dash-btn btn-primary-dash" onclick="uploadReceipt()">
        <i class="fas fa-upload"></i> Enviar Comprovativo
      </button>
      <button class="dash-btn btn-secondary-dash" onclick="downloadPDF()">
        <i class="fas fa-download"></i> Baixar Fatura (PDF)
      </button>
      <button class="dash-btn btn-secondary-dash" onclick="contactSupport()">
        <i class="fas fa-headset"></i> Suporte
      </button>
    `;
  } else if (data.status === "completed") {
    actions.innerHTML = `
      <button class="dash-btn btn-primary-dash" onclick="downloadPDF()">
        <i class="fas fa-download"></i> Baixar Fatura
      </button>
      <button class="dash-btn btn-secondary-dash" onclick="joinCommunity()">
        <i class="fab fa-whatsapp"></i> Comunidade
      </button>
    `;
  } else if (data.status === "cancelled" && data.attempts < 3) {
    actions.innerHTML = `
      <button class="dash-btn btn-primary-dash" onclick="retryRegistration()">
        <i class="fas fa-redo"></i> Nova Tentativa (${3 - data.attempts} restantes)
      </button>
    `;
  } else {
    actions.innerHTML = `
      <p style="color: #999;">Limite de tentativas excedido. Entre em contato com o suporte.</p>
      <button class="dash-btn btn-secondary-dash" onclick="contactSupport()">
        <i class="fas fa-headset"></i> Contactar Suporte
      </button>
    `;
  }

  // Botão de sair apenas em mobile
  if (window.innerWidth <= 1768) {
    const logoutBtn = document.createElement("button");
    logoutBtn.className = "dash-btn btn-secondary-dash";
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sair';
    logoutBtn.onclick = logout;
    actions.appendChild(logoutBtn);
  }
  // ========== FIM DA PARTE QUE ESTAVA FALTANDO ==========
}

function startCountdown() {
  const countdownEl = document.getElementById("dashCountdown");

  const updateCountdown = () => {
    const now = new Date();
    const expiry = new Date(data.expiryDate);
    const courseStart = COURSE_START_DATE;

    if (data.status === "pending") {
      const diff = expiry - now;

      if (diff <= 0) {
        // Prazo expirado
        data.status = "cancelled";
        data.attempts++;
        localStorage.setItem("codestart_registration", JSON.stringify(data));
        updateDashboard();
        clearInterval(countdownInterval);
        return;
      }

      // Verificar se faltam 5h e enviar alerta
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 5 && !alertSent5Hours) {
        alertSent5Hours = true;
        send5HourAlert();
      }

      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      countdownEl.innerHTML = `
                <div class="countdown-box" style="background: ${
                  hours <= 5
                    ? "#ff6b6b"
                    : "linear-gradient(135deg, var(--green), var(--dark-green))"
                };">
                    <p style="font-size: 14px; margin-bottom: 10px;">⏰ Prazo para pagamento:</p>
                    <div class="countdown-time">${hours
                      .toString()
                      .padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}</div>
                    <p style="font-size: 12px; margin-top: 8px;">${
                      hours <= 5 ? "⚠️ URGENTE!" : "Horas : Minutos : Segundos"
                    }</p>
                </div>
            `;
    } else if (data.status === "completed") {
      const diff = courseStart - now;
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        countdownEl.innerHTML = `
                    <div class="countdown-box">
                        <p style="font-size: 14px; margin-bottom: 10px;">🎓 Início do curso em:</p>
                        <div class="countdown-time">${days}d ${hours}h ${minutes}m</div>
                    </div>
                `;
      } else {
        countdownEl.innerHTML = `
                    <div class="countdown-box">
                        <p style="font-size: 16px;">🚀 Curso em andamento!</p>
                    </div>
                `;
      }
    } else {
      countdownEl.innerHTML = `<p style="color: #999; text-align: center;">Inscrição anulada</p>`;
    }
  };

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);
}

async function send5HourAlert() {
  try {
    // Enviar via SMS
    const phone = data.phone1.replace(/\D/g, "");
    const phoneNumber = phone.startsWith("244") ? phone.substring(3) : phone;

    await fetch("/api/send-sms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: phoneNumber,
        message_body: `⚠️ Code Start 2.0\n\nALERTA: Faltam apenas 5 horas para o prazo de pagamento expirar!\n\nReferência: ${data.paymentRef}\nValor: ${data.paymentAmount}\n\nEvite o cancelamento automático. Pague agora!`,
      }),
    });

    // Tentar enviar via WhatsApp também
    await fetch(WEBHOOK_WHATSAPP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: data.phone1.replace(/\D/g, ""),
        message: `⚠️ *ALERTA - Code Start 2.0*\n\nFaltam apenas *5 horas* para o prazo de pagamento expirar!\n\nReferência: ${data.paymentRef}\nValor: ${data.paymentAmount}\n\nEvite o cancelamento automático. Entre em contato!`,
      }),
    });
  } catch (error) {
    console.error("Erro ao enviar alerta de 5h:", error);
  }
}


// ==================== AÇÕES DO DASHBOARD ====================
function uploadReceipt() {
  // Redirecionar para WhatsApp da Nzila
  window.open(
    `${WHATSAPP_SUPPORT}?text=Olá! Gostaria de enviar o comprovativo de pagamento da minha inscrição Code Start 2.0.%0A%0AReferência: ${data.paymentRef}%0ANome: ${data.name}%0ABI: ${data.bi}`,
    "_blank"
  );
}

function downloadPDF() {
  // Gerar PDF com jsPDF
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const pricing = calculatePrice(data.courses.length);

  // Design da fatura - Header com cor verde
  doc.setFillColor(179, 226, 52);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("CODE START 2.0", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Comprovativo de Inscrição", 105, 30, { align: "center" });

  // Dados da inscrição
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);

  let y = 55;
  const lineHeight = 8;

  // ========== SEÇÃO 1: DADOS DO FORMANDO ==========
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DO FORMANDO", 20, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${data.name}`, 20, y);
  y += lineHeight;
  doc.text(`BI: ${data.bi}`, 20, y);
  y += lineHeight;
  doc.text(`Idade: ${data.age} anos`, 20, y);
  y += lineHeight;
  doc.text(`Telefone: ${data.phone1}`, 20, y);
  y += lineHeight;
  if (data.phone2) {
    doc.text(`Telefone Alternativo: ${data.phone2}`, 20, y);
    y += lineHeight;
  }
  doc.text(`Email: ${data.email || "Não informado"}`, 20, y);
  y += lineHeight;
  doc.text(
    `Localização: ${data.neighborhood}, ${data.municipality}, ${data.province}`,
    20,
    y
  );
  y += lineHeight;
  doc.text(`Nível Académico: ${data.education}`, 20, y);

  // ========== SEÇÃO 2: DADOS DA INSCRIÇÃO ==========
  y += lineHeight + 5;
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DA INSCRIÇÃO", 20, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.text(`Referência: ${data.paymentRef}`, 20, y);
  y += lineHeight;
  doc.text(`Cursos: ${data.courses.join(", ")}`, 20, y);
  y += lineHeight;
  doc.text(`Modalidade: ${data.modality || "Não selecionado"}`, 20, y);
  y += lineHeight;

  // Mostrar horários por curso se existirem
  if (data.schedules && Object.keys(data.schedules).length > 0) {
    doc.text("Horários:", 20, y);
    y += lineHeight;
    data.courses.forEach((course) => {
      const schedule = data.schedules[course];
      if (schedule) {
        doc.text(
          `  • ${course}: ${schedule.horario} (${schedule.sala} - Turma ${schedule.turma})`,
          20,
          y
        );
        y += lineHeight;
      }
    });
  } else {
    doc.text(`Horário: ${data.schedule || "Não selecionado"}`, 20, y);
    y += lineHeight;
  }

  doc.text(
    `Data de Inscrição: ${new Date(data.registrationDate).toLocaleString(
      "pt-PT"
    )}`,
    20,
    y
  );
  y += lineHeight;
  doc.text(`Motivação: ${data.motivation}`, 20, y);
  y += lineHeight;
  doc.text(`Como soube do curso: ${data.reference}`, 20, y);

 // SEÇÃO 3: INFORMAÇÕES DE PAGAMENTO
  y += lineHeight + 5;
  doc.setFont("helvetica", "bold");
  doc.text("INFORMAÇÕES DE PAGAMENTO", 20, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.text(`Preço base: ${formatKz(pricing.total)}`, 20, y);
  y += lineHeight;

  if (pricing.discount > 0) {
    doc.setTextColor(0, 180, 0);
    doc.text(`Desconto (20%): -${formatKz(pricing.discount)}`, 20, y);
    y += lineHeight;
    doc.setTextColor(0, 0, 0);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`Valor Final: ${formatKz(pricing.final)}`, 20, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Valor a Pagar Agora: ${data.paymentAmount}`, 20, y);
  y += lineHeight;

  doc.text(
    `Tipo de Pagamento: ${
      data.paymentType === "total"
        ? "Pagamento Total"
        : "Pagamento Parcelado (2x)"
    }`,
    20,
    y
  );
  y += lineHeight;

  doc.text(
    `Prazo de Pagamento: ${new Date(data.expiryDate).toLocaleString("pt-PT")}`,
    20,
    y
  );
  y += lineHeight + 2;

  // Status com cor e destaque visual
  const statusText =
    data.status === "pending"
      ? "⏳ Pagamento Pendente"
      : data.status === "completed"
      ? "✅ Pagamento Concluído"
      : "❌ Inscrição Anulada";

  const statusColor =
    data.status === "pending"
      ? [255, 107, 107]
      : data.status === "completed"
      ? [76, 175, 80]
      : [200, 200, 200];

  // Box colorido para o estado
  doc.setFillColor(...statusColor);
  doc.roundedRect(20, y - 3, 80, 10, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(statusText, 60, y + 3, { align: "center" });
  
  y += lineHeight + 5;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");

  // ========== SEÇÃO 4: INFORMAÇÕES ADICIONAIS ==========
  if (data.status === "pending") {
    // Adicionar espaço antes da caixa de aviso
    y += 5;
    
    // Caixa de aviso com fundo vermelho claro
    doc.setFillColor(255, 235, 235);
    doc.roundedRect(15, y - 5, 180, 50, 3, 3, 'F');
    
    // Borda vermelha
    doc.setDrawColor(255, 107, 107);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, y - 5, 180, 50, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(200, 0, 0);
    doc.text("⚠️ ATENÇÃO: Pagamento Pendente", 20, y + 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 0, 0);
    y += 10;
    doc.text(
      "Sua inscrição será automaticamente anulada se o pagamento não for",
      20,
      y
    );
    y += 5;
    doc.text("confirmado dentro do prazo.", 20, y);
    
    y += 10;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Para efetuar o pagamento, contacte:", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text("📞 +244 931 738 075  |  📧 codestart20.nzilax@gmail.com", 20, y);
    
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Referência de Pagamento:", 20, y);
    y += 8;

    // Box com referência destacada
    doc.setFillColor(50, 50, 50);
    doc.roundedRect(20, y - 4, 160, 12, 2, 2, "F");
    doc.setTextColor(179, 226, 52);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(data.paymentRef, 100, y + 3, { align: "center" });
    
    y += 20;
  } else if (data.status === "completed") {
    y += 5;
    
    // Caixa de sucesso com fundo verde claro
    doc.setFillColor(235, 255, 235);
    doc.roundedRect(15, y - 5, 180, 35, 3, 3, 'F');
    
    // Borda verde
    doc.setDrawColor(76, 175, 80);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, y - 5, 180, 35, 3, 3, 'S');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0, 150, 0);
    doc.text("✅ INSCRIÇÃO CONFIRMADA", 20, y + 2);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(0, 100, 0);
    y += 10;
    doc.text(
      `Pagamento confirmado! O curso inicia em ${new Date(
        COURSE_START_DATE
      ).toLocaleDateString("pt-PT")}.`,
      20,
      y
    );
    y += 8;
    doc.text("Acesse a comunidade WhatsApp para atualizações.", 20, y);
    
    y += 20;
  }
  
  doc.setTextColor(0, 0, 0);

  // ========== RODAPÉ ==========
  y = 270;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text(
    "FORMACTIVA - FORMAÇÃO PROFISSIONAL E TECNOLÓGICA, (SU), Lda. | NIF: 5002495457",
    105,
    y,
    { align: "center" }
  );
  y += 5;
  doc.text(
    "Benfica, Zona Verde 3 (em frente ao ISIA), rua 3, trav. 3 | Belas, Luanda - Angola",
    105,
    y,
    { align: "center" }
  );
  y += 5;
  doc.text(
    "Tel: +244 931 738 075 | Email: codestart20.nzilax@gmail.com | Web: https://codestart20.vercel.app/",
    105,
    y,
    { align: "center" }
  );

  // Salvar com nome único
  doc.save(`CodeStart_Fatura_${data.paymentRef}.pdf`);
}

function retryRegistration() {
  if (data.attempts >= 3) {
    alert("Limite de tentativas excedido. Entre em contato com o suporte.");
    return;
  }

  if (confirm("Deseja iniciar uma nova tentativa de inscrição?")) {
    localStorage.removeItem("codestart_registration");
    location.reload();
  }
}

function logout() {
  if (
    confirm(
      "Deseja sair? Poderá consultar sua inscrição novamente digitando seu BI."
    )
  ) {
    document.getElementById("dashboard").style.display = "none";
    showSearch();
  }
}

function contactSupport() {
  window.open(
    `${WHATSAPP_SUPPORT}?text=Olá! Gostaria de solicitar ajuda em relação ao Code Start 2.0.`,
    "_blank"
  );
}

// ==================== VALIDAÇÕES ====================
function validateBI(bi) {
  // Formato: 9 dígitos + 2 letras + 3 dígitos (ex: 123456789LA001)
  const biRegex = /^\d{9}[A-Z]{2}\d{3}$/;
  return biRegex.test(bi);
}

function validatePhone(phone) {
  const clean = phone.replace(/\D/g, "");
  return (
    (clean.length === 9 && clean.startsWith("9")) ||
    (clean.length === 12 && clean.startsWith("244") && clean[3] === "9")
  );
}

function formatPhone(phone) {
  let clean = phone.replace(/\D/g, "");
  if (clean.startsWith("244")) return "+" + clean;
  if (clean.startsWith("9")) return "+244" + clean;
  return "+244" + clean;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleKey(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    send();
  }
}

// ==================== UI FUNCTIONS ====================
function addBot(text, opts = []) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "msg bot-msg";

  let html = `
          <div class="avatar"><i class="fas fa-robot"></i></div>
          <div class="msg-content">
              <div class="msg-text">${text}</div>
      `;

  if (opts.length > 0) {
    html += '<div class="options">';
    opts.forEach((opt) => {
      html += `<button class="opt-btn">${opt.text}</button>`;
    });
    html += "</div>";
  }

  html += "</div>";
  div.innerHTML = html;
  chat.appendChild(div);

  opts.forEach((opt, i) => {
    const btn = div.querySelectorAll(".opt-btn")[i];
    if (btn) btn.onclick = opt.fn;
  });

  scrollChat();
  return div;
}

function addUser(text) {
  const chat = document.getElementById("chat");
  const div = document.createElement("div");
  div.className = "msg user-msg";
  div.innerHTML = `<div class="user-text">${text}</div>`;
  chat.appendChild(div);
  scrollChat();
}

function showTyping() {
  document.getElementById("typing").style.display = "flex";
  scrollChat();
}

function hideTyping() {
  document.getElementById("typing").style.display = "none";
}

function showInput() {
  document.getElementById("inputArea").style.display = "block";
  const input = document.getElementById("input");
  input.focus();
  scrollChat();
}

function hideInput() {
  document.getElementById("inputArea").style.display = "none";
}

function scrollChat() {
  const chat = document.getElementById("chat");
  setTimeout(() => (chat.scrollTop = chat.scrollHeight), 100);
}

// Auto-resize textarea e Inicializa Supabase
document.addEventListener("DOMContentLoaded", async () => {
  // ✅ PASSO 1: Obter o IP ANTES de qualquer coisa
  console.log("🔄 Iniciando aplicação...");
  await getUserIP();
  console.log("✅ IP capturado:", userIP);

  // PASSO 2: Auto-resize textarea
  const inp = document.getElementById("input");
  if (inp) {
    inp.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 120) + "px";
    });
  }

  // PASSO 3: Carrega Supabase dinamicamente
  try {
    if (!window.supabase) {
      console.log("📦 Carregando Supabase...");
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/dist/umd/supabase.min.js";

      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    // Inicializa o cliente Supabase
    const { createClient } = window.supabase;
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Supabase carregado com sucesso!");

    // PASSO 4: Verificar se existe inscrição após Supabase estar pronto
    checkExistingRegistration();
    console.log("✅ App pronta!");
  } catch (error) {
    console.error("❌ Erro ao carregar Supabase:", error);
    alert(
      "Erro ao carregar Supabase. Algumas funcionalidades podem não funcionar."
    );
  }
});

// ==================== ALTERNATIVA: Usar múltiplas APIs de IP ====================
// Se a primeira falhar, tentar outras
async function getUserIPWithFallback() {
  const ipAPIs = [
    "https://api.ipify.org?format=json",
    "https://ip-api.com/json/",
    "https://ipinfo.io/json",
  ];

  for (const apiUrl of ipAPIs) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Diferentes APIs retornam o IP em campos diferentes
      const ip =
        data.ip ||
        data.query ||
        data.ip_address ||
        data.ipAddress;

      if (ip && ip !== "unknown") {
        userIP = ip;
        console.log("✅ IP obtido de", apiUrl, ":", userIP);
        return;
      }
    } catch (error) {
      console.error("Falha em", apiUrl, ":", error.message);
      continue;
    }
  }

  // Se todas as APIs falharem
  userIP = "unknown";
  console.warn("⚠️ Não foi possível obter o IP. Usando 'unknown'");
}
