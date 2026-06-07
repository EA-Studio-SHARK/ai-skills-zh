import { Button, Form, Input, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';

type User = {
  id: string;
  name: string;
  phone: string;
  status: 'enabled' | 'disabled';
};

const columns: ColumnsType<User> = [
  { title: '姓名', dataIndex: 'name' },
  { title: '手机号', dataIndex: 'phone' },
  {
    title: '状态',
    dataIndex: 'status',
    render: (value) => value === 'enabled' ? <Tag color="success">启用</Tag> : <Tag>停用</Tag>
  },
  {
    title: '操作',
    key: 'actions',
    render: (_, record) => (
      <Space>
        <Button type="link">编辑</Button>
        <Button type="link" danger disabled={record.status === 'disabled'}>停用</Button>
      </Space>
    )
  }
];

export function UserPage() {
  return (
    <>
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="keyword" label="关键词">
          <Input allowClear placeholder="姓名 / 手机号" />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select allowClear style={{ width: 120 }} options={[
            { value: 'enabled', label: '启用' },
            { value: 'disabled', label: '停用' }
          ]} />
        </Form.Item>
        <Button type="primary">查询</Button>
      </Form>
      <Table rowKey="id" columns={columns} pagination={{ showSizeChanger: true }} />
    </>
  );
}
