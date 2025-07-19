import React from 'react';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface EditorResult {
  text: string;
  html: string;
}

interface SafeMdEditorProps {
  value: any; // 接受任何类型的值
  onChange: (data: EditorResult) => void;
  style?: React.CSSProperties;
  renderHTML: (text: string) => string;
  placeholder?: string;
}

/**
 * 安全的 Markdown 编辑器组件
 * 确保传递给 MdEditor 的 value 属性始终是字符串类型
 */
const SafeMdEditor: React.FC<SafeMdEditorProps> = ({
  value,
  onChange,
  style,
  renderHTML,
  placeholder
}) => {
  // 确保 value 是字符串类型
  const safeValue = typeof value === 'string' ? value : '';

  return (
    <MdEditor
      value={safeValue}
      onChange={onChange}
      style={style}
      renderHTML={renderHTML}
      placeholder={placeholder}
    />
  );
};

export default SafeMdEditor;