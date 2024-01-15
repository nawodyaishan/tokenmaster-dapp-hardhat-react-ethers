"use client"
import {
    createWeb3Modal,
    defaultWagmiConfig,
    useWeb3Modal,
    useWeb3ModalEvents,
    useWeb3ModalState,
    useWeb3ModalTheme
} from '@web3modal/wagmi/react'
import {WagmiConfig} from 'wagmi'
import {arbitrum, mainnet} from 'wagmi/chains'


const projectId = "Web3Modal"


// 2. Create wagmiConfig
const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({
    chains,
    projectId,
    metadata: {
        name: 'Web3Modal React Example'
    }
})

// 3. Create modal
createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    themeMode: 'light',
    themeVariables: {
        '--w3m-color-mix': '#00DCFF',
        '--w3m-color-mix-strength': 20
    }
})

export default function Home() {
    const modal = useWeb3Modal()
    const state = useWeb3ModalState()
    const {themeMode, themeVariables, setThemeMode} = useWeb3ModalTheme()
    const events = useWeb3ModalEvents()

    return (
        <WagmiConfig config={wagmiConfig}>
            <button onClick={() => modal.open()}>Connect Wallet</button>
        </WagmiConfig>
    )
}