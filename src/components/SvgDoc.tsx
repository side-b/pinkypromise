// Note: this set of components is used to generate the visual
// representation of a promise as SVG or HTML. It serves both the
// React app and the Solidity contract, which requires to only use
// dynamic features (react app) in a way that is compatible with
// static features (solidity), e.g. by avoiding the css prop when
// "svg*" modes are used.
//
// The term “marker” is used to refer to search & replace markers used
// by the solidity generation script. These can be rendered without
// dangerouslySetInnerHTML since they are only marker placeholders that
// are going to get replaced at a later point.
//
// See scripts/codegen-PinkyPromiseSVg.sol.tsx for more context.

import type { ReactNode } from "react";
import type { Address, EnsName } from "../types";

import { createElement, useEffect, useMemo, useRef } from "react";
import { useEnsName } from "wagmi";
import { PLACEHOLDER_TITLE } from "../constants";
import { useBreakpoint, useExplorerBaseUrl } from "../lib/react-utils";
import { isAddress } from "../types";

const CONTENT_WIDTH = 720;
const MIN_HEIGHT_LARGE = 640;

export function SvgDoc({
  bodyHtml,
  classPrefix,
  color,
  contentColor,
  fingersMarker,
  height,
  mode = "svg",
  onHeight,
  padding = [40, 40, 32],
  promiseId,
  signedOn,
  signees,
  status,
  title,
}: {
  bodyHtml: string;
  classPrefix?: string;
  color: string;
  contentColor: string;

  // When set, acts as a marker that gets rendered instead of the fingers SVG code.
  fingersMarker?: string;

  height?: number | string;

  onHeight?: (height: number) => void;
  padding?: [top: number, side: number, bottom: number];
  promiseId: string;
  signedOn: string;

  mode?:
    | "svg"
    | "svg-main" // restrict to the content only (8 string vars limit in Solidity)
    | "svg-wrapper" // restrict to the wrapper only (8 string vars limit in Solidity)
    | "html"
    | "html-compact";

  // string type is used by
  // scripts/codegen-PinkyPromiseSVg.sol.tsx
  // to add a placeholder here
  signees: ReactNode | string;
  status: string;
  title: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  const htmlMode = mode.startsWith("html");
  const compact = mode === "html-compact";

  const [paddingTop, paddingSide, paddingBottom] = padding;

  height ??= CONTENT_WIDTH + paddingTop + paddingBottom;

  const docWidth = CONTENT_WIDTH + paddingSide * 2;

  const selector = classPrefix ? `.${classPrefix}` : "svg";

  const measureMode = Boolean(onHeight);

  useEffect(() => {
    if (onHeight) {
      onHeight(Math.max(
        800,
        paddingTop
          + 70 // header
          + (contentRef.current?.clientHeight ?? 0) // content
          + paddingBottom, // padding-bottom
      ));
    }
  }, [bodyHtml, onHeight, signees, title, paddingTop, paddingBottom]);

  const main = (
    <div className="main">
      <div className="header">
        <div>
          <div>Pinky Promise</div>
          <div>
            <strong>{promiseId}</strong>
          </div>
        </div>
        <div>
          <div>{signedOn || "−"}</div>
          <div>
            <strong>{status}</strong>
          </div>
        </div>
      </div>
      <div className="content" ref={contentRef}>
        <div className="title">{title || PLACEHOLDER_TITLE}</div>
        <div className="body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        <div className="signees">{signees}</div>
      </div>
    </div>
  );

  if (mode === "svg-main") {
    return main;
  }

  const style = svgDocStyle({
    color,
    contentColor,
    compact,
    fixedHeight: !measureMode && !htmlMode,
    htmlMode,
    paddingBottom,
    paddingSide,
    paddingTop,
    selector,
    height: htmlMode ? "auto" : `${height}px`,
  });

  const rootIn = (
    <>
      <style dangerouslySetInnerHTML={{ __html: style }} />
      {mode === "svg-wrapper" ? "_MAIN_" : main}
    </>
  );

  const root = htmlMode
    ? (
      <div className={classPrefix}>
        <div className="root">{rootIn}</div>
        <div
          css={{
            // we use css rather than a className because this only used by the app
            position: "absolute",
            left: "50%",
            bottom: "0",
            transform: "translateX(-50%)",
            svg: {
              display: "block",
            },
          }}
        >
          <SvgDocFingers
            color={contentColor}
            compact={compact}
          />
        </div>
      </div>
    )
    : (
      <svg
        className={classPrefix}
        height={height}
        viewBox={`0 0 ${docWidth} ${height}`}
        width={docWidth}
        xmlns="http://www.w3.org/2000/svg"
      >
        <foreignObject x="0" y="0" width={docWidth} height="100%">
          {createElement(
            "div",
            // The JSX type defs complain about xlmns, so we use createElement()
            { className: "root", xmlns: "http://www.w3.org/1999/xhtml" },
            rootIn,
          )}
        </foreignObject>
        {fingersMarker ?? (
          <SvgDocFingers
            color={contentColor}
            x={docWidth / 2 - 40}
            y={typeof height === "number" ? height - 40 - 72 : ""}
          />
        )}
      </svg>
    );

  return measureMode
    ? (
      <div
        css={{
          position: "fixed",
          top: "0",
          left: "0",
          zIndex: -1,
          overflow: "hidden",
          width: 0,
          height: 0,
        }}
      >
        {root}
      </div>
    )
    : root;
}

// Only used in HTML mode
export function SvgDocSignees({
  chainId,
  signees,
}: {
  chainId?: number;
  signees: Array<readonly [Address | EnsName, boolean | string]>;
}) {
  const explorerBaseUrl = useExplorerBaseUrl(chainId);
  const breakpoint = useBreakpoint();
  const small = breakpoint === "small";
  return (
    <div
      css={{
        ".signee a:focus-visible": {
          outline: "2px solid var(--contentColor)",
          outlineOffset: 4,
          borderRadius: 4,
        },
      }}
    >
      {signees.map(([signee, signState]) => (
        <SvgDocSigneeEns
          key={signee}
          address={signee}
          explorerBaseUrl={explorerBaseUrl}
          signature={signState === true
            ? <SvgDocSignature compact={small} />
            : <span className="signature">{signState}</span>}
        />
      ))}
    </div>
  );
}

export function SvgDocSignee({
  address,
  explorerBaseUrl,
  label,
  signature,
  title,
}: {
  // address could be any string and not only an Address:
  // it could be a placeholder (solidity codegen script)
  // or a demo-only ENS name (HomeIntro).
  address: string;
  explorerBaseUrl?: string;
  label?: string;
  signature: string | ReactNode;
  title?: string;
}) {
  label ??= address;
  return (
    <div className="signee">
      {explorerBaseUrl
        ? (
          <a
            className="account"
            href={`${explorerBaseUrl}/address/${address}`}
            rel="nofollow"
            target="_blank"
            title={title}
          >
            {label}
          </a>
        )
        : (
          <span title={title} className="account">
            {label}
          </span>
        )}
      {signature}
    </div>
  );
}

// SvgDocSignee, but it resolves ENS names
export function SvgDocSigneeEns({
  address,
  explorerBaseUrl,
  signature,
}: {
  address: Address | EnsName;
  explorerBaseUrl?: string;
  signature: string | ReactNode;
}) {
  const ensName = useEnsName({
    chainId: 1,
    address: isAddress(address) ? address : undefined,
  });
  const title = `${ensName.data ? `${ensName.data} − ` : ""}${address}`;
  const label = ensName.data ?? address;
  return (
    <SvgDocSignee
      address={address}
      explorerBaseUrl={explorerBaseUrl}
      signature={signature}
      title={title}
      label={label}
    />
  );
}

export function SvgDocSignature({ compact }: { compact?: boolean }) {
  return (
    <div className="signature">
      <div>
        <svg
          fill="none"
          height={compact ? 9 : 14}
          width={compact ? 24 : 38}
          viewBox="0 0 38 14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m.516 9.758-.118-1.05L0 6.592l.317-1.057.459-.302-.023-.314.201.197.224-.147 1.115.126.725.66.77 1.138L4.8 8.631l.594-1.26.697-1.308.538-.855.6-.799.667-.673.848-.551.843-.223.627.045.486.15.557.35.444.432.406.57.455.842.733 1.932.637 2.071 1.65-2.232 1.357-1.631.823-.781.892-.692.825-.485 1.017-.422.792-.204.797-.082 1.056.058.72.18.922.457.45.375.136-.183.957-1.182.527-.573.784-.68.754-.525.774-.379 1.071-.296.85-.077.689.047.808.169.76.257.702.357.762.532.577.487.555.622.841.062.757.669.237 1.004-.374.978-1.011.603-.38.18-.987-.038-.804-.74-.126-.528-.118-.341-.213-.334-.293-.338-.373-.302-.404-.262-.426-.193-.705-.2-.384-.044-.677.07-.65.204-.543.315-.574.478-.505.564-.553.772-.675 1.171-.716 1.52-.852.487-.903-.065-.726-.643-.194-.819.08-.576-.007-.017-.158-.224-.212-.156-.506-.196-.42-.046-.64.048-.69.19-.527.225-.636.378-.498.393-.657.62-.6.7-.717.944-2.322 3.489-.493.476-.756.385-.919-.138-.61-.558-.233-.448-1.077-3.74-.39-1.123-.315-.769-.478-.825-.067-.075-.115.041-.24.177L9 6.32l-.556.8-.42.757-.476.989-.965 2.266-.476.687-.768.502-1.017-.088-.71-.628-.18-.286-.068.2-.861.567-1-.074-.77-.681-.18-.766-.037-.807Z" />
        </svg>
      </div>
      <span>signed</span>
    </div>
  );
}

export function SvgDocFingers({
  color,
  compact,
  x,
  y,
}: {
  color: string;
  compact?: boolean;
  x?: number | string;
  y?: number | string;
}) {
  return (
    <svg
      fill={color}
      height={compact ? 40 : 80}
      width={compact ? 40 : 80}
      x={x}
      y={y}
      viewBox="0 0 80 80"
    >
      <path
        clipRule="evenodd"
        fillRule="evenodd"
        d="M44.356 79.302c-.333.036-.667.069-1.002.097-.068-.325-.14-.664-.218-1.019l-.358-1.673c-.55-2.578-1.086-5.083-1.77-7.584l-4.304 10.28c-11.142-.919-20.973-6.458-27.575-14.696l.025.032c.29-2.179.6-4.648.804-6.65.196-1.92.36-4.113.476-5.823a275.543 275.543 0 0 0 .17-2.727l.013-.219-.5-.028-.499-.027-.012.218-.036.608c-.03.52-.076 1.254-.134 2.107-.115 1.707-.279 3.887-.473 5.789a217.926 217.926 0 0 1-.67 5.638 39.357 39.357 0 0 1-7.83-23.204c1.295-.495 2.845-.514 4.04-.334.737.111 1.833.412 2.99 1.574 1.036 1.043 2.095 2.752 3.006 5.573a8.152 8.152 0 0 1 1.45-1.056c.794-.466 1.586-.894 2.472-1.128.9-.238 1.873-.27 3.038.014 1.163.283 1.815.69 2.32 1.228.234.248.43.517.618.777l.016.022c.197.272.399.548.66.842.343.385.62.936.857 1.614.24.684.449 1.533.637 2.544.375 2.023.673 4.743.937 8.193l.002.022v.023c-.011.791.05 2.064.267 3.287.108.611.253 1.198.442 1.7.1.264.207.496.322.692a88.67 88.67 0 0 0 4.222-5.644c1.701-2.482 3.272-5.098 3.986-7.1l.005-.013.006-.013c.219-.517.416-.987.595-1.417-.895-1.94-1.943-4.495-3.24-8.157-2.919-8.236-1.542-17.05-1.064-20.105.064-.416.113-.725.131-.912l.002-.013c.268-2.138 1.324-4.49 2.742-6.214 1.397-1.699 3.288-2.947 5.23-2.491.845.198 1.504.604 2.032 1.263.514.641.886 1.5 1.214 2.572.071.235.215.816.364 1.644a4.292 4.292 0 0 1 2.044-1.744c.83-.347 1.674-.417 2.17-.299.944.225 3.374 1.6 3.944 5.88.708 4.651 1.6 16.426-.79 26.789l-.007.031-.14.377.054.074.076.105c1.464 2.008 2.528 3.78 3.369 5.19l.023.038c.845 1.416 1.428 2.392 1.96 2.929.3.3.533.526.737.683.206.16.33.207.402.216.046.005.12.003.257-.104.153-.118.347-.338.6-.72.438-.66.544-1.046.71-1.653l.016-.055.033-.12c.206-.742.514-1.735 1.453-3.556 1.503-2.915 3.347-4.192 4.223-4.48a13.233 13.233 0 0 1 3.734-.93c.919-.08 1.904-.043 2.785.251a23.343 23.343 0 0 1 .914-3.083c.366-.974.846-2.017 1.458-2.929.61-.908 1.373-1.719 2.32-2.182 1.313-.643 2.457-.665 3.58-.547.353.038.693.086 1.033.135.587.084 1.172.167 1.82.191V40c0 .3-.004.597-.01.895-.737-.027-1.418-.124-2.04-.212-.318-.046-.621-.089-.907-.12-1.02-.107-1.955-.079-3.036.451-.73.357-1.373 1.013-1.93 1.842-.555.826-1.002 1.792-1.353 2.724a22.354 22.354 0 0 0-.935 3.237l-.012.056 4.44 5.33 1.966 2.767c-.163.342-.33.682-.503 1.018l-.915-1.286-.931-1.277-.015-.028-.07-.125-.326-.458-4.507-5.412c-.751-.352-1.714-.437-2.738-.346a12.228 12.228 0 0 0-3.453.863l-.022.01-.023.006c-.539.17-2.224 1.21-3.658 3.992-.905 1.756-1.19 2.684-1.379 3.366l-.017.062-.03.111c-.172.629-.313 1.144-.841 1.94-.274.414-.54.74-.82.958-.295.228-.625.35-.99.306-.34-.041-.637-.218-.895-.418a9.212 9.212 0 0 1-.833-.77c-.622-.625-1.258-1.691-2.036-2.995l-.098-.164c-.839-1.407-1.883-3.145-3.317-5.112-1.167-1.6-1.967-2.828-2.494-3.716-.494-.834-.765-1.396-.862-1.694-1.331-2.773-2.97-7.12-3.701-11.95-.305-2.01-.27-3.548-.178-5.056.017-.294.037-.585.057-.877.083-1.211.168-2.445.115-3.967-.104-3.032-.66-5.428-.802-5.895-.314-1.03-.642-1.745-1.038-2.238a2.503 2.503 0 0 0-1.39-.893c.044.684.03 1.572-.118 2.5-.195 1.222-.632 2.567-1.53 3.593-1.109 1.268-2.43 1.755-3.486 1.927a6.986 6.986 0 0 1-1.328.085c-.167-.005-.305-.014-.402-.02h-.008c-.027.195-.065.443-.11.737-.485 3.143-1.796 11.631 1.022 19.583 2.036 5.744 3.442 8.717 4.597 10.86a81.3 81.3 0 0 0 1.009 1.803c.731 1.28 1.415 2.477 2.152 4.19 2.655 5.585 3.777 10.843 4.943 16.307.119.557.238 1.117.36 1.679.086.396.166.774.242 1.133Zm-21.371-3.601c-.315-.15-.626-.304-.936-.462.409-2.361 1.142-5.996 2.02-8.649l.95.315c-.894 2.698-1.642 6.478-2.034 8.796Zm22.161-51.474c-.227-.863-.349-2.415-.248-5.545.142.026.308.068.486.132.55.196 1.229.606 1.735 1.48.25.433.456 1.057.62 1.782.162.719.274 1.503.353 2.234a32.714 32.714 0 0 1 .157 2.206 3.682 3.682 0 0 1-.851-.124c-.505-.134-.969-.367-1.266-.683-.086-.093-.175-.18-.253-.257l-.003-.003-.077-.076a3.028 3.028 0 0 1-.257-.282c-.142-.183-.28-.427-.396-.864Z"
      />
      <path d="M65.97 69.815c.252-.22.5-.441.746-.667a79.868 79.868 0 0 1-1.318-1.477c-1.017-1.176-2.06-2.593-2.853-3.722a72.259 72.259 0 0 1-1.228-1.808l-.07-.11-.018-.027-.006-.009-.841.541.007.01.019.03.035.054.037.058.275.415c.235.353.57.85.972 1.42.667.952 1.52 2.12 2.395 3.185-1.588.36-2.775.362-3.854-.006-1.258-.429-2.45-1.387-3.977-3.081l-.742.669c1.556 1.727 2.889 2.844 4.397 3.358 1.444.493 2.978.408 4.901-.087.346.395.73.822 1.124 1.254Z" />
    </svg>
  );
}

export function SvgDocTape({
  color,
  contentColor,
  height,
  mode,
  width,
}: {
  color: string;
  contentColor: string;
  height: number;
  mode: "broken" | "discarded";
  width: number;
}) {
  const background = useMemo(() => (
    mode === "discarded"
      ? discardedLabelUri(color)
      : brokenLabelUri(color)
  ), [color, mode]);
  return (
    <div
      css={{
        position: "absolute",
        top: -20,
        right: 0,
        width: Math.sqrt(width * width + height * height) + 40,
        height: 40,
        background: `${contentColor} url(${background}) repeat-x 0 50%`,
        transformOrigin: "100% 0",
        transform: `rotate3d(0, 0, 1, -${Math.atan(height / width)}rad)`,
      }}
    >
    </div>
  );
}

function brokenLabelUri(color: string) {
  return `data:image/svg+xml,${
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="126" height="20" fill="none"><path fill="${color}" d="M13.104 18v-2.784h2.208V3.984h-2.208V1.2h8.64c1.024 0 1.912.176 2.664.528.768.336 1.36.824 1.776 1.464.432.624.648 1.376.648 2.256v.24c0 .768-.144 1.4-.432 1.896-.288.48-.632.856-1.032 1.128-.384.256-.752.44-1.104.552v.432c.352.096.736.28 1.152.552.416.256.768.632 1.056 1.128.304.496.456 1.144.456 1.944v.24c0 .928-.216 1.728-.648 2.4-.432.656-1.032 1.16-1.8 1.512-.752.352-1.632.528-2.64.528h-8.736Zm5.376-2.88h2.976c.688 0 1.24-.168 1.656-.504.432-.336.648-.816.648-1.44v-.24c0-.624-.208-1.104-.624-1.44-.416-.336-.976-.504-1.68-.504H18.48v4.128Zm0-7.008h2.928c.656 0 1.192-.168 1.608-.504.432-.336.648-.8.648-1.392v-.24c0-.608-.208-1.072-.624-1.392-.416-.336-.96-.504-1.632-.504H18.48v4.032ZM31.442 18V1.2h7.295c1.056 0 1.977.184 2.76.552.785.368 1.392.888 1.825 1.56.431.672.647 1.464.647 2.376v.288c0 1.008-.24 1.824-.72 2.448a4.233 4.233 0 0 1-1.776 1.368v.432c.64.032 1.136.256 1.489.672.351.4.527.936.527 1.608V18h-3.167v-5.04c0-.384-.105-.696-.313-.936-.191-.24-.52-.36-.983-.36h-4.417V18h-3.168Zm3.167-9.216h3.792c.752 0 1.336-.2 1.752-.6.433-.416.648-.96.648-1.632v-.24c0-.672-.208-1.208-.623-1.608-.416-.416-1.008-.624-1.776-.624h-3.793v4.704ZM55.054 18.336c-2.112 0-3.792-.576-5.04-1.728-1.248-1.168-1.872-2.832-1.872-4.992V7.584c0-2.16.624-3.816 1.872-4.968 1.248-1.168 2.928-1.752 5.04-1.752s3.792.584 5.04 1.752c1.248 1.152 1.872 2.808 1.872 4.968v4.032c0 2.16-.624 3.824-1.872 4.992-1.248 1.152-2.928 1.728-5.04 1.728Zm0-2.832c1.184 0 2.104-.344 2.76-1.032.656-.688.984-1.608.984-2.76V7.488c0-1.152-.328-2.072-.984-2.76-.656-.688-1.576-1.032-2.76-1.032-1.168 0-2.088.344-2.76 1.032-.656.688-.984 1.608-.984 2.76v4.224c0 1.152.328 2.072.984 2.76.672.688 1.592 1.032 2.76 1.032ZM66.664 18V1.2h3.168v6.672h.432L75.712 1.2h4.056L72.76 9.48 80.008 18h-4.176l-5.568-6.816h-.432V18h-3.168ZM83.608 18V1.2h10.8v2.88h-7.632v4.008h6.96v2.88h-6.96v4.152h7.776V18H83.608ZM98.817 18V1.2h6.024l3.336 14.64h.432V1.2h3.12V18h-6.024l-3.336-14.64h-.432V18h-3.12Z"/></svg>`,
    )
  }`;
}

function discardedLabelUri(color: string) {
  return `data:image/svg+xml,${
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="168" height="20" fill="none"><path fill="${color}" d="M13.104 18.136v-2.784h2.208V4.12h-2.208V1.336h6.912c2.256 0 3.968.576 5.136 1.728 1.184 1.136 1.776 2.832 1.776 5.088v3.168c0 2.256-.592 3.96-1.776 5.112-1.168 1.136-2.88 1.704-5.136 1.704h-6.912Zm5.376-2.88h1.584c1.28 0 2.216-.336 2.808-1.008.592-.672.888-1.616.888-2.832v-3.36c0-1.232-.296-2.176-.888-2.832-.592-.672-1.528-1.008-2.808-1.008H18.48v11.04ZM31.488 18.136v-16.8h3.168v16.8h-3.168ZM45.569 18.472c-1.297 0-2.44-.232-3.433-.696-.992-.464-1.768-1.128-2.328-1.992-.56-.864-.84-1.904-.84-3.12v-.672h3.12v.672c0 1.008.313 1.768.937 2.28.623.496 1.471.744 2.544.744 1.087 0 1.895-.216 2.423-.648.544-.432.817-.984.817-1.656 0-.464-.136-.84-.408-1.128-.257-.288-.64-.52-1.153-.696a12.853 12.853 0 0 0-1.823-.528l-.552-.12c-1.152-.256-2.145-.576-2.976-.96-.816-.4-1.448-.92-1.896-1.56-.432-.64-.648-1.472-.648-2.496s.24-1.896.72-2.616c.495-.736 1.184-1.296 2.063-1.68.896-.4 1.944-.6 3.145-.6 1.2 0 2.264.208 3.191.624.944.4 1.68 1.008 2.209 1.824.544.8.816 1.808.816 3.024v.72h-3.12v-.72c0-.64-.129-1.152-.385-1.536-.24-.4-.591-.688-1.055-.864-.465-.192-1.017-.288-1.656-.288-.96 0-1.672.184-2.136.552-.449.352-.673.84-.673 1.464 0 .416.105.768.313 1.056.224.288.552.528.984.72.431.192.983.36 1.656.504l.552.12c1.2.256 2.24.584 3.12.984.895.4 1.591.928 2.087 1.584.497.656.745 1.496.745 2.52s-.265 1.928-.793 2.712c-.512.768-1.248 1.376-2.208 1.824-.944.432-2.063.648-3.36.648ZM62.595 18.472c-2.08 0-3.728-.576-4.944-1.728-1.216-1.168-1.824-2.832-1.824-4.992V7.72c0-2.16.608-3.816 1.824-4.968C58.867 1.584 60.515 1 62.595 1c2.064 0 3.656.568 4.776 1.704 1.136 1.12 1.704 2.664 1.704 4.632v.144h-3.12v-.24c0-.992-.28-1.808-.84-2.448-.544-.64-1.384-.96-2.52-.96-1.12 0-2 .344-2.64 1.032-.64.688-.96 1.624-.96 2.808V11.8c0 1.168.32 2.104.96 2.808.64.688 1.52 1.032 2.64 1.032 1.136 0 1.976-.32 2.52-.96.56-.656.84-1.472.84-2.448V11.8h3.12v.336c0 1.968-.568 3.52-1.704 4.656-1.12 1.12-2.712 1.68-4.776 1.68ZM72.237 18.136l4.416-16.8h5.52l4.416 16.8h-3.264l-.912-3.696h-6l-.912 3.696h-3.264Zm4.92-6.624h4.512l-2.04-8.184h-.432l-2.04 8.184ZM90.52 18.136v-16.8h7.296c1.056 0 1.976.184 2.76.552.784.368 1.392.888 1.824 1.56.432.672.648 1.464.648 2.376v.288c0 1.008-.24 1.824-.72 2.448a4.233 4.233 0 0 1-1.776 1.368v.432c.64.032 1.136.256 1.488.672.352.4.528.936.528 1.608v5.496H99.4v-5.04c0-.384-.104-.696-.312-.936-.192-.24-.52-.36-.984-.36h-4.416v6.336H90.52Zm3.168-9.216h3.792c.752 0 1.336-.2 1.752-.6.432-.416.648-.96.648-1.632v-.24c0-.672-.208-1.208-.624-1.608-.416-.416-1.008-.624-1.776-.624h-3.792V8.92ZM107.124 18.136v-2.784h2.208V4.12h-2.208V1.336h6.912c2.256 0 3.968.576 5.136 1.728 1.184 1.136 1.776 2.832 1.776 5.088v3.168c0 2.256-.592 3.96-1.776 5.112-1.168 1.136-2.88 1.704-5.136 1.704h-6.912Zm5.376-2.88h1.584c1.28 0 2.216-.336 2.808-1.008.592-.672.888-1.616.888-2.832v-3.36c0-1.232-.296-2.176-.888-2.832-.592-.672-1.528-1.008-2.808-1.008H112.5v11.04ZM125.508 18.136v-16.8h10.8v2.88h-7.632v4.008h6.96v2.88h-6.96v4.152h7.776v2.88h-10.944ZM140.237 18.136v-2.784h2.208V4.12h-2.208V1.336h6.912c2.256 0 3.968.576 5.136 1.728 1.184 1.136 1.776 2.832 1.776 5.088v3.168c0 2.256-.592 3.96-1.776 5.112-1.168 1.136-2.88 1.704-5.136 1.704h-6.912Zm5.376-2.88h1.584c1.28 0 2.216-.336 2.808-1.008.592-.672.888-1.616.888-2.832v-3.36c0-1.232-.296-2.176-.888-2.832-.592-.672-1.528-1.008-2.808-1.008h-1.584v11.04Z"/></svg>`,
    )
  }`;
}

