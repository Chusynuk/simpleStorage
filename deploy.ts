import ethers from 'ethers';
import * as fs from 'fs';
import "dotenv/config"

const main = async () => {
  //https://127.0.0.1:7545
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!)
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)

  // wallet = await wallet.connect(provider)

  const abi = fs.readFileSync(
    "./dist/SimpleStorage_sol_SimpleStorage.abi",
    "utf8"
  )
  const binary = fs.readFileSync(
    "./dist/SimpleStorage_sol_SimpleStorage.bin",
    "utf8"
  )
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)

  console.log("Deploying, please wait....")

  const contract = await contractFactory.deploy() // STOP here, wait our contract to deploy
  await contract.deployTransaction.wait(1)
  console.log(`Contract Address ${contract.address}`)

  const currentFavoriteNumber = await contract.retrieve()
  console.log(`Current favorite number ${currentFavoriteNumber.toString()}`)
  const transactionResponse = await contract.store("10")
  await contract.deployTransaction.wait(1)
  const updatedFavoriteNumber = await contract.retrieve()

  console.log(`Updated favorite number is: ${updatedFavoriteNumber}`)
}

main()
  .then(() => process?.exit(0))
  .catch((eror) => {
    console.error(eror)
    process.exit(1)
  })
