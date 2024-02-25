import { Inter } from "next/font/google";
import Head from "next/head"; // Import the Head component
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";

const inter = Inter({ subsets: ["latin"] });
config.autoAddCss = false; /* eslint-disable import/first */

export const metadata = {
    title: "HealthBlocks",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <Head>
                <title>{metadata.title}</title>
                <meta name="description" content={metadata.description} />
                <link
                    rel="icon"
                    href="/images/main_logo.png"
                    type="image/png"
                />
            </Head>
            <body className={inter.className}>{children}</body>
        </html>
    );
}
