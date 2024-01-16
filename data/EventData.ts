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

export const eventsForDeployment: MockEvent[] = [
    {
        id: 1,
        name: "Blockchain & Brews Conference 2024",
        cost: ethers.parseUnits('1', 'ether'),
        maxTickets: 500,
        tickets: 150,
        date: "2024-06-15",
        time: "18:00",
        location: "Metaverse Arena"
    },
    {
        id: 2,
        name: "Global Tech Symposium 2024",
        cost: ethers.parseUnits('0.8', 'ether'),
        maxTickets: 300,
        tickets: 100,
        date: "2024-07-20",
        time: "09:00",
        location: "Innovation Hub"
    },
    {
        id: 3,
        name: "Virtual Reality Expo 2024",
        cost: ethers.parseUnits('1.2', 'ether'),
        maxTickets: 400,
        tickets: 200,
        date: "2024-08-05",
        time: "10:00",
        location: "VR Center"
    },
    {
        id: 4,
        name: "Future of AI Conference 2024",
        cost: ethers.parseUnits('1.5', 'ether'),
        maxTickets: 450,
        tickets: 225,
        date: "2024-09-15",
        time: "11:00",
        location: "AI Campus"
    },
    {
        id: 5,
        name: "Space Tech Summit 2024",
        cost: ethers.parseUnits('2', 'ether'),
        maxTickets: 350,
        tickets: 175,
        date: "2024-10-10",
        time: "14:00",
        location: "Orbital Center"
    },
    {
        id: 6,
        name: "Renewable Energy Forum 2024",
        cost: ethers.parseUnits('0.5', 'ether'),
        maxTickets: 250,
        tickets: 125,
        date: "2024-11-21",
        time: "16:00",
        location: "GreenTech Hub"
    }
];
