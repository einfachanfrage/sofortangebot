// ZUGFeRD XML in bestehende PDF einbetten (pdf-lib)
// Ergebnis: PDF mit eingebetteter factur-x.xml — kompatibel mit DATEV, Lexoffice, sevDesk

import { PDFDocument, AFRelationship } from 'pdf-lib'

const ZUGFERD_XMP = (konformitaet: string) => `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
        xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"
        xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#">
      <pdfaid:part>3</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>
      <fx:DocumentType>INVOICE</fx:DocumentType>
      <fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>
      <fx:Version>1.0</fx:Version>
      <fx:ConformanceLevel>${konformitaet}</fx:ConformanceLevel>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`

export async function embedZUGFeRDInPdf(
  pdfBytes: Uint8Array,
  xmlString: string,
  konformitaet = 'EN 16931',
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes)

  const xmlBytes = Buffer.from(xmlString, 'utf-8')

  // XML als Dateianhang einbetten — AFRelationship = Alternative (ZUGFeRD-Anforderung)
  await pdfDoc.attach(xmlBytes, 'factur-x.xml', {
    mimeType: 'text/xml',
    description: `Factur-X / ZUGFeRD 2.3 ${konformitaet}`,
    creationDate: new Date(),
    modificationDate: new Date(),
    afRelationship: AFRelationship.Alternative,
  })

  // XMP-Metadaten mit PDF/A-3b-Marker setzen
  pdfDoc.setKeywords([`ZUGFeRD:2.3:${konformitaet}`, 'Factur-X:1.0'])
  pdfDoc.setProducer('Sofortangebot (factur-x.eu:1p0:en16931)')

  // XMP-Stream in Dokument-Catalog schreiben
  try {
    const xmpBytes = Buffer.from(ZUGFERD_XMP(konformitaet), 'utf-8')
    const xmpStream = pdfDoc.context.stream(xmpBytes, {
      Type: 'Metadata',
      Subtype: 'XML',
      Length: xmpBytes.length,
    })
    const xmpRef = pdfDoc.context.register(xmpStream)
    pdfDoc.catalog.set(pdfDoc.context.obj('Metadata'), xmpRef)
  } catch {
    // XMP-Metadaten konnten nicht gesetzt werden — XML ist trotzdem eingebettet
    console.warn('[ZUGFeRD] XMP-Metadaten konnten nicht gesetzt werden')
  }

  return pdfDoc.save()
}
