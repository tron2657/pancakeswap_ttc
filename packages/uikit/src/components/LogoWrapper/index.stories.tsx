import React from "react";
import { LogoWrapper, LogoWrapperProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/CakePrice",
  component: LogoWrapper,
};

const Template: React.FC<LogoWrapperProps> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <LogoWrapper {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  cakePriceUsd: 20.0,
};
