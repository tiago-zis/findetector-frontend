import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-xhr-backend";
import detector from "i18next-browser-languagedetector";

i18n.use(Backend)
    .use(detector)
    .use(initReactI18next)
    .init({
        supportedLngs: ["en", "pt_BR"],
        backend: {
            loadPath: "/locales/{{lng}}.json",
        },
        fallbackLng: ["pt_BR", "en"],
    });

export default i18n;
