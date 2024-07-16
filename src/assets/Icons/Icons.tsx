import React from "react";
import { SendOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons";

const SendIcon = () => (
  <SendOutlined style={{ fontSize: "24px", color: "#000" }} />
);

const CloseCircleIcon = () => (
  <Icon
    component={() => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M9.87868 10.1213L14.1213 14.364M9.87868 14.364L14.1213 10.1213M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    )}
  />
);

export { SendIcon, CloseCircleIcon };
