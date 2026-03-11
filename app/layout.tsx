import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';
import { adminPrisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'CSIR-SERC Recruitment Portal',
  description: 'CSIR-SERC Recruitment Portal',
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const logoSetting = await adminPrisma.setting.findUnique({
    where: { key: "portal_logo" }
  });

  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar logoUrl={logoSetting?.value || null} />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
