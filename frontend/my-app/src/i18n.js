// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Здесь накидываем ваши переводы «inline».
// Добавьте туда все ключи, которые вы используете через t('…')
const resources = {
  en: {
    translation: {
      autoLogout: "Auto‑logout (minutes)",
      timeFormat: "Time Format",
      font: "Font",
      language: "Language",
      fontSize: "Font Size",
      cancel: "No",
      confirm: "Yes",
      // … и т.д.
    },
  },
  ru: {
    translation: {
      autoLogout: "Авто‑выход (минут)",
      timeFormat: "Формат времени",
      font: "Шрифт",
      language: "Язык",
      fontSize: "Размер шрифта",
      cancel: "Нет",
      confirm: "Да",
      // …
    },
  },
  kz: {
    translation: {
      autoLogout: "Авто-шығу (минут)",
      timeFormat: "Уақыт форматы",
      font: "Шрифт",
      language: "Тіл",
      fontSize: "Шрифт өлшемі",
      cancel: "Жоқ",
      confirm: "Иә",
      // …
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  // стартовый язык
  lng: localStorage.getItem("settings")
    ? JSON.parse(localStorage.getItem("settings")).language
    : "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
