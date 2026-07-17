(function () {
  // ===== Helpers =====
  function qs(id) { return document.getElementById(id); }

  function setText(ids, value) {
    ids.map(qs).filter(Boolean).forEach(el => (el.textContent = value));
  }

  function setHref(ids, value) {
    ids.map(qs).filter(Boolean).forEach(el => (el.href = value));
  }

  function onlyDigits(s) {
    return String(s || "").replace(/\D/g, "");
  }

  // Formata BR: +55 (DD) 9XXXX-XXXX ou +55 (DD) XXXX-XXXX
  function formatBRFromE164(e164) {
    const d = onlyDigits(e164);
    // Esperado: 55 + DDD(2) + numero(8 ou 9)
    if (d.length < 12) return e164; // fallback (não quebra)
    const cc = d.slice(0, 2);
    const ddd = d.slice(2, 4);
    const num = d.slice(4);
    if (num.length === 9) {
      return `+${cc} (${ddd}) ${num.slice(0, 5)}-${num.slice(5)}`;
    }
    if (num.length === 8) {
      return `+${cc} (${ddd}) ${num.slice(0, 4)}-${num.slice(4)}`;
    }
    // Se vier diferente, tenta o melhor possível
    return `+${cc} (${ddd}) ${num}`;
  }

  function waUrl(phoneE164OrDigits, text) {
    // wa.me usa só dígitos (inclui 55)
    const phone = onlyDigits(phoneE164OrDigits);
    return `https://wa.me/${phone}?text=${encodeURIComponent(text || "")}`;
  }

  // ===== Config (edita aqui) =====
  const CONTACT = {
    whatsapp_e164: "+5535997625467",
    email: "custommind.softwaresolutions@gmail.com",
    instagram: "custommind.solutions",
    msg_default: "Oi! Vim pelo site da Custom Mind e queria falar sobre um projeto/solução.",
    msg_zuri: "Quero entender a Zuri e ver na minha conta.",
    msg_violet: "Quero uma Violet atendendo os clientes da minha empresa.",
    msg_loja: "Quero conhecer a Loja Inteligente e entender um projeto sob medida.",
    msg_sob_medida: "Tenho um problema específico e quero um software sob medida com a Custom Mind."
  };

  // ===== Ano =====
  const yearEl = qs("y");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===== Textos (WhatsApp / E-mail / Instagram) =====
  const waPretty = formatBRFromE164(CONTACT.whatsapp_e164);
  setText(["wa", "wa2"], waPretty);
  setText(["mail", "mail2"], CONTACT.email);
  const igEl = qs("ig");
  if (igEl) igEl.textContent = `@${CONTACT.instagram}`;

  // ===== Links WhatsApp (atualiza todos os botões) =====
  // Se algum deles não existir na página, ele ignora sem erro.
  setHref(["waLink", "waTop"], waUrl(CONTACT.whatsapp_e164, CONTACT.msg_default));
  setHref(["waZuri"], waUrl(CONTACT.whatsapp_e164, CONTACT.msg_zuri));
  setHref(["waViolet"], waUrl(CONTACT.whatsapp_e164, CONTACT.msg_violet));
  setHref(["waLoja"], waUrl(CONTACT.whatsapp_e164, CONTACT.msg_loja));
  setHref(["waSobMedida"], waUrl(CONTACT.whatsapp_e164, CONTACT.msg_sob_medida));

  // ===== Links Email =====
  const mailLink = qs("mailLink");
  if (mailLink) {
    const subject = "Contato — Custom Mind";
    const body = "Oi! Vim pelo site e queria falar sobre...";
    mailLink.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Inline IG link (se existir no HTML premium)
  const igLink = qs("igLink");
  if (igLink) igLink.href = `https://instagram.com/${CONTACT.instagram}`;

  const mailInline = qs("mailInline");
  if (mailInline) mailInline.href = `mailto:${CONTACT.email}`;
})();
