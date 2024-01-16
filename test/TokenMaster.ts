import {ethers} from "hardhat";
import {describe} from "mocha"
import {expect} from "chai";
import {TokenMaster} from "../typechain-types";
import {HardhatEthersSigner} from "@nomicfoundation/hardhat-ethers/signers";
import {exampleEvent} from "../data/EventData";

export interface TokenMasterConstructorArgs {
    name: string
    symbol: string
}

export interface TokenMasterFixture {
    tokenMaster: TokenMaster
    deployer: HardhatEthersSigner
    buyer: HardhatEthersSigner
}

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
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name,
                exampleEvent.cost,
                exampleEvent.maxTickets,
                exampleEvent.date,
                exampleEvent.time,
                exampleEvent.location);
            await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.buyer).mint(ID, SEAT, {value: AMOUNT})
        })

        it("✅ - Minting a event ticket - total supply", async () => {
            expect(await tokenMasterFixture.tokenMaster.s_totalSupply()).to.be.equal(1)
        });

        it("✅ - Minting a event ticket - Tickets count", async () => {
            expect((await tokenMasterFixture.tokenMaster.getEventFromId(1)).tickets).to.be.equal(exampleEvent.maxTickets - 1)
        });

        it("✅ - Buying Status", async () => {
            expect(await tokenMasterFixture.tokenMaster.m_hasPurchasedEventTicket(ID, tokenMasterFixture.buyer.address)).to.be.equal(true)
        });

        it("✅ - Seat Availability", async () => {
            expect((await tokenMasterFixture.tokenMaster.getSeatsTakenFromId(ID))[0]).to.be.equal(SEAT)
            expect((await tokenMasterFixture.tokenMaster.getSeatsTakenFromId(ID)).length).to.be.equal(1)
        });

        it("✅ - Seat Taken by buyer", async () => {
            expect(await tokenMasterFixture.tokenMaster.m_seats(ID, SEAT)).to.be.equal(tokenMasterFixture.buyer.address)
        });

        it("✅ - Update contract balance", async () => {
            expect(await ethers.provider.getBalance(await tokenMasterFixture.tokenMaster.getAddress())).to.be.equal(AMOUNT)
        });

        it("🟥 - Should fail if the event ID does not exist", async () => {
            const nonExistentEventId = 999;
            const seatNumber = 1;
            const ticketPrice = ethers.parseEther("0.1");
            await expect(
                tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.buyer).mint(nonExistentEventId, seatNumber, {value: ticketPrice})
            ).to.be.revertedWithCustomError(tokenMasterFixture.tokenMaster, "EventDoesNotExist");
        });

        it("🟥 - Should fail if the seat number is invalid", async () => {
            const eventId = 1;
            const invalidSeatNumber = 501;
            const ticketPrice = ethers.parseEther("0.1");
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location);
            await expect(
                tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.buyer).mint(eventId, invalidSeatNumber, {value: ticketPrice})
            ).to.be.revertedWithCustomError(tokenMasterFixture.tokenMaster, "InvalidSeatNumber");
        })

        it("🟥 - Should fail if the seat has already been taken", async () => {
            const eventId = 1;
            const seatNumber = 50;
            const ticketPrice = ethers.parseEther("0.1");
            await expect(
                tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.deployer).mint(eventId, seatNumber, {value: ticketPrice})
            ).to.be.revertedWithCustomError(tokenMasterFixture.tokenMaster, "SeatAlreadyTaken");
        });
    })

    describe("Withdrawal Interactions", async () => {
        const ID = 1
        const SEAT = 50
        const AMOUNT = ethers.parseUnits('1', 'ether')

        beforeEach(async () => {
            await tokenMasterFixture.tokenMaster.setEvent(exampleEvent.name,
                exampleEvent.cost,
                exampleEvent.maxTickets,
                exampleEvent.date,
                exampleEvent.time,
                exampleEvent.location);
            await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.buyer).mint(ID, SEAT, {value: AMOUNT})
        })

        it("✅ - Should allow the owner to withdraw funds", async () => {
            const initialOwnerBalance = await ethers.provider.getBalance(tokenMasterFixture.deployer.address);
            const contractBalance = await ethers.provider.getBalance(await tokenMasterFixture.tokenMaster.getAddress());
            const tx = await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.deployer).withdraw();
            const receipt = (await tx.wait())!;
            const totalGasExpended = receipt.gasUsed * receipt.gasPrice;
            const finalOwnerBalance = await ethers.provider.getBalance(tokenMasterFixture.deployer.address);
            expect(finalOwnerBalance.toString()).to.equal(((initialOwnerBalance + contractBalance) - (totalGasExpended)).toString());
        });

        it("🟥 - Should fail when a non-owner tries to withdraw funds", async () => {
            await expect(
                tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.buyer).withdraw()
            ).to.be.revertedWithCustomError(tokenMasterFixture.tokenMaster, "OwnableUnauthorizedAccount");
        });

        it("✅ - Should empty the contract balance after a successful withdrawal", async () => {
            await tokenMasterFixture.tokenMaster.connect(tokenMasterFixture.deployer).withdraw();
            const newContractBalance = await ethers.provider.getBalance(await tokenMasterFixture.tokenMaster.getAddress());
            expect(newContractBalance).to.equal(0);
        });
    });
});
