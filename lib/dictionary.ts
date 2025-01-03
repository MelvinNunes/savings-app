import "server-only";

const dictionaries = {
  en: () => import("@/lang/en.json").then((module) => module.default),
  pt: () => import("@/lang/pt.json").then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
  const validLocale = ["en", "pt"].includes(locale) ? locale : "pt";
  return dictionaries[validLocale as keyof typeof dictionaries]();
};