function svgDocStyle({
  color,
  contentColor,
  compact,
  fixedHeight,
  height,
  htmlMode,
  paddingBottom,
  paddingSide,
  paddingTop,
  selector,
}: {
  color: string;
  contentColor: string;
  compact: boolean;
  fixedHeight: boolean;
  height: string;
  htmlMode: boolean;
  paddingBottom: number;
  paddingSide: number;
  paddingTop: number;
  selector: string;
}) {
  const fontStyle = htmlMode
    ? `
      font-size: ${compact ? "16px" : "20px"};
      font-weight: 300;
      line-height: 1.5;
    `
    : `
      font: 400 19px/28px "Courier New", monospace;
    `;

  return `
    ${selector} {
      --color: ${color};
      --contentColor: ${contentColor};
      contain: paint style${htmlMode ? "" : " size"};
    }
    ${selector} * {
      box-sizing: border-box;
      word-break: break-word;
    }
    ${selector} .root {
      height: ${height};
      padding: ${paddingTop}px ${paddingSide}px ${paddingBottom}px;
      ${fontStyle};
      color: var(--contentColor);
      background: var(--color);
    }
    ${selector} a {
      color: var(--contentColor);
      text-decoration: none;
    }
    ${selector} .main {
      display: flex;
      flex-direction: column;
      height: 100%;
      ${htmlMode ? `max-width: ${CONTENT_WIDTH}px;` : ""};
      ${htmlMode && !compact ? `min-height: ${MIN_HEIGHT_LARGE}px;` : ""}
    }
    ${selector} .header {
      flex-shrink: 0;
      flex-grow: 0;
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: ${htmlMode ? "auto" : "70px"};
      padding-bottom: 16px;
      font-size: ${compact ? 14 : 18}px;
      text-transform: uppercase;
      border-bottom: 2px solid var(--contentColor);
    }
    ${selector} .header > div + div {
      text-align: right;
    }
    ${selector} .header > div > div:nth-child(2) {
      ${compact ? "font-size: 18px;" : ""}
      ${compact ? "font-weight: 600;" : ""}
    }
    ${selector} .content {
      flex-grow: ${fixedHeight || htmlMode ? 1 : 0};
      display: flex;
      flex-direction: column;
      width: 100%;
      height: ${fixedHeight ? "100%" : "auto"};
    }
    ${selector} .title {
      padding-top: ${compact ? 16 : 40}px;
      flex-grow: 0;
      flex-shrink: 0;
      line-height: ${htmlMode ? 1.3 : "38px"};
      font-size: ${compact ? 20 : 32}px;
      font-weight: 400;
    }
    ${selector} .body {
      flex-grow: 1;
      flex-shrink: 0;
      overflow: hidden;
      padding-top: ${compact ? 8 : 24}px;
    }
    ${selector} .body p {
      margin: ${compact ? 8 : 24}px 0;
    }
    ${selector} .body p:first-child {
      margin-top: 0;
    }
    ${selector} .body h1 {
      margin: ${compact ? 8 : 32}px 0;
      padding-bottom: 5px;
      line-height: ${htmlMode ? "1.5" : "36px"};
      font-size: ${compact ? 18 : 26}px;
      font-weight: 400;
    }
    ${selector} .body h2 {
      margin: ${compact ? 8 : 24}px 0;
      line-height: ${htmlMode ? "1.5" : "32px"};
      font-size: ${compact ? 18 : 22}px;
      font-weight: 400;
    }
    ${selector} .signees {
      flex-grow: 0;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      padding-top: ${fixedHeight ? 0 : (htmlMode ? 20 : 40)}px;
      padding-bottom: ${compact ? 64 : 112}px;
    }
    ${selector} .signee {
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      ${compact ? "font-size: 18px;" : ""};
    }
    ${selector} .signee .account {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-decoration: none;
      outline: 0;
    }
    ${selector} .signature {
      flex-shrink: 0;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: flex-end;
      color: var(--contentColor);
      white-space: nowrap;
      font-weight: 500;
    }
    ${selector} .signature > div:first-child {
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${compact ? 40 : 50}px;
      height: ${compact ? 21 : 28}px;
      background: var(--contentColor);
      border-radius: 64px;
    }
    ${selector} .signature svg path {
      fill: var(--color);
    }
    ${selector} .signature b {
      color: var(--contentColor);
    }
  `
    .replace(/\n/g, "")
    .replace(/  /g, "");
}
