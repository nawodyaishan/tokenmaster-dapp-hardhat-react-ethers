import {ethers} from "hardhat";
import {expect} from "chai";
import {TokenMaster} from "../typechain-types";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";

export interface TokenMasterConstructorArgs {
    name: string
    symbol: string
}

export interface TokenMasterFixture {
    tokenMaster: TokenMaster
    deployer: HardhatEthersSigner
    buyer: HardhatEthersSigner
}

interface MockEvent {
    id: number;
    name: string;
    cost: number;
    maxTickets: number;
    tickets: number;
    date: string;
    time: string;
    location: string;
}

const exampleEvent: MockEvent = {
    id: 1,
    name: "Blockchain & Brews Conference 2024",
    cost: 5,
    maxTickets: 500,
    tickets: 150,
    date: "2024-06-15",
    time: "18:00",
    location: "Metaverse Arena"
};


const DEFAULT_CONTRACT_CONSTRUCTOR_ARGS: TokenMasterConstructorArgs = {name: "TokenMaster", symbol: "NAWO"}

describe("Token Master Unit Testing", async () => {
    let tokenMasterFixture: TokenMasterFixture

    beforeEach(async () => {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        const tokenMasterFactory = await ethers.getContractFactory("TokenMaster");
        const tokenMaster = await tokenMasterFactory.deploy(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.name, DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.symbol);
        // console.log("Name", tokenMaster.name)
        tokenMasterFixture = {tokenMaster: tokenMaster, deployer: owner, buyer: otherAccount};
    })

    describe("Deployment", async () => {
        it("Sets the Name", async () => {
            expect(await tokenMasterFixture.tokenMaster.name()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.name)
        });

        it("Sets the Symbol", async () => {
            expect(await tokenMasterFixture.tokenMaster.symbol()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.symbol)
        });

        it("Sets the Owner", async () => {
            expect(await tokenMasterFixture.tokenMaster.getOwner()).to.equal(tokenMasterFixture.deployer.address)
        });
    });

    describe("Events Interactions", async () => {
        it("Sets the Events", async () => {
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            expect(await tokenMasterFixture.tokenMaster.s_totalEvents()).to.be.equal(1)
        });
    });
});
