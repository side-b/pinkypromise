import type { Address } from "./types";

const PLACEHOLDERS: Array<{
  text: string;
  signees: Address[];
}> = [
  {
    text: `# Pact of the Norsemen

The Norsemen entering the pact of foster brotherhood (Icelandic: Fóstbræðralag)

## Article 1

involved a rite in which they let their blood flow while they ducked underneath an arch formed by a strip of turf propped up by a spear or spears. An example is described in Gísla saga.[1][2] In Fóstbræðra saga, the bond of Thorgeir Havarsson (Þorgeir Hávarsson) and Thormod Bersason (Þormóð Bersason) is sealed by such ritual as well, the ritual being called a leikr.[3]

## Article 2

Örvar-Oddr's saga contains another notable account of blood brotherhood. Örvar-Oddr, after fighting the renowned Swedish warrior Hjalmar to a draw, entered a foster brotherhood with him by the turf-raising ritual. Afterwards, the strand of turf was put back during oaths and incantations.[citation needed]

## Article 3

In the mythology of Northern Europe, Gunther and Högni became the blood brothers of Sigurd when he married their sister Gudrun. In Wagner's opera Götterdämmerung, the concluding part of his Ring Cycle, the same occurs between Gunther and Wagner's version of Sigurd, Siegfried, which is marked by the \"Blood Brotherhood Leitmotiv\". Additionally, it is briefly stated in Lokasenna that Odin and Loki are blood brothers.`,
    signees: [
      "0x7278aa3ddd389cc1e1d145cc4bafe595222280dd",
      "0x280dd7278aa3ddd389cc1e1d145cc4bafe595222",
    ],
  },
  {
    text: `Pinky, pinky bow-bell,
Whoever tells a lie
Will sink down to the bad place
And never rise up again.`,
    signees: [
      "0x22280dd7278aa3ddd389cc1e1d145cc4bafe5952",
      "0xc1e1d145cc4bafe595222280dd7278aa3ddd389c",
      "0x89cc1e1d145cc4bafe595222280dd7278aa3ddd3",
      "0xcc1e1d145cc4bafe595222280dd7278aa3ddd389",
    ],
  },
  {
    text:
      `Pinky swear, ten thousand punches, whoever lies will be made to swallow a thousand needles.`,
    signees: [
      "0xfe595222280dd7278aa3ddd389cc1e1d145cc4ba",
    ],
  },
];

export function placeholder() {
  return PLACEHOLDERS[1];
  // return PLACEHOLDERS[
  //   Math.floor(Math.random() * PLACEHOLDERS.length)
  // ];
}
