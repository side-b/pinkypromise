# Pinky Promise

Onchain accountability from jolly commitments between friends and foes.

## Build the Pinky Promise app

```sh
cp .env.sample .env   # 1. copy and fill the env vars
pnpm install          # 2. install the dependencies
pnpm export           # 3. build the app as static files
```

## Build and deploy the contracts

```sh
cd contracts
./deploy.sh <network>
```

Where `<network>` is a supported network (run `./deploy.sh` without arguments to consult the list).

## Contract addresses

Addresses of the deployed contracts:

| Network  | Address |
| -------- | ------- |
| Ethereum | 0x      |
| Goerli   | 0x      |
| Polygon  | 0x      |
