import { ReactNode } from "react";
import { Container } from "@chakra-ui/react";

type MainProps = {
  children: ReactNode;
  variant?: "regular" | "small";
};

const Main = ({ children, variant = "regular" }: MainProps) => {
  return (
    <Container maxW={variant === "regular" ? "800px" : "400px"} mt={8}>
      {children}
    </Container>
  );
};

export default Main;
