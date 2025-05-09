export function parseMusicXML(xml: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(xml, "application/xml");
  }
  