'use client';

import * as React from 'react';
import {connectorsForWallets, getDefaultWallets, RainbowKitProvider,} from '@rainbow-me/rainbowkit';
import {argentWallet, ledgerWallet, trustWallet,} from '@rainbow-me/rainbowkit/wallets';
import {configureChains, createConfig, WagmiConfig} from 'wagmi';
import {publicProvider} from 'wagmi/providers/public';
import {avalanche, avalancheFuji, mainnet, sepolia,} from 'wagmi/chains';

const {chains, publicClient, webSocketPublicClient} = configureChains(
    [
        mainnet,
        avalanche,
        avalancheFuji,
        sepolia,
        ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    ],
    [publicProvider()]
);

const projectId = 'YOUR_PROJECT_ID';

const {wallets} = getDefaultWallets({
    appName: 'RainbowKit demo',
    projectId,
    chains,
});

const demoAppInfo = {
    appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [
            argentWallet({projectId, chains}),
            trustWallet({projectId, chains}),
            ledgerWallet({projectId, chains}),
        ],
    },
]);

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
});

export function Providers({children}: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
                {mounted && children}
            </RainbowKitProvider>
        </WagmiConfig>
    );
}