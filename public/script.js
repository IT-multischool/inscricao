// ==================== CONFIGURAÇÕES ====================
const WEBHOOK_URL = "http://192.168.1.2:5678/webhook/inscricao"; // SUBSTITUIR
const WEBHOOK_WHATSAPP = "https://seu-webhook.n8n.cloud/webhook/whatsapp-otp"; // SUBSTITUIR (para enviar OTP via WhatsApp/WAHA)
const WHATSAPP_COMMUNITY = "https://chat.whatsapp.com/GZpPv5O7lmL7UKxVFh1M7K"; // SUBSTITUIR
const WHATSAPP_SUPPORT = "https://wa.me/244931738075"; // Número de suporte
const CHATBOT_LINK = "https://seu-chatbot.com"; // Link do chatbot principal
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
  "Acordo",
  "Nome",
  "BI",
  "Idade",
  "Província",
  "Município",
  "Bairro",
  "Educação",
  "Telefone 1",
  "Telefone 2",
  "Email",
  "Motivação",
  "Referência",
  "Cursos",
  "Verificação",
  "Pagamento",
  "Horários",
  "Confirmação",
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
  "Bengo": ["Ambriz", "Bula Atumba", "Dande", "Dembos-Quibaxe", "Nambuangongo", "Pango Aluquém"],
  "Benguela": ["Balombo", "Baía Farta", "Benguela", "Bocoio", "Caimbambo", "Catumbela", "Chongorói", "Cubal", "Ganda", "Lobito"],
  "Bié": ["Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Cuíto", "N'harea"],
  "Cabinda": ["Belize", "Buco-Zau", "Cabinda", "Cacongo"],
  "Cuando-Cubango": ["Calai", "Cuangar", "Cuchi", "Cuito Cuanavale", "Dirico", "Mavinga", "Menongue", "Nancova", "Rivungo"],
  "Cuanza-Norte": ["Ambaca", "Banga", "Bolongongo", "Cambambe", "Cazengo", "Golungo Alto", "Gonguembo", "Lucala", "Quiculungo", "Samba Cajú"],
  "Cuanza-Sul": ["Amboim", "Cassongue", "Cela", "Conda", "Ebo", "Libolo", "Mussende", "Quibala", "Quilenda", "Seles", "Sumbe", "Waku Kungo"],
  "Cunene": ["Cahama", "Cuanhama", "Curoca", "Cuvelai", "Namacunde", "Ombadja"],
  "Huambo": ["Bailundo", "Caála", "Ekunha", "Huambo", "Katchiungo", "Londuimbale", "Longonjo", "Mungo", "Tchicala-Tcholoanga", "Tchindjenje", "Ucuma"],
  "Huíla": ["Caconda", "Caluquembe", "Chiange", "Chibia", "Chicomba", "Chipindo", "Gambos", "Humpata", "Jamba", "Kuvango", "Lubango", "Matala", "Quilengues", "Quipungo"],
  "Luanda": ["Belas", "Cacuaco", "Cazenga", "Icolo e Bengo", "Luanda", "Quilamba Quiaxi", "Quissama", "Talatona", "Viana"],
  "Lunda-Norte": ["Cambulo", "Capenda-Camulemba", "Caungula", "Chitato", "Cuango", "Cuilo", "Lóvua", "Lubalo", "Lucapa", "Xá-Muteba"],
  "Lunda-Sul": ["Cacolo", "Dala", "Muconda", "Saurimo"],
  "Malanje": ["Cacuso", "Calandula", "Cambundi-Catembo", "Cangandala", "Caombo", "Cunda-dia-baze", "Kivaba Nzogi", "Luquembo", "Malanje", "Marimba", "Massango", "Mucari", "Quela", "Quirima"],
  "Moxico": ["Alto Zambeze", "Camanongue", "Cameia", "Leua", "Luau", "Luena", "Luacano", "Lumbala Nguimbo", "Luchazes"],
  "Namibe": ["Bibala", "Camacuio", "Moçâmedes", "Tômbua", "Virei"],
  "Uíge": ["Ambuila", "Bembe", "Buengas", "Bungo", "Cangola", "Damba", "Maquela do Zombo", "Mucaba", "Negage", "Puri", "Quimbele", "Quitexe", "Santa Cruz", "Sanza Pombo", "Songo", "Uíge"],
  "Zaire": ["Cuimba", "M'Banza Kongo", "Noqui", "N'Zeto", "Soyo", "Tomboco"]
};

// ==================== INICIALIZAÇÃO ====================
window.onload = async function () {
  await getUserIP();
  checkExistingRegistration();
};

