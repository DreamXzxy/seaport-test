const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  let sushiRouterAddr = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";
  let sushiFactoryAddr = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4";
  let wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab";
  const treasuryAddr = "0x0A93102beb63B08534421F4c3CF78c1e989E698C"

  // let sushiRouterAddr = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"; // ropsten
  // let sushiFactoryAddr = "0xc35DADB65012eC5796536bD9864eD8773aBc74C4"; // ropsten
  // let wethAddress = "0xc778417E063141139Fce010982780140Aa0cD5Ab"; // ropsten

  deployerAccount = await deployer.getAddress();
  console.log("Deploying account:", deployerAccount);
  console.log("Deploying account balance:", deployerAccount.toString(), "\n");

  const FlashBorrower = await ethers.getContractFactory("FlashBorrower");
  const flashBorrower = await FlashBorrower.deploy();
  await flashBorrower.deployed();
  console.log("flashBorrower: ", flashBorrower.address);

  // const Erc721 = await ethers.getContractFactory("ERC721");
  // nft = await Erc721.deploy("CryptoSloths", "CS");
  // await nft.deployed();
  // console.log("CryptoSloths NFT:", nft.address);

  const Doodles = await ethers.getContractFactory("Doodles");
  doodles = await Doodles.deploy();
  await doodles.deployed();
  console.log("Doodles NFT:", doodles.address);

  getDoodlesItem(1,1,1,doodles.address);
  getTestItemERC20(1000, 1000, alice.address);
  getTestItemERC20(100, 100, bob.address);

  const results = await createOrder(
    alice,
    constants.AddressZero, // zone
    offer,
    consideration,
    0, // FULL_OPEN
    [], // criteria
    null, // timeFlag
    alice, // signer
    constants.HashZero, // zoneHash
    constants.HashZero, // conduitKey
    true // extraCheap
  );
  order = results.order;
  orderHash = results.orderHash;

  // OrderStatus is not validated
  let orderStatus = await marketplaceContract.getOrderStatus(orderHash);

  // doodles whitelist setting
  await doodles.setAllowList([deployerAccount], 5);
  await doodles.setIsAllowListActive(true);

  await doodles.mintAllowList(5, {
    from: deployerAccount,
    value: ethers.utils.parseEther("0.615")
  });

  const Dooplicator = await ethers.getContractFactory("Dooplicator");
  dooplicator = await Dooplicator.deploy(doodles.address);
  await dooplicator.deployed();
  console.log("Dooplicator NFT:", dooplicator.address);

  // const numMints = 10;
  // for (let tokenId = 0; tokenId < numMints; tokenId++) {
  //   await nft.publicMint(flashBorrower.address, tokenId);
  // }
  // console.log("-- minted " + numMints + " CryptoSloths");

  const vaultFactory = await ethers.getContractAt(
    "NFTXVaultFactoryUpgradeable",
    "0xbbc53022Af15Bb973AD906577c84784c47C14371" //rinkeby
    // "0xfaB3a8739E9ED9D5aa3a43F4A8442610746b57E5" // ropsten
  );

  await vaultFactory.createVault("Doodles", "DOODLES", nfdoodlest.address, false, true);
  console.log("-- created vault");

  const numVaults = await vaultFactory.numVaults();
  const vaultId = numVaults.sub(1);
  const vaultAddr = await vaultFactory.vault(vaultId);
  const vault = await ethers.getContractAt("NFTXVaultUpgradeable", vaultAddr);

  await vault.setVaultFeatures(true, true, true, true, true);
  console.log("-- set vault features");

  await vault.setFees(0, 0, 0, 0, 0);
  console.log("-- set 0 fee");

  const tokenIds = [];
  const numLoops = 5;
  for (let i = 0; i < numLoops; i++) {
    const tokenId = i;
    // console.log(tokenId, "tokenId");
    await doodles.transferFrom(deployerAccount, flashBorrower.address, tokenId);
    // await doodles.connect(bob).approve(vaults[0].address, tokenId);
    tokenIds.push(tokenId);
  }
  doodles.setApprovalForAll(vaultAddr, true);

  // expect(await doodles.balanceOf(bob.address)).to.equal(numLoops);
  await vault.mint(
    tokenIds,
    tokenIds.map(() => 1)
  );

  await dooplicator.setClaimActive(true);

  // expect(await doodles.balanceOf(bob.address)).to.equal(0);
  // expect(await doodles.balanceOf(vaults[0].address)).to.equal(numLoops);
  // expect(await vaults[0].balanceOf(bob.address)).to.equal(BASE.mul(numLoops));

  // await vault.finalizeVault();
  // console.log("-- finalized vault");

  // nft.setApprovalForAll(vaultAddr, true);
  // console.log("-- set approval");

  await hre.run("verify:verify", {
    address: flashBorrower.address,
    constructorArguments: []
  });
}

main()
  .then(() => {
    console.log("\nDeployment completed successfully ✓");
    process.exit(0);
  })
  .catch((error) => {
    console.log("\nDeployment failed ✗");
    console.error(error);
    process.exit(1);
  });
