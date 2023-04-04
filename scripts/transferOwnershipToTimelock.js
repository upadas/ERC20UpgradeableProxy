async function main() {
  const newOwnerOfTheProxyAdmin = "0xe0Ea7A063acB21112528ce5d1b85D8261E5849bb";
  // this will be the address of the TimeLock, as we need it to be the owner of the Proxy Admin.

  console.log("Transferring ownership of ProxyAdmin...");
  // The owner of the ProxyAdmin can upgrade our contracts

  await upgrades.admin.transferProxyAdminOwnership(newOwnerOfTheProxyAdmin);

  console.log(
    "Transferred ownership of ProxyAdmin to:",
    newOwnerOfTheProxyAdmin
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
