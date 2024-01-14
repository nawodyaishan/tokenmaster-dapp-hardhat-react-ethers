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
    owner: HardhatEthersSigner
    otherAccount: HardhatEthersSigner
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
        tokenMasterFixture = {tokenMaster: tokenMaster, owner: owner, otherAccount: otherAccount};
    })

    describe("Deployment", async () => {
        it("Sets the Name", async function () {
            expect(await tokenMasterFixture.tokenMaster.name()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.name)
            expect(await tokenMasterFixture.tokenMaster.symbol()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.symbol)
        });
    });
});