async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    userIP = data.ip;
  } catch (error) {
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
    document.getElementById("welcomeModal").style.display = "flex";
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
  const registration = localStorage.getItem("codestart_registration");
  if (registration) {
    const regData = JSON.parse(registration);
    if (regData.bi === bi) {
      data = regData;
      document.getElementById("searchView").style.display = "none";
      showDashboard();
      return;
    }
  }

  // Se não encontrar, tentar buscar no webhook (Google Sheets via n8n)
  try {
    const response = await fetch(`${WEBHOOK_URL}/search?bi=${bi}`);
    const result = await response.json();

    if (result.found) {
      data = result.data;
      localStorage.setItem("codestart_registration", JSON.stringify(data));
      document.getElementById("searchView").style.display = "none";
      showDashboard();
    } else {
      alert("Inscrição não encontrada.");
    }
  } catch (error) {
    alert("Erro ao buscar inscrição. Tente novamente.");
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
        `<strong>Code Start 2.0, Lda.</strong><br><br>
                📍 <strong>Localização:</strong><br>
                Rua Comandante Che Guevara, nº 45<br>
                Maianga, Luanda - Angola<br><br>
                📞 <strong>Contactos:</strong><br>
                Tel: +244 931 738 075<br>
                Email: info@codestart20.ao<br>
                Web: www.codestart20.ao<br><br>
                🆔 <strong>NIF:</strong> 5417258963<br><br>
                🕐 <strong>Horário:</strong><br>
                Seg-Sex: 8h às 17h<br>
                Sábados: 8h às 13h<br><br>
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
        addBot(`Ok! Tem <strong>email</strong>? (Digite ou "não")`);
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
          `Sem problema! 👍<br><br>Qual sua <strong>motivação</strong> para fazer este curso?`
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
          step = 15;
          updateProgress();
        } else {
          addBot("❌ Código incorreto. Tente novamente:");
        }
      } else {
        addBot("Digite o código de <strong>6 dígitos</strong>:");
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
            📧 <strong>info@codestart20.ao</strong><br><br>
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
    { id: "web", name: "Desenvolvimento Web", desc: "HTML, CSS, JavaScript"},
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
        `Cursos selecionados: <strong>${selected.join(
          ", "
        )}</strong> ✅<br><br>🔐 Vou enviar um <strong>código de verificação</strong>.<br><br>Para onde prefere receber?`,
        contactOptions
      );
      step = 14;
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
        message_body: `Code Start 2.0\n\nSeu código de verificação: ${data.otp}\n\nNão compartilhe este código.`,
      }),
    });

    const result = await response.json();
    hideTyping();

    if (result.success) {
      addBot(
        `✅ SMS enviado para <strong>${data.phone1}</strong>!<br><br>Digite o <strong>código de 6 dígitos</strong> que recebeu:`
      );
      showInput();
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


// ==================== SELEÇÃO DE PAGAMENTO ====================
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
      // Agora ir para seleção de horários em vez de confirmação direta
      hideInput();
      addBot(
        `Forma de pagamento selecionada: <strong>${
          type === "total" ? "Total" : "Parcelado"
        }</strong> ✅<br><br>🕐 Qual horário prefere para as aulas?`,
        [
          {
            text: '<i class="fas fa-clock"></i> Dias úteis 08-10h',
            fn: () => selectSchedule("Dias úteis 08-10h"),
          },
          {
            text: '<i class="fas fa-clock"></i> Dias úteis 10-12h',
            fn: () => selectSchedule("Dias úteis 10-12h"),
          },
          {
            text: '<i class="fas fa-clock"></i> Dias úteis 13-15h',
            fn: () => selectSchedule("Dias úteis 13-15h"),
          },
          {
            text: '<i class="fas fa-clock"></i> Dias úteis 15-17h',
            fn: () => selectSchedule("Dias úteis 15-17h"),
          },
          {
            text: '<i class="fas fa-clock"></i> Sábados 09-14h',
            fn: () => selectSchedule("Sábados 09-14h"),
          },
        ]
      );
      step = 16; // Horários
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
      const amount = data.paymentType === "total" ? pricing.final : Math.ceil(pricing.final / 2);
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

// ==================== FINALIZAR INSCRIÇÃO ====================
async function finalizeRegistration() {
  hideInput();
  showTyping();

  const ref = "CS" + Date.now().toString().slice(-8);
  const pricing = calculatePrice(data.courses.length);
  const amountNum = data.paymentType === "total" ? pricing.final : Math.ceil(pricing.final / 2);
  const amount = formatKz(amountNum);

  data.paymentRef = ref;
  data.paymentAmount = amount;
  data.registrationDate = new Date().toISOString();
  data.expiryDate = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString();
  data.status = "pending";
  data.attempts = 0;
  data.ip = userIP;

  // Salvar no localStorage
  localStorage.setItem("codestart_registration", JSON.stringify(data));

  // Enviar para webhook n8n (Google Sheets)
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("Erro ao enviar para webhook:", error);
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
  // Informações
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
        <p style="margin: 8px 0;"><strong>Horário:</strong> ${data.schedule || "Não selecionado"}</p>
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
                <i class="fas fa-redo"></i> Nova Tentativa (${
                  3 - data.attempts
                } restantes)
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

  // Design da fatura
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

  doc.setFont("helvetica", "bold");
  doc.text("DADOS DO FORMANDO", 20, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${data.name}`, 20, y);
  y += lineHeight;
  doc.text(`BI: ${data.bi}`, 20, y);
  y += lineHeight;
  doc.text(`Telefone: ${data.phone1}`, 20, y);
  y += lineHeight;
  doc.text(`Email: ${data.email || "Não informado"}`, 20, y);
  y += lineHeight;
  doc.text(
    `Localização: ${data.neighborhood}, ${data.municipality}, ${data.province}`,
    20,
    y
  );

  y += lineHeight + 5;
  doc.setFont("helvetica", "bold");
  doc.text("DADOS DA INSCRIÇÃO", 20, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.text(`Referência: ${data.paymentRef}`, 20, y);
  y += lineHeight;
  doc.text(`Cursos: ${data.courses.join(", ")}`, 20, y);
  y += lineHeight;
  doc.text(`Horário: ${data.schedule || "Não selecionado"}`, 20, y);
  y += lineHeight;
  doc.text(
    `Data: ${new Date(data.registrationDate).toLocaleString("pt-PT")}`,
    20,
    y
  );
  y += lineHeight;
  doc.text(`Nível Académico: ${data.education}`, 20, y);

  y += lineHeight + 5;
  doc.setFont("helvetica", "bold");
  doc.text("INFORMAÇÕES DE PAGAMENTO", 20, y);
  y += lineHeight + 2;

  doc.setFont("helvetica", "normal");
  doc.text(`Preço base: ${formatKz(pricing.total)}`, 20, y);
  y += lineHeight;

  if (pricing.discount > 0) {
    doc.text(`Desconto (20%): -${formatKz(pricing.discount)}`, 20, y);
    y += lineHeight;
  }
  doc.setFont("helvetica", "bold");
  doc.text(`Valor final: ${formatKz(pricing.final)}`, 20, y);
  y += lineHeight;
  doc.setFont("helvetica", "normal");
  doc.text(`Pago agora: ${data.paymentAmount}`, 20, y);
  y += lineHeight;

  doc.text(
    `Tipo: ${
      data.paymentType === "total" ? "Pagamento Total" : "Pagamento Parcelado"
    }`,
    20,
    y
  );
  y += lineHeight;
  doc.text(
    `Prazo: ${new Date(data.expiryDate).toLocaleString("pt-PT")}`,
    20,
    y
  );
  y += lineHeight;
  doc.text(
    `Status: ${
      data.status === "pending"
        ? "Pendente"
        : data.status === "completed"
        ? "Concluído"
        : "Anulado"
    }`,
    20,
    y
  );

  // Rodapé
  y = 270;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("Code Start 2.0, Lda. | NIF: 5417258963", 105, y, {
    align: "center",
  });
  y += 5;
  doc.text("Luanda, Angola | +244 931 738 075 | info@codestart20.ao", 105, y, {
    align: "center",
  });

  // Salvar
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
  window.open(`${WHATSAPP_SUPPORT}?text=Olá! Gostaria de solicitar ajuda em relação ao Code Start 2.0.`, "_blank");
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
  document.getElementById("input").focus();
}

function hideInput() {
  document.getElementById("inputArea").style.display = "none";
}

function scrollChat() {
  const chat = document.getElementById("chat");
  setTimeout(() => (chat.scrollTop = chat.scrollHeight), 100);
}

// Auto-resize textarea
document.addEventListener("DOMContentLoaded", () => {
  const inp = document.getElementById("input");
  if (inp) {
    inp.addEventListener("input", function () {
      this.style.height = "auto";
      this.style.height = Math.min(this.scrollHeight, 120) + "px";
    });
  }
});