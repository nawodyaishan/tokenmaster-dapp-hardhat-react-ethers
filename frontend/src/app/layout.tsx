import '@rainbow-me/rainbowkit/styles.css';
import {Providers} from './providers';
import "./globals.css";

function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}

export default RootLayout;