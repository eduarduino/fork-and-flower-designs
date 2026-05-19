import { Img, Text } from "@react-email/components";
import { brandColors, brandFonts } from "./theme";
import {
  SIGNATURE_CID,
  SIGNATURE_DATAURL_PREFIX,
} from "@/lib/signature-constants";

interface SignatureBlockProps {
  /**
   * Either the original signature value from the inquiry (drawn PNG
   * data URL or typed plain-text name). The block decides how to render
   * based on `hasAttachment` — when an inline `cid:signature` PNG was
   * attached to the email, an `<Img>` referencing it is shown; otherwise
   * the typed name is rendered in an italic serif.
   */
  signature: string;
  hasAttachment: boolean;
}

const SIGNATURE_DISPLAY_WIDTH = 260;
const SIGNATURE_DISPLAY_HEIGHT = 90;

export function SignatureBlock({ signature, hasAttachment }: SignatureBlockProps) {
  const looksLikePng = signature.startsWith(SIGNATURE_DATAURL_PREFIX);

  if (looksLikePng && hasAttachment) {
    return (
      <Img
        src={`cid:${SIGNATURE_CID}`}
        alt="Signature"
        width={SIGNATURE_DISPLAY_WIDTH}
        height={SIGNATURE_DISPLAY_HEIGHT}
        style={{
          display: "block",
          border: 0,
          outline: "none",
          textDecoration: "none",
          maxWidth: "100%",
        }}
      />
    );
  }

  if (looksLikePng && !hasAttachment) {
    return (
      <Text
        style={{
          fontFamily: brandFonts.serif,
          fontStyle: "italic",
          color: brandColors.gold.dark,
          fontSize: "14px",
          margin: 0,
        }}
      >
        [Signature image could not be embedded]
      </Text>
    );
  }

  return (
    <Text
      style={{
        fontFamily: brandFonts.serif,
        fontStyle: "italic",
        color: brandColors.charcoal.DEFAULT,
        fontSize: "18px",
        margin: 0,
      }}
    >
      {signature}
    </Text>
  );
}
