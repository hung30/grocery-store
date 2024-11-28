import React, { useEffect, useState } from "react";
import { Select, Input, Button } from "antd";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { message } from "antd";

function TypeSelect({ onTypeSelect, value }) {
  const [types, setTypes] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newType, setNewType] = useState("");

  useEffect(() => {
    const types = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/types`
        );
        setTypes(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    types();
  }, []);

  const handleAddType = async () => {
    if (newType) {
      try {
        setIsLoading(true);
        const res = await authorizedAxiosInstance.post(
          `${env.API_URL}/v1/types`,
          {
            name: newType,
          }
        );
        setTypes([...types, res.data]);
        setIsAddingNew(false);
        setNewType("");
        setIsLoading(false);
        message.success("Thêm danh mục sản phẩm thành công!");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    }
  };

  const handleTypeSelect = (value) => {
    if (value === "addNew") {
      setIsAddingNew(true);
    } else {
      onTypeSelect(value);
    }
  };

  return (
    <>
      {!isAddingNew ? (
        <Select
          value={value}
          placeholder="Chọn danh mục sản phẩm"
          style={{ width: "100%" }}
          onChange={handleTypeSelect}
          dropdownRender={(menu) => menu}
        >
          {types.map((type) => (
            <Select.Option key={type._id} value={type._id}>
              {type.name}
            </Select.Option>
          ))}
          <Select.Option value="addNew">Thêm danh mục mới...</Select.Option>
        </Select>
      ) : (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Input
            value={newType}
            placeholder="Nhập danh mục mới"
            onChange={(e) => setNewType(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={handleAddType} loading={isLoading}>
            Thêm
          </Button>
          <Button
            onClick={() => setIsAddingNew(false)}
            style={{ marginLeft: 8 }}
          >
            Huỷ
          </Button>
        </div>
      )}
    </>
  );
}

export default TypeSelect;
