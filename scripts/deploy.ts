import {ethers} from "hardhat";
import {eventsForDeployment} from "../data/EventData";

async function main() {
    const tokenMasterFactory = await ethers.getContractFactory("TokenMaster");
    const tokenMaster = await tokenMasterFactory.deploy("TokenMaster", "TM");
    const deployedContract = await tokenMaster.waitForDeployment();

    console.log(
        `TokenMaster deployed to ${tokenMaster.target}`
    );

    for (const event of eventsForDeployment) {
        await deployedContract.setEvent(event.name, event.cost, event.maxTickets, event.date, event.time, event.location)
        console.log((await deployedContract.m_events(event.id)).name)
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
