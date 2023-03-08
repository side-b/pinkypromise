# Pinky Promise

On-chain accountability from jolly commitments between friends and foes.

## Build the Pinky Promise app

```sh
pnpm install          # 1. install the dependencies
cp .env.sample .env   # 2. copy and fill the env vars
pnpm build            # 3. build the app in dist/
```

## Build and deploy the contracts

```sh
cd contracts
./deploy.sh <network>
```

Where `<network>` is a supported network (run `./deploy.sh` to consult the list).

## Contract addresses

Addresses of the deployed contracts:

| Network  | Address |
| -------- | ------- |
| Ethereum | 0x      |
| Arbitrum | 0x      |
| Base     | 0x      |
| Goerli   | 0x      |
| Optimism | 0x      |
| Polygon  | 0x      |
