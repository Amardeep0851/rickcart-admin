import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Section,
} from '@react-email/components';

export const EmailTemplate = ({ firstName, otp }: {firstName:string;  otp: string }) => {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <h1 >Hello, {firstName}</h1>
          <Heading style={h1}>Verify your Account to continue do shopping.</Heading>
          <Text style={text}>
            Your One-Time Password (OTP) is:
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={text}>
            This code will expire in 10 minutes. If you didn't request this, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Basic Inline Styles (React Email handles the CSS inlining for Gmail compatibility)
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
};

const container = {
  maxWidth: '480px',
  margin: '0 auto',
  padding: '20px 0 48px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  paddingBottom: '20px',
  
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
};

const codeContainer = {
  background: '#f4f4f4',
  borderRadius: '4px',
  padding: '16px',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const code = {
  color: '#ea580c', // Your Orange Brand Color
  fontSize: '32px',
  fontWeight: '700',
  letterSpacing: '4px',
};