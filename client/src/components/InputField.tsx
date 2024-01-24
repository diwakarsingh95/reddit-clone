import React, { InputHTMLAttributes } from "react";
import { FieldHookConfig, useField } from "formik";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> &
  FieldHookConfig<any> & { label: string };

const InputField = ({ label, ...props }: InputFieldProps) => {
  const [field, meta] = useField(props);
  return (
    <FormControl my={4} isInvalid={meta.touched && !!meta.error}>
      <FormLabel>{label}</FormLabel>
      <Input {...field} type={props.type} placeholder={props.placeholder} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default InputField;
