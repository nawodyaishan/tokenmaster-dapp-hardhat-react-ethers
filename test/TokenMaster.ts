import {ethers} from "hardhat";
import {expect} from "chai";

export interface tokenMasterConstructorArgs {
    name: string
    symbol: string
}

const DEFAULT_CONTRACT_CONSTRUCTOR_ARGS: tokenMasterConstructorArgs = {name: "TokenMaster", symbol: "NAWO"}

describe("Lock", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployTokenMasterFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const tokenMasterFactory = await ethers.getContractFactory("TokenMaster");
        const tokenMaster = await tokenMasterFactory.deploy(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.name, DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.symbol);
        console.log("Name", tokenMaster.name)
        return {tokenMaster, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Sets the Name", async function () {
            const {tokenMaster, owner, otherAccount} = await deployTokenMasterFixture();
            expect(await tokenMaster.name()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.name)
            expect(await tokenMaster.symbol()).to.equal(DEFAULT_CONTRACT_CONSTRUCTOR_ARGS.symbol)
        });
    });

    // describe("Withdrawals", function () {
    //     describe("Validations", function () {
    //         it("Should revert with the right error if called too soon", async function () {
    //             const {lock} = await loadFixture(deployOneYearLockFixture);
    //
    //             await expect(lock.withdraw()).to.be.revertedWith(
    //                 "You can't withdraw yet"
    //             );
    //         });
    //
    //         it("Should revert with the right error if called from another account", async function () {
    //             const {lock, unlockTime, otherAccount} = await loadFixture(
    //                 deployOneYearLockFixture
    //             );
    //
    //             // We can increase the time in Hardhat Network
    //             await time.increaseTo(unlockTime);
    //
    //             // We use lock.connect() to send a transaction from another account
    //             await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
    //                 "You aren't the owner"
    //             );
    //         });
    //
    //         it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
    //             const {lock, unlockTime} = await loadFixture(
    //                 deployOneYearLockFixture
    //             );
    //
    //             // Transactions are sent using the first signer by default
    //             await time.increaseTo(unlockTime);
    //
    //             await expect(lock.withdraw()).not.to.be.reverted;
    //         });
    //     });
    //
    //     describe("Events", function () {
    //         it("Should emit an event on withdrawals", async function () {
    //             const {lock, unlockTime, lockedAmount} = await loadFixture(
    //                 deployOneYearLockFixture
    //             );
    //
    //             await time.increaseTo(unlockTime);
    //
    //             await expect(lock.withdraw())
    //                 .to.emit(lock, "Withdrawal")
    //                 .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
    //         });
    //     });
    //
    //     describe("Transfers", function () {
    //         it("Should transfer the funds to the owner", async function () {
    //             const {lock, unlockTime, lockedAmount, owner} = await loadFixture(
    //                 deployOneYearLockFixture
    //             );
    //
    //             await time.increaseTo(unlockTime);
    //
    //             await expect(lock.withdraw()).to.changeEtherBalances(
    //                 [owner, lock],
    //                 [lockedAmount, -lockedAmount]
    //             );
    //         });
    //     });
    // });
});
