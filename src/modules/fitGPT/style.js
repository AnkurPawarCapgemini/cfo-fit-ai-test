import styled from "styled-components";
export const FitGptWrapper = styled.div`
  * {
    box-sizing: border-box;
  }
  .user_name {
    font-size: 14px;
    color: #515151;
    margin-right: 20px;
    text-transform: capitalize;
  }
  .follow-up button {
    color: #585858;
    background: #12abdb1a;
    padding: 3px 6px;
    border-radius: 5px;
    margin-right: 10px;
    font-size: 14px;
  }
  .save-btn button {
    font-size: 12px;
    background: #0070ad;
    padding: 5px 9px;
    border-radius: 5px;
    color: #fff;
  }
  .followup-save {
    display: flex;
    margin-right: 11px;
    justify-content: space-between;
    align-items: center;
  }
  .save-btn svg {
    font-size: 20px;
    margin-right: 5px;
  }
  .user_time {
    font-size: 12px;
    color: #a0a0a0;
    margin-right: 16px;
  }
  .messenger-message.user {
    width: fit-content; /* Allow width to adjust to content */
    max-width: 652%; /* Limit width to 70% of the container to prevent overflow */
  }

  .messenger-message.bot {
    max-width: 55%;
  }
  .slick-dots {
    right: 30px !important;
    bottom: -27px !important;
    display: flex !important;
    justify-content: flex-end !important;
  }
  .slick-dots li {
    width: 0px !important;
    margin: 0 8px;
  }
  .fitgpt-layout {
    display: flex;
    position: relative;
    height: calc(100vh - 68px);
  }
  .message-header {
    display: flex;

    align-items: center;
    justify-content: flex-end;
    margin-bottom: 5px;
  }
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .name {
    font-weight: bold;
  }

  .messenger-container {
    flex: 1;
    width: 315px;
    background-color: #f8fafc;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .messenger-message {
    display: inline-block;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
  }
  .messenger-messages {
    padding: 16px;
    flex: 1;
    overflow-y: auto;
  }
  .message-wrapper.user {
    text-align: right;
    position: relative;
    display: flex;
    padding-right: 36px;
    justify-content: flex-end;
    flex-direction: column;
    align-items: flex-end;
  }
  .message-wrapper.bot {
    position: relative;
    justify-content: flex-start;
    display: flex;
    padding-left: 36px;
    flex-direction: column;
  }
  .message-wrapper.bot .user_time,
  .message-wrapper.bot .user_name {
    margin-left: 20px;
  }
  .message-wrapper.bot img {
    margin-left: 10px;
  }
  .message-wrapper.bot .message-header {
    position: absolute;
    left: -15px;
    top: -7px;
    justify-content: flex-start;
    position: absolute;
    height: 50px;
    width: 50px;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    background: #0070ad;
    font-size: 27px;
    margin-left: 10px;
  }
  .message-wrapper.user .message-header {
    position: absolute;
    right: -15px;
    top: -5px;
  }
  .message-wrapper {
    margin-bottom: 15px;
  }
  .messenger-input-area {
    display: flex;
    flex-direction: column;
    padding: 10px;
    position: relative;
    width: 92%;
    margin: 0 auto;
    background-color: transparent;
  }

  .messenger-input {
    flex: 1;
    padding: 10px 64px 10px 10px;
    border: 1px solid #0070ad;
    font-size: 14px;
    outline: none;
    border-radius: 10px;
    margin-right: 10px;
    background-color: #fff;
  }

  .messenger-send-btn {
    padding: 10px 20px;
    position: absolute;
    right: 23px;
    bottom: 8px;
  }

  .typing-indicator {
    display: flex;
    justify-content: flex-start;
    margin: 10px;
  }
  .messenger-message.user {
    background-color: #c6deec;
    box-shadow: 2px 2px 12px 0px #518fb180;
    padding: 14px;
    margin-right: 16px;
    border: 1px solid #0070ad;
    //  width: 148px;
    color: #fff;
    border-radius: 14px 0px 14px 14px;
  }

  .messenger-message.bot {
    background-color: #fff;
    box-shadow: 2px 2px 12px 0px #d1d1d140;
    padding: 16px 16px 0px 16px;
    margin-left: 16px;
    width: fit-content;
    color: #1a1a1a;
    border: 1px solid #e7e7e7;
    border-radius: 1px 14px 14px 14px;
  }
  .typing-indicator .dot {
    width: 8px;
    height: 8px;
    margin: 0 3px;
    background-color: #333;
    border-radius: 50%;
    animation: typing 1s infinite ease-in-out;
  }

  .typing-indicator .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .typing-indicator .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes typing {
    0%,
    100% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
  }
`;

