import { SendIcon } from "../assets/Icons/Icons";
import { Button, Dropdown, Menu, Space, Tag, Typography } from "antd";
import moment from "moment";
import { faker } from "@faker-js/faker";
import { useNavigate } from "react-router-dom";
import { truncateDescription } from "../utils/truncate";

const ActionsColumn = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: (
        <div onClick={() => navigate(``)} className="ms-2">
          View Details
        </div>
      ),
      key: "0",
      icon: <SendIcon />,
    },
    {
      type: "divider",
    },
    {
      label: <div className="ms-2">Delete</div>,
      key: "2",
      icon: <SendIcon />,
    },
  ];

  return (
    <div className="flex justify-end">
      <Dropdown
        overlay={<Menu items={items} />}
        trigger={["click"]}
        placement="bottomRight"
      >
        <Button shape="circle" type="text" icon={<SendIcon />}></Button>
      </Dropdown>
    </div>
  );
};

export const COLUMNS = [
  {
    title: "Title",
    key: "title",
    render: (_, { name }) => (
      <Space>
        <Typography.Text>{name}</Typography.Text>
      </Space>
    ),
  },
  {
    title: "Description",
    key: "description",
    dataIndex: "description",
    render: (description) => (
      <Typography.Text type="secondary">
        {truncateDescription(description)}
      </Typography.Text>
    ),
  },
  {
    title: "Status",
    key: "Status",
    render: (_, { Status }) => {
      let color;

      if (Status === "unhide") {
        color = "blue";
        Status = "un-hide";
      } else if (Status === "hide") {
        Status = "hide";
        color = "orange";
      } else {
        color = "error";
      }
      return (
        <Tag color={color} className="capitalize">
          {Status}
        </Tag>
      );
    },
  },
  {
    title: "Created At",
    dataIndex: "appliedDate",
    key: "applied-date",
    render: (value) => {
      return moment(value).format("DD MMM YYYY");
    },
  },
  {
    title: "Actions",
    key: "actions",
    align: "right",
    render: () => <ActionsColumn />,
  },
];

export const DATA = [
  ...new Array(10).fill(null).map(() => ({
    key: faker.database.mongodbObjectId(),
    profilePic: faker.image.avatar(),
    name: faker.person.fullName(),
    description: faker.lorem.sentence(30),
    job: faker.company.name(),
    Status: faker.helpers.arrayElement([
      "hide",
      "unhide"
    ]),
    appliedDate: moment().toISOString(),
  })),
];

export const PAGINATION = {
  position: ["bottomCenter"],
  pageSize: 5,
};
