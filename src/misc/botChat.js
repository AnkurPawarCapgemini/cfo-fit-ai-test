// src/components/BotChat.js
import React from "react";
import SliderComponent from "../components/swiper/SliderComponent";
import { MdOpenInNew } from "react-icons/md";
import { BotChatWrapper } from "../modules/fitGPT/style";
import useBotChat from "../store/useBotChat";
export default function BotChat() {
  const { data } = useBotChat();

  return (
    <BotChatWrapper className="example-component">
      <SliderComponent data={data} slidesToShow={1} slidesToScroll={1} />
      <MdOpenInNew className="svg-open" />
    </BotChatWrapper>
  );
}
