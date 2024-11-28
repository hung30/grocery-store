import { EditOutlined } from "@ant-design/icons";
import { Button, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";

function UpdateStatusForm(props) {
  const { onOrder, onUpdateSuccess } = props;
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [status, setStatus] = useState([]);
  const [adminUpdateStatus, setAdminUpdateStatus] = useState(
    onOrder.statusInfo[0]._id
  );

  useEffect(() => {
    const status = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/status`
        );
        setStatus(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    status();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      await authorizedAxiosInstance.put(
        `${env.API_URL}/v1/orders/${onOrder._id}`,
        { statusId: adminUpdateStatus }
      );
      setLoading(false);
      message.success("Cập nhật trạng thái thành công!");
      setIsModalVisible(false);
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      setLoading(false);
      message.error("Cập nhật trạng thái thất bại!");
      console.log(error);
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={showModal}
      ></Button>
      <Modal
        title="Cập nhật trạng thái"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        loading={loading}
      >
        <Select
          onChange={setAdminUpdateStatus}
          style={{ width: "100%" }}
          value={onOrder.statusInfo[0].statusName || ""}
        >
          {status.map((item) => (
            <Select.Option key={item._id} value={item._id}>
              {item.statusName}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </>
  );
}

export default UpdateStatusForm;
