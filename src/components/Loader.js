import React from "react";
import { Text } from "react-native";
import { Button } from "react-native-elements";

const Loader = ({ text = "Please wait..." }) => {
  return (
    <>
      <Button type="clear" loading disabled />
      <Text>{text}</Text>
    </>
  );
};

export default Loader;
