import React, { useState, useCallback } from 'react';
import {
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Form,
  Collapse,
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import {
  SearchFilterConfig,
  FilterItem,
} from '../types';
import './style.css';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Panel } = Collapse;

export interface SearchFilterAreaProps {
  config: SearchFilterConfig;
  searchText: string;
  filters: Record<string, any>;
}

/**
 * 搜索和过滤区域组件
 * 提供搜索输入框、各种过滤器和重置功能
 */
export function SearchFilterArea(props: SearchFilterAreaProps) {
  const { config, searchText, filters } = props;
  const {
    searchPlaceholder = '请输入搜索关键词',
    showSearch = true,
    filters: filterItems = [],
    onSearch,
    onFilterChange,
    onReset,
  } = config;

  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(true);
  const [searchValue, setSearchValue] = useState(searchText);

  // 处理搜索
  const handleSearch = useCallback((value?: string) => {
    const searchVal = value !== undefined ? value : searchValue;
    onSearch?.(searchVal);
  }, [searchValue, onSearch]);

  // 处理搜索输入变化
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  }, []);

  // 处理过滤器变化
  const handleFilterChange = useCallback((filterKey: string, value: any) => {
    onFilterChange?.(filterKey, value);
  }, [onFilterChange]);

  // 处理重置
  const handleReset = useCallback(() => {
    setSearchValue('');
    form.resetFields();
    onReset?.();
  }, [form, onReset]);

  // 渲染过滤器项
  const renderFilterItem = (item: FilterItem) => {
    const { key, label, type, options = [], placeholder, defaultValue } = item;
    const value = filters[key] || defaultValue;

    switch (type) {
      case 'select':
        return (
          <Select
            placeholder={placeholder || `请选择${label}`}
            value={value}
            onChange={(val) => handleFilterChange(key, val)}
            allowClear
            style={{ width: '100%' }}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'multiSelect':
        return (
          <Select
            mode="multiple"
            placeholder={placeholder || `请选择${label}`}
            value={value}
            onChange={(val) => handleFilterChange(key, val)}
            allowClear
            style={{ width: '100%' }}
          >
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'dateRange':
        return (
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            value={value}
            onChange={(val) => handleFilterChange(key, val)}
            style={{ width: '100%' }}
          />
        );

      case 'input':
        return (
          <Input
            placeholder={placeholder || `请输入${label}`}
            value={value}
            onChange={(e) => handleFilterChange(key, e.target.value)}
            allowClear
          />
        );

      default:
        return null;
    }
  };

  // 计算是否有活跃的过滤器
  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== '' && 
    (!Array.isArray(value) || value.length > 0)
  );

  // 计算过滤器数量
  const filterCount = filterItems.length;
  const shouldShowCollapse = filterCount > 3;

  return (
    <div className="search-filter-area">
      <Form form={form} layout="vertical">
        {/* 搜索行 */}
        <Row gutter={[16, 16]} align="middle">
          {/* 搜索输入框 */}
          {showSearch && (
            <Col xs={24} sm={12} md={8} lg={6}>
              <Input.Search
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                allowClear
              />
            </Col>
          )}

          {/* 快速过滤器（前3个） */}
          {filterItems.slice(0, shouldShowCollapse ? 3 : filterItems.length).map((item) => (
            <Col key={item.key} xs={24} sm={12} md={8} lg={6}>
              <Form.Item label={item.label} style={{ marginBottom: 0 }}>
                {renderFilterItem(item)}
              </Form.Item>
            </Col>
          ))}

          {/* 操作按钮 */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                disabled={!searchValue && !hasActiveFilters}
              >
                重置
              </Button>
              
              {shouldShowCollapse && (
                <Button
                  icon={<FilterOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  type={hasActiveFilters ? 'primary' : 'default'}
                >
                  更多筛选
                  {collapsed ? <DownOutlined /> : <UpOutlined />}
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        {/* 可折叠的高级过滤器 */}
        {shouldShowCollapse && (
          <Collapse
            activeKey={collapsed ? [] : ['filters']}
            ghost
            className="search-filter-area__collapse"
          >
            <Panel
              key="filters"
              header="高级筛选"
              showArrow={false}
              className="search-filter-area__panel"
            >
              <Row gutter={[16, 16]}>
                {filterItems.slice(3).map((item) => (
                  <Col key={item.key} xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label={item.label} style={{ marginBottom: 0 }}>
                      {renderFilterItem(item)}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Panel>
          </Collapse>
        )}
      </Form>
    </div>
  );
}

export default SearchFilterArea;