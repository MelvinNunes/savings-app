'use client';

import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

export default function I18nProvider({
    children,
    i18n
}: {
    children: React.ReactNode;
    i18n: typeof i18next;
}) {
    return (
        <I18nextProvider i18n={i18n}>
            {children}
        </I18nextProvider>
    );
}