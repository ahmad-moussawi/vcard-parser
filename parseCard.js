import qp from "quoted-printable";
import utf8 from "utf8";
import { groupBy, mapValues, uniq, uniqBy } from "lodash-es";
export const PROP_RE = /^[^:\n]+:/gm;

/**
 *
 * @param {string} text
 */
export function parseCard(text, includeOriginal = false) {
  const tokens = [];

  if (includeOriginal) {
    tokens.push({ prop: "RAW", value: text });
  }

  const matches = text.matchAll(PROP_RE);
  const idx = [];
  for (let m of matches) {
    idx.push([m[0], m.index, m.index + m[0].length]);
  }

  for (let i = 0; i < idx.length; i++) {
    const key = text.substring(idx[i][1], idx[i][2] - 1);
    const value = text
      .substring(idx[i][2], i === idx.length - 1 ? undefined : idx[i + 1][1])
      .trim();

    const [prop, ...meta] = key.split(";");

    tokens.push({
      prop,
      meta: meta.length ? meta : undefined,
      value: meta.includes("ENCODING=QUOTED-PRINTABLE")
        ? utf8.decode(qp.decode(value))
        : value,
    });
  }

  return mapValues(
    groupBy(tokens, (e) => e.prop),
    (arr) => {
      return uniqBy(
        arr.map((x) => {
          delete x.prop;
          return x;
        }),
        (x) => x.value
      );
    }
  );
}
