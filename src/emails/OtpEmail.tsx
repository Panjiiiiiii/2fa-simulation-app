import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
} from "@react-email/components";

interface Props {
  otp: string;
}

export default function OtpEmail({ otp }: Props) {
  return (
    <Html>
      <Head />
      <Body
        style={{ backgroundColor: "#f9f9f9", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Section>
            <Text
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              Your OTP Code
            </Text>
            <Text style={{ fontSize: "16px" }}>{otp}</Text>
            <Text
              style={{ fontSize: "14px", color: "#888888", marginTop: "20px" }}
            >
              This code will expire in 5 minutes.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
