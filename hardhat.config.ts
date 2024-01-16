import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import {EnvUtils} from "./utils/envUtils";

dotenv.config();

// Check required environment variables
EnvUtils.checkEnvVariables([
    "INFURA_API_KEY",
    "SEPOLIA_RPC_URL",
    "AVALANCHE_FUJI_RPC_URL",
    "PRIVATE_KEY",
    "ETHERSCAN_API_KEY"
]);

// Accessing Environment variables
const INFURA_API_KEY = process.env.INFURA_API_KEY!
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL!
const PRIVATE_KEY = process.env.PRIVATE_KEY!
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!
const deployedVerifiedContractAddress = "0x1f8800bcfaD9b4ab1eFe3e0c50bD455270471041"

const config: HardhatUserConfig = {
    solidity: "0.8.20",
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    networks: {
        hardhat: {},
        sepolia: {
            url: SEPOLIA_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 11155111
        }
    }
};

export default config;
