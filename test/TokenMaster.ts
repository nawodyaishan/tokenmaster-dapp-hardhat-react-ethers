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
    cost: bigint;
    maxTickets: number;
    tickets: number;
    date: string;
    time: string;
    location: string;
}

const exampleEvent: MockEvent = {
    id: 1,
    name: "Blockchain & Brews Conference 2024",
    cost: ethers.parseUnits('1', 'ether'),
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
        it("✅ - Sets the Name", async () => {
            expect(await tokenMasterFixture.tokenMaster.name()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.name)
        });

        it("✅ - Sets the Symbol", async () => {
            expect(await tokenMasterFixture.tokenMaster.symbol()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.symbol)
        });

        it("✅ - Sets the Owner", async () => {
            expect(await tokenMasterFixture.tokenMaster.owner()).to.equal(tokenMasterFixture.deployer.address)
        });
    });

    describe("Events Interactions", async () => {
        it("✅ - Sets the Events - as owner", async () => {
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            expect(await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.deployer).s_totalEvents()).to.be.equal(1)
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            expect(await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.deployer).s_totalEvents()).to.be.equal(2)
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            expect(await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.deployer).s_totalEvents()).to.be.equal(3)
        });

        it("🟥 - Sets the Events Failure - as a other address", async () => {
            await expect(tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.buyer)
                .setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location))
                .to.be.revertedWithCustomError(tokenMasterFixture.tokenMaster, "OwnableUnauthorizedAccount");
            expect(await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.deployer).s_totalEvents()).to.be.equal(0)
        });

        it("✅ - Gets the exact Event from Id", async () => {
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            expect(await tokenMasterFixture.tokenMaster.s_totalEvents()).to.be.equal(3)

            const event = (await tokenMasterFixture.tokenMaster.getEventFromId(1))
            expect(event.id).to.be.equal(exampleEvent.id)
            expect(event.name).to.be.equal(exampleEvent.name)
            expect(event.date).to.be.equal(exampleEvent.date)
            expect(event.cost).to.be.equal(exampleEvent.cost)
        });
    });

    describe("Minting Interactions", async () => {
        const ID = 1
        const SEAT = 50
        const AMOUNT = ethers.parseUnits('1', 'ether')

        beforeEach(async () => {
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            expect(await tokenMasterFixture.tokenMaster.s_totalEvents()).to.be.equal(3)
        })


        it("✅ - Minting a event ticket - as buyer", async () => {
            await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.buyer).mint(ID, SEAT, {value: AMOUNT})
            expect(await tokenMasterFixture.tokenMaster.s_totalSupply()).to.be.equal(1)
        });
    })

});
