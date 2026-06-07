# antd-chinese

用于 Ant Design 中文后台、企业管理系统、运营控制台和 SaaS 管理端的界面生成、代码实现和交互评审。重点关注中国团队常用表单、表格、权限、审批、导入导出、日期金额和中文文案。

## 核心规则

- 后台页面优先信息密度和效率，不要做营销页式大 hero；因为运营和管理用户需要快速处理任务。
- 表格必须设置稳定 `rowKey`；因为分页、选择和局部更新依赖唯一键。
- 查询条件超过 3 个时使用折叠高级筛选；因为顶部筛选区过高会挤压表格。
- 表单标签使用中文业务词，不要直译字段名；因为后台用户按业务理解，不按数据库字段理解。
- 必填项要给清晰校验文案；因为“请输入”比英文 error 更符合中文后台习惯。
- 金额统一展示货币符号和千分位；因为财务数据需要快速扫读。
- 日期时间要明确到时区或业务口径；因为跨地区和服务器时间会造成误解。
- 状态用 Tag 或 Badge 表达，不要只用颜色；因为色弱用户和灰度打印无法区分。
- 危险操作必须二次确认；因为删除、停用、退款等操作不可轻易回滚。
- 批量操作要展示已选数量；因为用户需要确认影响范围。
- 空状态要给下一步动作；因为“暂无数据”不能帮助用户恢复流程。
- 错误提示要包含原因和可操作建议；因为后台用户需要解决问题，不只是知道失败。
- Drawer 适合轻量编辑，Modal 适合确认和短表单；因为复杂表单放 Modal 会挤压空间。
- 详情页要用 Descriptions 或分组卡片；因为字段多时需要结构化扫读。
- 上传组件要限制文件类型、大小和模板下载；因为导入失败通常来自格式不一致。
- 导出任务量大时使用异步任务；因为同步导出会超时并阻塞页面。
- 权限控制要同时做前端隐藏和后端校验；因为前端按钮隐藏不是安全边界。
- 表格列过多时使用列设置或横向滚动；因为压缩列宽会导致中文截断难读。
- 手机号、身份证、银行卡默认脱敏展示；因为后台数据合规要求更高。
- 使用 `ConfigProvider` 设置中文 locale；因为分页、日期选择和空状态需要中文化。
- 不要滥用 `message.success`；因为频繁 toast 会干扰批量操作。
- 列表操作按钮不要超过 3 个，更多操作放 Dropdown；因为操作区过宽会挤压核心字段。
- 表单提交要处理 loading 和防重复提交；因为后台用户容易连续点击。
- 中文按钮优先使用动词，如“保存”“提交审核”“停用”；因为动作比名词更明确。

## 反例

```tsx
// 错误：没有 rowKey，状态只靠颜色，错误提示不可操作。
<Table columns={[
  { title: 'Status', dataIndex: 'status', render: v => <span style={{ color: 'red' }}>{v}</span> }
]} />
```

```tsx
// 错误：删除操作没有确认。
<Button danger onClick={() => deleteUser(id)}>删除</Button>
```

## 正例

```tsx
<Popconfirm
  title="确认停用该用户？"
  description="停用后该用户将无法登录后台，可在用户详情中重新启用。"
  okText="停用"
  cancelText="取消"
  onConfirm={() => disableUser(record.id)}
>
  <Button danger type="link">停用</Button>
</Popconfirm>
```

```tsx
<ConfigProvider locale={zhCN}>
  <Table
    rowKey="id"
    columns={columns}
    pagination={{
      showSizeChanger: true,
      showTotal: (total) => `共 ${total} 条`
    }}
    locale={{
      emptyText: <Empty description="暂无用户，请先新增或调整筛选条件" />
    }}
  />
</ConfigProvider>
```

## 配置建议

- 使用 `antd` 官方中文 locale：`import zhCN from 'antd/locale/zh_CN'`。
- 日期库按项目统一选择 dayjs，并配置中文 locale。
- 表单复杂时抽出字段配置，但不要牺牲类型安全。
- 管理端默认提供列表、详情、创建、编辑、审计日志四类页面能力。
