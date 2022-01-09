import { Conference } from "./../frontend/src/hardhat/typechain/Conference.d";
import { deployments, ethers } from "hardhat";
import { Contract, Signer, Wallet } from "ethers";
import { assert, expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("Token", function () {
  let accounts: SignerWithAddress[];
  let conferenceOwner: SignerWithAddress;
  let speaker1: SignerWithAddress;
  let speaker2: SignerWithAddress;
  let attendee1: SignerWithAddress;
  let attendee2: SignerWithAddress;

  let conference: Conference;

  beforeEach(async function () {
    accounts = await ethers.getSigners();
    conferenceOwner = accounts[0];
    speaker1 = accounts[1];
    speaker2 = accounts[2];
    attendee1 = accounts[3];
    attendee2 = accounts[4];

    const contract = await ethers.getContractFactory("Conference");
    conference = (await contract.deploy(1, [], 2)) as Conference;
  });

  it("should have accounts", async function () {
    assert(accounts.length > 0, "Account legth should be more then zero");
  });

  describe("when conference is deployed", async function () {
    it("should have an address", async function () {
      assert(conference.address != "0");
    });

    it("should have an owner which is the deployer", async function () {
      const owner = await conference._conferenceOwner();
      const ownerAddress = await conferenceOwner.getAddress();

      assert(owner === ownerAddress);
    });

    it("should have a balance of 0 ETH", async () => {
      const balance = await ethers.provider.getBalance(conference.address);
      expect(ethers.utils.formatEther(balance)).to.be.equal("0.0");
    });

    it("should be open for registration", async () => {
      const isOpen = await conference._openForRegistration();
      assert(isOpen);
    });

    describe("when account is not authed", async () => {
      it("shuold fail with revert when buying ticket", async () => {
        await expect(conference.buyTicket()).to.revertedWith("Not authed");
      });

      it("should fail and revert when register as speaker", async () => {
        await expect(
          conference.connect(attendee1).registerAsSpeaker()
        ).to.revertedWith("Not authed");
        expect(await conference.connect(speaker1).isSpeaker()).to.be.false;
      });

      it("should be possible to recieve a ticket from conference owner", async () => {
        expect(await conference.connect(attendee1).hasTicket()).to.be.false;
        await conference.connect(conferenceOwner).giveTicket(attendee1.address);
        expect(await conference.connect(attendee1).hasTicket()).to.be.true;
      });

      it("should not be possible to register as speaker", async () => {
        expect(await conference.connect(speaker1).isSpeaker()).to.be.false;
        await expect(
          conference.connect(speaker1).registerAsSpeaker()
        ).to.be.revertedWith("Not authed");
        expect(await conference.connect(speaker1).isSpeaker()).to.be.false;
      });
    });
  });
});