export const BotChatWrapper = styled.div`
  && {
    position: relative;
  }
  .svg-open {
    position: absolute;
    right: 0;
    bottom: 13px;
    font-size: 18px;
  }
`;
export const FitGptSidebarWrapper = styled.div`
  position: relative;
  .chat-text {
    font-size: 20px;
  }
  .search-container {
    display: flex;
    align-items: center;
    border: 1px solid #d7e5de;
    border-radius: 5px;
    padding: 8px;
    background-color: #fff;
    /* backdrop-filter: blur(44px); */
    box-shadow: 2px 0px 5px 0px #0070ad0d;
    margin-top: 16px;
  }

  .search-icon {
    color: #666;
    font-size: 20px;
    margin-right: 8px;
  }

  .search-input::placeholder {
    color: #0070ad;
  }

  .search-input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 16px;
  }

  .chat-newChat button {
    color: #0070ad;
  }
  .sidebar {
    height: calc(100vh - 50px);
    width: 250px;
    background-color: #fff;
    border-right: 1px solid #eceff1;
    transition: width 0.3s ease;
    position: relative;
    box-shadow: none;
    display: flex;
    flex-direction: column;
  }

  .sidebar.closed {
    width: 0px; /* Shrinks when closed */
    overflow: hidden; /* Hide content when closed */
  }

  .sidebar.open {
    width: 250px; /* Full width when open */
  }
  .sidebar-menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }
  .chat-sidebar-bottom ul li {
    color: #0070ad;
  }
  .sidebar-content {
    color: #000;
    background: rgba(18, 171, 219, 0.1);
    height: 100%;
    padding: 16px 12px;
    opacity: ${(props) => (props.isOpen ? 1 : 0)};
    transition: opacity 0.3s ease;
  }

  .sidebar-title {
    font-size: 1.5rem;
    margin-bottom: 20px;
    transition: opacity 0.3s ease;
  }

  .hidden {
    display: none;
  }

  .sidebar ul {
    list-style-type: none;
    padding: 0;
  }

  .sidebar ul li {
    margin: 8px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-size: 1rem;
  }
  .sidebar ul li:first-child {
    margin-top: 0px;
  }
  .sidebar ul li:last-child {
    margin-bottom: 0px;
  }

  .sidebar ul li .icon {
    margin-right: 10px;
    font-size: 1.2rem;
  }

  .toggle-btn {
    position: absolute;
    top: 20px;
    right: -20px; /* Keep the button slightly outside the sidebar */
    height: 36px;
    width: 36px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    z-index: 1000;
    transition: right 0.3s ease; /* Smooth transition when sidebar opens */
  }

  .sidebar.open .toggle-btn {
    right: -20px; /* Position on the right when open */
  }

  .sidebar.closed .toggle-btn {
    left: -20px; /* Keep on the left when closed */
  }

  .menu-icon {
    font-size: 18px;
    color: #000;
  }
  .chat-sidebar-bottom svg {
    font-size: 22px;
    margin-right: 4px;
  }
`;

export const SavedTemplateWrapper = styled.div`
  && {
    padding: 1em 1em 1em 2em;
  }
  .head-text-btn {
    justify-content: space-between;
    margin-bottom: 16px;
  }
`;
