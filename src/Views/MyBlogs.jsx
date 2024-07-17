import {
  Button,
  ConfigProvider,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Pagination,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";

import { useEffect, useState } from "react";
import { CloseCircleIcon, HideIcon, UnHideIcon } from "../assets/Icons/Icons";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { validationRules } from "../utils/Validation";

import { DeleteIcon, EditIcon, MenuDotsIcon } from "../assets/Icons/Icons";
import moment from "moment";

import { truncateDescription } from "../utils/truncate";
import { ExclamationCircleFilled } from "@ant-design/icons";
import Search from "antd/es/transfer/search";
const { confirm } = Modal;
const MyBlogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTableDataLoading, setIsTableDataLoading] = useState(true);
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
  const [sort, setSort] = useState("latest");

  // ---- Success popup -----------
  const [api, contextHolder] = message.useMessage();
  const openNotification = (m) => {
    api.open({
      type: "success",
      content: m,
    });
  };

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
      )}?sort=${sort}&page=${page}&limit=10`,
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
        CreatedAt: blog.createdAt,
      }));

      setBlogData({
        blogs: transformedBlogs,
        totalBlogs: response.data.totalBlogs,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      });
      setIsTableDataLoading(false);
    } catch (error) {
      setIsTableDataLoading(false);

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

  // ------- search ------------
  const SearchBar = async (title) => {
    console.log("Titile in side API call");
    console.log(title);
    const config = {
      url: `http://localhost:3000/api/Blog/search/${title}?id=${localStorage.getItem(
        "id"
      )}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("search reasults for user");
      console.log(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
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
      getBlogByUser();
      openNotification("Blog created successfully!");
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
      openNotification("Blog updated successfully!");
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
      openNotification("Blog deleted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  // ------ Hide Function -------------

  const handleHideBlog = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/hideblog/${selectedBlogID}`,
      method: "PATCH",
    };

    try {
      const response = await axios(config);

      console.log(response.data);
      getBlogByUser();
      getBlogCount();
      openNotification("Blog Hide successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsButtonLoading(false);
    }
  };

  // ------ Un Hide Function -------------

  const handleUnHideBlog = async () => {
    const config = {
      url: `http://localhost:3000/api/Blog/UnHideblog/${selectedBlogID}`,
      method: "PATCH",
    };

    try {
      const response = await axios(config);

      console.log(response.data);
      getBlogByUser();
      getBlogCount();
      openNotification("Blog un hide successfully!");
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

    const showHideBlogMessage = () => {
      confirm({
        title: `Are you sure to hide this Blog?`,
        icon: <ExclamationCircleFilled />,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          setIsButtonLoading(true);
          await handleHideBlog();
          setIsButtonLoading(false);
        },
      });
    };

    const showUnHideBlogMessage = () => {
      confirm({
        title: `Are you sure to un-Hide this Blog?`,
        icon: <ExclamationCircleFilled />,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          setIsButtonLoading(true);
          await handleUnHideBlog();
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
          <div onClick={showHideBlogMessage} className="ms-2">
            Hide
          </div>
        ),
        key: "1",
        icon: <HideIcon />,
      },
      {
        type: "divider",
      },
      {
        label: (
          <div onClick={showUnHideBlogMessage} className="ms-2">
            Un-Hide
          </div>
        ),
        key: "2",
        icon: <UnHideIcon />,
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
        key: "3",
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

  const SearchByCategory = async (category) => {
    console.log("category in side API call");
    console.log(category);
    const config = {
      url: `http://localhost:3000/api/Blog/searchByCategoryForUser?category=${category}&userId=${localStorage.getItem(
        "ID"
      )}`,
      method: "GET",
    };

    try {
      const response = await axios(config);
      console.log("search reasults by category");
      console.log(response.data);

      const transformedBlogs = response.data
        .slice()
        .reverse()
        .map((blog) => ({
          id: blog._id,
          title: blog.title,
          description: blog.content,
          Status: blog.hide ? "hide" : "unhide",
          CreatedAt: blog.createdAt,
        }));

      setBlogData({
        blogs: transformedBlogs,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Inside finally");
    }
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

  const onSearch = (value) => {
    console.log(value);
    SearchBar();
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  useEffect(() => {
    getBlogCount();
  }, []);

  useEffect(() => {
    getBlogCount();
    getBlogByUser();
  }, [page, sort]);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        {contextHolder}
        <div className="flex justify-between mx-5 col-span-12 mt-2">
          <h3 className="text-2xl font-semibold">My Blogs</h3>
          <Button onClick={showModal}>Create New Blog</Button>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-teal-100  p-5  rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Blogs</h1>
          <div className="text-3xl">{BlogsCount && BlogsCount.totalPosts || 0}</div>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-[#E8F5E9] p-5 rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Likes</h1>
          <div className="text-3xl">{BlogsCount && BlogsCount.totalLikes || 0}</div>
        </div>
        <div className="col-span-12 sm:col-span-4 bg-[#FFFDE7] p-5 rounded-md shadow-md">
          <h1 className="text-xl font-semibold">Total Comments</h1>
          <div className="text-3xl">
            {BlogsCount && BlogsCount.totalComments || 0}
          </div>
        </div>
        <div className="flex gap-2 items-center col-span-12">
          <Search
            placeholder="Search Blog"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}
          />

          <Select
            style={{ minWidth: 150 }}
            placeholder="Category"
            onChange={SearchByCategory}
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
            onChange={handleSortChange}
            options={[
              { value: "latest", label: "latest" },
              { value: "Oldest", label: "Oldest" },
            ]}
          />
        </div>

        <div className="col-span-12 shadow-lg rounded-md">
          {isTableDataLoading ? (
            <ConfigProvider
              theme={{
                token: {
                  controlHeight: 590,
                },
              }}
            >
              <Skeleton.Button active={true} size="small" block />
            </ConfigProvider>
          ) : (
            <div className="grid grid-cols-12 h-screen">
              {blogData.blogs.length > 0 ? (
                <>
                  <Table
                    className="col-span-12"
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
                  <Pagination
                    className="mb-5 mt-5 col-start-4 md:col-start-6 col-span-6"
                    current={page}
                    total={blogData.totalBlogs}
                    onChange={handlePageChange}
                  />
                </>
              ) : (
                <p className="col-span-12 p-3">No Blogs Posted Yet</p>
              )}
            </div>
          )}
        </div>
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
