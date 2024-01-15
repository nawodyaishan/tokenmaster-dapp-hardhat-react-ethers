import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import {createConfig, WagmiConfig} from 'wagmi';
import {arbitrum, mainnet, optimism, polygon} from 'wagmi/chains';
import {ConnectKitProvider, getDefaultConfig} from 'connectkit';

const config = createConfig(
    getDefaultConfig({
        appName: 'ConnectKit Vite demo',
        //infuraId: import.meta.env.VITE_INFURA_ID,
        //alchemyId:  import.meta.env.VITE_ALCHEMY_ID,
        chains: [mainnet, polygon, optimism, arbitrum],
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
    })
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <WagmiConfig config={config}>
            <ConnectKitProvider debugMode>
                <App/>
            </ConnectKitProvider>
        </WagmiConfig>
    </React.StrictMode>
    ,
)
