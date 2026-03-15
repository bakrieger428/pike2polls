import { ThemeProvider } from '@/components/theme';
import { Playfair_Display, Source_Sans_3 } from 'next/font/google';

// Rides to the Polls fonts
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
});

export default function RidesToThePollsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <div className={`${playfair.variable} ${sourceSans.variable}`}>
        {children}
      </div>
    </ThemeProvider>
  );
}
