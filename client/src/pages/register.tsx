import React from "react";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/react";
import Main from "@/components/Main";
import InputField from "@/components/InputField";

const Register = () => {
  return (
    <Main variant="small">
      <Formik
        initialValues={{ username: "", email: "", password: "" }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="username"
              label="Username"
              placeholder="Username"
            />
            <InputField
              type="email"
              name="email"
              label="Email"
              placeholder="Email"
            />
            <InputField
              name="password"
              label="Password"
              placeholder="Password"
            />
            <Button
              mt={2}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Main>
  );
};

export default Register;
