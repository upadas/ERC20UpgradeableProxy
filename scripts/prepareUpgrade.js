async function main() {
  const proxyAddress = "0x461379B07e26858c101d98dc49c9122041C32a02"; // This is the proxy address NOT the admin of the proxy.

  const ERC20TokenV2 = await ethers.getContractFactory("ERC20TokenV2");
  console.log("Preparing upgrade...");
  const erc20TokenV2 = await upgrades.prepareUpgrade(
    proxyAddress,
    ERC20TokenV2
  );
  console.log("ERC20TokenV2 at:", erc20TokenV2);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
