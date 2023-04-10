# Pinky Promise

<img width="1440" alt="banner" src="https://user-images.githubusercontent.com/36158/230726389-c8bba5e8-88d5-4e26-8e17-9c9f35825b76.png">

Onchain accountability from jolly commitments between friends and foes.

## Build the Pinky Promise app

```sh
cp .env.sample .env   # 1. copy and fill the env vars
pnpm install          # 2. install the dependencies
pnpm export           # 3. build the app as static files
```

Alternatively:

```sh
pnpm dev              # 3. run the local dev server
```

## Build and deploy the contracts

```sh
cd contracts
./deploy.sh <network>
```

Where `<network>` is a supported network (run `./deploy.sh` without arguments to consult the list).

## Contract addresses

Addresses of the deployed contracts:

| Network  | Address                                    |
| -------- | ------------------------------------------ |
| Ethereum | 0xeFb7c8F4a52D6478e862821fD3017A98A7Ba6877 |
| Goerli   | 0x59D8A9f7bE3a6D498ca4dF7f67ff58fBC808e95F |
| Polygon  | 0xE66e42A4623706ca48f56b16EE505E3441b48049 |
