import React from "react";
import styled from "styled-components";
import LogoRound from "../Svg/Icons/LogoRound";
import Text from "../Text/Text";
import Skeleton from "../Skeleton/Skeleton";
import { Colors } from "../../theme";

export interface Props {
  color?: keyof Colors;
  showSkeleton?: boolean;
}

const PriceLink = styled.a`
  display: flex;
  align-items: center;
  svg {
    transition: transform 0.3s;
  }
  :hover {
    svg {
      transform: scale(1.2);
    }
  }
`;

const LogoWrapper: React.FC<Props> = ({ color = "textSubtle", showSkeleton = true }) => {
  return (
    <PriceLink href="/" target="_blank">
      {/* <LogoRound width="24px" mr="8px" /> */}
      <img
        src="/images/logo.png"
        height="45px"
        width="45px"
        alt="nft"
        style={{ borderRadius: "50%", marginRight: "10px" }}
      />
      <Text color={color} bold>
        TTCSwap
      </Text>
    </PriceLink>
  );
};

export default React.memo(LogoWrapper);
