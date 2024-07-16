import { Button, Form, Input, Modal, Select, Table } from "antd";
import { COLUMNS, DATA, PAGINATION } from "../Data/BlogsTableData";
import { useState } from "react";
import { CloseCircleIcon } from "../assets/Icons/Icons";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { validationRules } from "../utils/Validation";

const MyBlogs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [IsButtonLoading, setIsButtonLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  const handleCategoryChange = (category) => {
    setCategory(category);
  };

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
      setCategory("");
      setContent("");
      setTitle("");
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

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="flex justify-between mx-5 col-span-12 mt-2">
          <h3>My Blogs</h3>
          <Button onClick={showModal}>Create New Blog</Button>
        </div>
        <div className="col-span-4 bg-slate-500  p-3">Total Blogs</div>
        <div className="col-span-4 bg-blue-500 p-3">Total Likes</div>
        <div className="col-span-4 bg-red-500 p-3">Total Comments</div>
        <div className="col-span-12 shadow-lg rounded-md">
          <Table
            columns={COLUMNS}
            dataSource={DATA}
            pagination={PAGINATION}
            scroll={{
              x: "max-content",
            }}
          />
        </div>
        <Modal
          open={isModalOpen}
          onCancel={handleCancel}
          closeIcon={false}
          footer={false}
          width={800}
          centered
        >
          <Form onFinish={handleSubmit}>
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
                    <Form.Item name="content" rules={validationRules.descrption}>
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
      </div>
    </>
  );
};

export default MyBlogs;
