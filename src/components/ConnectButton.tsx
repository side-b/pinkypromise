import type { ComponentPropsWithoutRef } from "react";
import type { Address } from "../types";

import { ConnectButton as RKConnectButton } from "@rainbow-me/rainbowkit";
import { COLORS } from "../constants";
import { isAddress, shortenAddress, shortNetworkName } from "../lib/utils";
import { Button } from "./Button";
import { DiscButton } from "./DiscButton";
import { EthIcon } from "./EthIcon";
import { IconWallet } from "./IconWallet";
import { SplitButton } from "./SplitButton";

export function ConnectButton(
  props:
    & Partial<ComponentPropsWithoutRef<typeof Button>>
    & { discMode?: boolean },
) {
  const { discMode, ...buttonProps } = props;
  return (
    <RKConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        if (!mounted) return null;

        if (!account || !chain) {
          return discMode
            ? (
              <DiscWalletButton
                onClick={openConnectModal}
                title="Connect"
              />
            )
            : (
              <Button
                color={COLORS.white}
                onClick={openConnectModal}
                label="Connect"
                {...buttonProps}
              />
            );
        }

        const { address } = account;

        if (chain.unsupported) {
          return discMode
            ? (
              <DiscWalletButton
                account={isAddress(address) ? address : undefined}
                error={true}
                onClick={openChainModal}
                title="Wrong network"
              />
            )
            : (
              <Button
                color={COLORS.white}
                onClick={openChainModal}
                label={
                  <DotLabel
                    dotColor={COLORS.red}
                    label="Wrong network"
                  />
                }
                {...buttonProps}
              />
            );
        }

        return discMode
          ? (
            <DiscWalletButton
              account={isAddress(address) ? address : undefined}
              onClick={openAccountModal}
              title={`Connected on ${chain.name} as ${address}`}
            />
          )
          : (
            <SplitButton
              first={{
                gap: 8,
                label: (
                  <DotLabel
                    dotColor={COLORS.green}
                    label={shortNetworkName(chain.id)}
                  />
                ),
                onClick: openChainModal,
                title: `Connected to ${chain.name}`,
              }}
              second={{
                label: shortenAddress(account.address),
                onClick: openAccountModal,
              }}
            />
          );
      }}
    </RKConnectButton.Custom>
  );
}

function DotLabel({
  dotColor,
  label,
}: {
  dotColor: string;
  label: string;
}) {
  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Dot color={dotColor} />
      {label}
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <div
      css={{
        width: 10,
        height: 10,
        background: color,
        border: `2px solid ${COLORS.white}`,
        borderRadius: "100%",
        transform: "translateY(1px)",
      }}
    />
  );
}

function DiscWalletButton(
  props:
    & Partial<ComponentPropsWithoutRef<typeof DiscButton>>
    & { account?: Address; error?: boolean },
) {
  return (
    <DiscButton
      title="Wallet"
      color={COLORS.white}
      icon={
        <div
          css={{
            position: "relative",
            flexShrink: 0,
            flexGrow: 0,
            width: 40,
            height: 40,
          }}
        >
          <div
            css={{
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
            }}
          >
            {props.account
              ? <EthIcon address={props.account} size={40} />
              : <IconWallet color={COLORS.pink} />}
          </div>
          {props.account && (
            <div css={{ position: "absolute", bottom: 0, right: 0 }}>
              <Dot color={props.error ? COLORS.red : COLORS.green} />
            </div>
          )}
        </div>
      }
      {...props}
    />
  );
}
