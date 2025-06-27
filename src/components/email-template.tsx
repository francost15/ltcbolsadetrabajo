import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  userEmail: string;
  resetLink: string;
}

export const ResetPasswordEmail = ({
  userEmail,
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña de LTC Project</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Restablecer Contraseña</Heading>
          <Text style={paragraph}>
            Hemos recibido una solicitud para restablecer la contraseña de la cuenta asociada a {userEmail}.
          </Text>
          <Text style={paragraph}>
            Si no solicitaste restablecer tu contraseña, puedes ignorar este correo. Por seguridad, este enlace expirará en 1 hora.
          </Text>
          <Link
            href={resetLink}
            style={button}
          >
            Restablecer Contraseña
          </Link>
          <Text style={footer}>
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br />
            {resetLink}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '5px',
  margin: '0 auto',
  padding: '45px',
  maxWidth: '600px',
};

const heading = {
  color: '#333',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '24px',
  lineHeight: '1.3',
  margin: '0 0 15px',
};

const paragraph = {
  color: '#525f7f',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 15px',
};

const button = {
  backgroundColor: '#1a365d',
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  width: '100%',
  padding: '12px',
  margin: '25px 0 15px',
};

const footer = {
  color: '#8898aa',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '12px',
  lineHeight: '16px',
};

export default ResetPasswordEmail; 