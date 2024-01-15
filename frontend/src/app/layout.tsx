import {Web3Modal} from "@/components/ui/Web3Modal";
import "./globals.css";


export const metadata = {
    title: "Web3Modal",
    description: "Web3Modal Example",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Web3Modal>{children}</Web3Modal>
        </body>
        </html>
    );
}