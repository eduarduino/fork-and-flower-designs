/**
 * Shared between the server-side attachment builder (`src/lib/email.ts`)
 * and the React Email `SignatureBlock` so the template's `<Img src=...>`
 * and the attachment's `inlineContentId` always agree.
 *
 * Both values are hardcoded — never derived from user input — so there
 * is no CID injection surface.
 */

export const SIGNATURE_DATAURL_PREFIX = "data:image/png;base64,";

export const SIGNATURE_CID = "signature";
