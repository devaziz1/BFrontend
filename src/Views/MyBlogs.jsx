import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import { useEffect, useState } from "react";
import { CloseCircleIcon } from "../assets/Icons/Icons";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { validationRules } from "../utils/Validation";
import Search from "antd/es/transfer/search";
import { DeleteIcon, EditIcon, MenuDotsIcon } from "../assets/Icons/Icons";
import moment from "moment";

import { truncateDescription } from "../utils/truncate";
import { ExclamationCircleFilled } from "@ant-design/icons";
const { confirm } = Modal;


const MyBlogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [IsButtonLoading, setIsButtonLoading] = useState(false);
  const [BlogsCount, setBlogsCount] = useState();
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [blogData, setBlogData] = useState({
    blogs: [],
    totalBlogs: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [selectedBlogID, setSelectedBlogID] = useState("");

  const getBlogCount = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/getTotalCounts/${localStorage.getItem(
        "ID"
      )}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log(response.data);
      setBlogsCount(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const getBlogByUser = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/getBlogsByUserId/${localStorage.getItem(
        "ID"
      )}?page=${page}&limit=5`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("Blogs by user ID");
      console.log(response.data);

      const transformedBlogs = response.data.blogs.map((blog) => ({
        id: blog._id,
        title: blog.title,
        description: blog.content,
        Status: blog.hide ? "hide" : "unhide",
        createdAt: blog.createdAt,
      }));

      setBlogData({
        blogs: transformedBlogs,
        totalBlogs: response.data.totalBlogs,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
  };

  //-------- Create Blog Functions --------------

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsButtonLoading(true);

    const config = {
      url: "http://localhost:3000/api/Blog/createBlog",
      method: "POST",
      data: {
        userId: localStorage.getItem("ID"),
        title,
        content,
        category,
      },
    };

    try {
      const response = await axios(config);
      console.log("Blog submitted successfully!");
      console.log(response.data);
      form.setFieldValue("title", "");
      form.setFieldValue("content", "");
      form.setFieldValue("category", "");
      getBlogCount();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsModalOpen(false);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ------- Edit Blog Functions --------------

  const handleEditBlog = (id) => {
    console.log("Selected blog:", id);
    const blog = blogData.blogs.find((blog) => blog.id === id);
    form.setFieldValue("title", blog.title);
    form.setFieldValue("content", blog.description);
    form.setFieldsValue("Category", blog.category);
    setSelectedBlogID(blog.id);
  };

  const showEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleEditBlogSubmit = async () => {
    setIsButtonLoading(true);

    const config = {
      url: "http://localhost:3000/api/Blog/",
      method: "PATCH",
      data: {
        blogId: selectedBlogID,
        title,
        content,
        category,
      },
    };

    try {
      const response = await axios(config);
      console.log(response.data);
      form.setFieldValue("title", "");
      form.setFieldsValue("content", "");
      form.setFieldsValue("category", "");
      getBlogByUser();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsEditModalOpen(false);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const CancelEditModal = () => {
    setIsEditModalOpen(false);
  };

  // ------ Delete Blog  -------

  const handleDeleteBlog = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/${selectedBlogID}`,
      method: "DELETE",
    };

    try {
      const response = await axios(config);

      console.log(response.data);
      getBlogByUser();
      getBlogCount();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  // ------ Table Functions -------------

  const ActionsColumn = () => {
    const showDeleteBlogMessage = () => {
      confirm({
        title: `Are you sure to delete this Blog?`,
        icon: <ExclamationCircleFilled />,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          setIsButtonLoading(true);
          await handleDeleteBlog();
          setIsButtonLoading(false);
        },
      });
    };
    const items = [
      {
        label: (
          <div onClick={showEditModal} className="ms-2">
            Edit
          </div>
        ),
        key: "0",
        icon: <EditIcon />,
      },
      {
        type: "divider",
      },
      {
        label: (
          <div onClick={showDeleteBlogMessage} className="ms-2">
            Delete
          </div>
        ),
        key: "2",
        icon: <DeleteIcon />,
      },
    ];

    return (
      <div className="flex justify-end">
        <Dropdown
          overlay={<Menu items={items} />}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button shape="circle" type="text" icon={<MenuDotsIcon />}></Button>
        </Dropdown>
      </div>
    );
  };

  const COLUMNS = [
    {
      title: "Title",
      key: "title",
      render: (_, { title }) => (
        <Space>
          <Typography.Text>{title}</Typography.Text>
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

  useEffect(() => {
    getBlogCount();
    getBlogByUser();
  }, []);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="flex justify-between mx-5 col-span-12 mt-2">
          <h3 className="text-2xl font-semibold">My Blogs</h3>
          <Button onClick={showModal}>Create New Blog</Button>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-teal-100  p-5  rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Blogs</h1>
          <div className="text-3xl">{BlogsCount && BlogsCount.totalPosts}</div>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-[#E8F5E9] p-5 rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Likes</h1>
          <div className="text-3xl">{BlogsCount && BlogsCount.totalLikes}</div>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-[#FFFDE7] p-5 rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Comments</h1>
          <div className="text-3xl">
            {BlogsCount && BlogsCount.totalComments}
          </div>
        </div>
        <div className="flex gap-2 items-center col-span-12">
          <Search
            placeholder="Search Blog"
            allowClear
            enterButton="Search"
            size="large"
          />
          <Select
            style={{ minWidth: 150 }}
            placeholder="Category"
            options={[
              { value: "Technology", label: "Technology" },
              { value: "Sports", label: "Sports" },
              { value: "Business", label: "Business" },
              { value: "Health", label: "Health" },
              { value: "Entertainment", label: "Entertainment" },
            ]}
          />
          <Select
            style={{ minWidth: 150 }}
            placeholder="Sort By"
            options={[
              { value: "Latest", label: "Latest" },
              { value: "Oldest", label: "Oldest" },
            ]}
          />
        </div>
        <div className="col-span-12 shadow-lg rounded-md">
          <Table
            rowKey={(record) => record.id}
            onRow={(record) => {
              return {
                onClick: () => {
                  handleEditBlog(record.id);
                },
              };
            }}
            columns={COLUMNS}
            dataSource={blogData.blogs}
            pagination={false}
            scroll={{
              x: "max-content",
            }}
          />
        </div>
        <Pagination
          className="mb-5 mt-5 col-start-4 md:col-start-6 col-span-6"
          current={page}
          total={blogData.totalPages}
          onChange={handlePageChange}
        />
        <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          closeIcon={false}
          footer={false}
          width={800}
          centered
        >
          <Form form={form} onFinish={handleSubmit}>
            <div className="grid grid-cols-12 justify-center gap-3">
              <div className="col-span-12 flex justify-between  w-full mb-5">
                <div></div>
                <h3 className="text-xl font-semibold">Create Blog</h3>
                <div onClick={handleCancel} className="cursor-pointer">
                  <CloseCircleIcon />
                </div>
              </div>

              <div className="grid grid-cols-12 col-span-12 ">
                <div className="col-span-12 flex flex-col gap-3 md:px-16 lg:px-24 mt-4">
                  <div className="col-span-12 md:col-span-7 ">
                    <label className=" text-sm ml-1 font-semibold">
                      Blog Title
                    </label>
                    <Form.Item name="title" rules={validationRules.title}>
                      <Input
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Blog Title"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-12 md:col-span-7 flex flex-col  ">
                    <label className="text-sm ml-1 font-semibold">
                      Blog Category
                    </label>
                    <Form.Item name="Category" rules={validationRules.category}>
                      <Select
                        style={{ minWidth: 150 }}
                        placeholder="Blog Category"
                        onChange={handleCategoryChange}
                        options={[
                          { value: "Technology", label: "Technology" },
                          { value: "Sports", label: "Sports" },
                          { value: "Business", label: "Business" },
                          { value: "Health", label: "Health" },
                          { value: "Entertainment", label: "Entertainment" },
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-7">
                    <label className="text-sm ml-1 font-semibold">
                      Enter Blog
                    </label>
                    <Form.Item
                      name="content"
                      rules={validationRules.descrption}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Enter Blog"
                        onChange={(e) => setContent(e.target.value)}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    </Form.Item>
                  </div>

                  <div className="flex gap-2 mt-5 col-span-12 justify-center">
                    <Button
                      style={{
                        fontWeight: 600,
                      }}
                      type="primary"
                      className="rounded-full"
                      onClick={handleCancel}
                      ghost
                    >
                      Cancel
                    </Button>

                    <Button
                      style={{
                        fontWeight: 600,
                      }}
                      htmlType="submit"
                      type="primary"
                      className="rounded-full "
                      loading={IsButtonLoading}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal>
        <Modal
          open={isEditModalOpen}
          onCancel={CancelEditModal}
          closeIcon={false}
          footer={false}
          width={800}
          centered
        >
          <Form form={form} onFinish={handleEditBlogSubmit}>
            <div className="grid grid-cols-12 justify-center gap-3">
              <div className="col-span-12 flex justify-between  w-full mb-5">
                <div></div>
                <h3 className="text-xl font-semibold">Edit Blog</h3>
                <div onClick={CancelEditModal} className="cursor-pointer">
                  <CloseCircleIcon />
                </div>
              </div>

              <div className="grid grid-cols-12 col-span-12 ">
                <div className="col-span-12 flex flex-col gap-3 md:px-16 lg:px-24 mt-4">
                  <div className="col-span-12 md:col-span-7 ">
                    <label className=" text-sm ml-1 font-semibold">
                      Blog Title
                    </label>
                    <Form.Item
                      initialValue={title}
                      name="title"
                      rules={validationRules.title}
                    >
                      <Input
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Blog Title"
                        allowClear
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-12 md:col-span-7 flex flex-col  ">
                    <label className="text-sm ml-1 font-semibold">
                      Blog Category
                    </label>
                    <Form.Item
                      initialValue={category}
                      name="Category"
                      rules={validationRules.category}
                    >
                      <Select
                        style={{ minWidth: 150 }}
                        placeholder="Blog Category"
                        onChange={handleCategoryChange}
                        options={[
                          { value: "Technology", label: "Technology" },
                          { value: "Sports", label: "Sports" },
                          { value: "Business", label: "Business" },
                          { value: "Health", label: "Health" },
                          { value: "Entertainment", label: "Entertainment" },
                        ]}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-span-7">
                    <label className="text-sm ml-1 font-semibold">
                      Enter Blog
                    </label>
                    <Form.Item
                      initialValue={content}
                      name="content"
                      rules={validationRules.descrption}
                    >
                      <TextArea
                        rows={4}
                        placeholder="Enter Blog"
                        onChange={(e) => setContent(e.target.value)}
                        autoSize={{ minRows: 3, maxRows: 5 }}
                      />
                    </Form.Item>
                  </div>

                  <div className="flex gap-2 mt-5 col-span-12 justify-center">
                    <Button
                      style={{
                        fontWeight: 600,
                      }}
                      type="primary"
                      className="rounded-full"
                      onClick={CancelEditModal}
                      ghost
                    >
                      Cancel
                    </Button>

                    <Button
                      style={{
                        fontWeight: 600,
                      }}
                      htmlType="submit"
                      type="primary"
                      className="rounded-full "
                      loading={IsButtonLoading}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default MyBlogs;
