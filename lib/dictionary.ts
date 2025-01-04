import { useEffect, useState } from "react";

const dictionaries = {
  en: () => import("@/lang/en.json").then((module) => module.default),
  pt: () => import("@/lang/pt.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const validLocale = ["en", "pt"].includes(locale) ? locale : "pt";
  return dictionaries[validLocale as keyof typeof dictionaries]();
};

type SupportedLocale = "en" | "pt";

const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "pt"];
const DEFAULT_LOCALE: SupportedLocale = "pt";

export function useLocalization(lang: string) {
  const [dictionary, setDictionary] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const validLocale = SUPPORTED_LOCALES.includes(lang as SupportedLocale)
          ? (lang as SupportedLocale)
          : DEFAULT_LOCALE;
        const dict =
          await dictionaries[validLocale as keyof typeof dictionaries]();
        setDictionary(dict);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load dictionary")
        );
        console.error("Failed to load dictionary:", err);
      }
    };

    loadDictionary();
  }, [lang]);

  return { dictionary, error };
}
