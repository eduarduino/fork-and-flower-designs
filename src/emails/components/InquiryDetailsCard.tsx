import { Column, Row, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { brandColors, brandFonts } from "./theme";

export interface DetailRow {
  label: string;
  value: ReactNode;
}

export interface DetailGroup {
  title: string;
  rows: DetailRow[];
}

interface InquiryDetailsCardProps {
  /** Optional small uppercase eyebrow above the card. */
  eyebrow?: string;
  /** One or more labeled sections of rows. */
  groups: DetailGroup[];
}

/**
 * Cream-dark card with bordered rows used by both emails. The card uses
 * a true `<table>` (via React Email `<Row>` / `<Column>`) so the
 * left-aligned labels and right-aligned values render predictably even
 * in Outlook desktop and dark-mode clients.
 */
export function InquiryDetailsCard({ eyebrow, groups }: InquiryDetailsCardProps) {
  return (
    <Section style={{ padding: "0 32px" }}>
      {eyebrow ? (
        <Text
          style={{
            color: brandColors.gold.dark,
            fontFamily: brandFonts.sans,
            fontSize: "11px",
            letterSpacing: "0.22em",
            margin: "0 0 12px 0",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </Text>
      ) : null}
      <div
        style={{
          backgroundColor: brandColors.blush.light,
          border: `1px solid ${brandColors.cream.dark}`,
          padding: "28px 28px 24px 28px",
        }}
      >
        {groups.map((group, groupIdx) => (
          <div
            key={group.title}
            style={{
              marginTop: groupIdx === 0 ? 0 : "24px",
            }}
          >
            <Text
              style={{
                fontFamily: brandFonts.serif,
                color: brandColors.charcoal.DEFAULT,
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                margin: "0 0 14px 0",
                paddingBottom: "10px",
                borderBottom: `1px solid ${brandColors.cream.dark}`,
              }}
            >
              {group.title}
            </Text>
            {group.rows.map((row, rowIdx) => (
              <Row
                key={`${group.title}-${row.label}`}
                style={{
                  marginTop: rowIdx === 0 ? 0 : "6px",
                }}
              >
                <Column
                  style={{
                    width: "38%",
                    verticalAlign: "top",
                    padding: "6px 12px 6px 0",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: brandFonts.sans,
                      color: brandColors.charcoal.light,
                      fontSize: "11px",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {row.label}
                  </Text>
                </Column>
                <Column
                  style={{
                    verticalAlign: "top",
                    padding: "6px 0",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: brandFonts.sans,
                      color: brandColors.charcoal.DEFAULT,
                      fontSize: "14px",
                      lineHeight: "1.55",
                      margin: 0,
                    }}
                  >
                    {row.value}
                  </Text>
                </Column>
              </Row>
            ))}
          </div>
        ))}
      </div>
    </Section>
  );
}
