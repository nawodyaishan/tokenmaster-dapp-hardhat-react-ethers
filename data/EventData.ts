import {MockEvent} from "../interfaces/MockEvent";
import {ethers} from "hardhat";

export const exampleEvent: MockEvent = {
    id: 1,
    name: "Blockchain & Brews Conference 2024",
    cost: ethers.parseUnits('1', 'ether'),
    maxTickets: 500,
    tickets: 150,
    date: "2024-06-15",
    time: "18:00",
    location: "Metaverse Arena"
};