import {ethers} from "hardhat";
import {exampleEvent} from "../data/EventData";

async function main() {
    const tokenMasterFactory = await ethers.getContractFactory("TokenMaster");
    const tokenMaster = await tokenMasterFactory.deploy("TokenMaster", "TM");
    const deployedContract = await tokenMaster.waitForDeployment();

    console.log(
        `TokenMaster deployed to ${tokenMaster.target}`
    );

    await deployedContract.setEvent(exampleEvent.name, exampleEvent.cost, exampleEvent.maxTickets, exampleEvent.date, exampleEvent.time, exampleEvent.location)
    console.log((await deployedContract.m_events(1)).name)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
