import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

// Accessing Environment variables
const INFURA_API_KEY = process.env.INFURA_API_KEY
if (!INFURA_API_KEY) throw new Error("Environment variable INFURA_API_KEY is not set!")

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL
if (!SEPOLIA_RPC_URL) throw new Error("Environment variable SEPOLIA_RPC_URL is not set!")

const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL
if (!AVALANCHE_FUJI_RPC_URL) throw new Error("Environment variable AVALANCHE_FUJI_RPC_URL is not set!")

const PRIVATE_KEY = process.env.PRIVATE_KEY
if (!PRIVATE_KEY) throw new Error("Environment variable PRIVATE_KEY is not set!")


const config: HardhatUserConfig = {
    solidity: "0.8.20",
    networks: {
        hardhat: {},
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111
        },
    }
};

export default config;
