import { useState, useCallback, ChangeEvent } from 'react';

type ValidationRule<T> = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any, formValues: T) => boolean | string;
  message?: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>;
};

type FormErrors<T> = {
  [K in keyof T]?: string;
};

type FieldChangeHandler = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;

interface UseFormReturn<T> {
  values: T;
  errors: FormErrors<T>;
  touched: Record<keyof T, boolean>;
  handleChange: FieldChangeHandler;
  handleBlur: (field: keyof T) => void;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void;
  setValues: (values: Partial<T>) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  validateField: (field: keyof T) => boolean;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * 自定义表单Hook
 * @param initialValues 初始值
 * @param validationRules 验证规则
 * @returns 表单状态和方法
 */
export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {}
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValues).reduce((acc, key) => {
      acc[key as keyof T] = false;
      return acc;
    }, {} as Record<keyof T, boolean>)
  );
  const [isDirty, setIsDirty] = useState(false);

  // 验证单个字段
  const validateField = useCallback(
    (field: keyof T): boolean => {
      const value = values[field];
      const rules = validationRules[field];

      if (!rules) return true;

      let isValid = true;
      let errorMessage = '';

      if (rules.required && (value === undefined || value === null || value === '')) {
        isValid = false;
        errorMessage = rules.message || '此字段为必填项';
      } else if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        isValid = false;
        errorMessage = rules.message || `最小长度为 ${rules.minLength} 个字符`;
      } else if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = rules.message || `最大长度为 ${rules.maxLength} 个字符`;
      } else if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = rules.message || '格式不正确';
      } else if (rules.validate) {
        const validateResult = rules.validate(value, values);
        if (typeof validateResult === 'string') {
          isValid = false;
          errorMessage = validateResult;
        } else if (validateResult === false) {
          isValid = false;
          errorMessage = rules.message || '验证失败';
        }
      }

      setErrors(prev => ({
        ...prev,
        [field]: isValid ? undefined : errorMessage
      }));

      return isValid;
    },
    [values, validationRules]
  );

  // 验证整个表单
  const validateForm = useCallback((): boolean => {
    const fields = Object.keys(validationRules) as Array<keyof T>;
    const validationResults = fields.map(field => validateField(field));
    return validationResults.every(Boolean);
  }, [validateField, validationRules]);

  // 处理字段变化
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;
      let fieldValue: any = value;

      // 处理不同类型的输入
      if (type === 'checkbox') {
        fieldValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'number') {
        fieldValue = value === '' ? '' : Number(value);
      }

      setValues(prev => ({
        ...prev,
        [fieldName]: fieldValue
      }));

      setIsDirty(true);

      // 如果字段已经被触摸过，则在值变化时重新验证
      if (touched[fieldName]) {
        validateField(fieldName);
      }
    },
    [touched, validateField]
  );

  // 处理字段失焦
  const handleBlur = useCallback(
    (field: keyof T) => {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
      validateField(field);
    },
    [validateField]
  );

  // 设置字段值
  const setFieldValue = useCallback(
    (field: keyof T, value: any) => {
      setValues(prev => ({
        ...prev,
        [field]: value
      }));
      setIsDirty(true);

      // 如果字段已经被触摸过，则在值变化时重新验证
      if (touched[field]) {
        validateField(field);
      }
    },
    [touched, validateField]
  );

  // 设置字段触摸状态
  const setFieldTouched = useCallback(
    (field: keyof T, isTouched: boolean = true) => {
      setTouched(prev => ({
        ...prev,
        [field]: isTouched
      }));
      if (isTouched) {
        validateField(field);
      }
    },
    [validateField]
  );

  // 设置多个值
  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
    setIsDirty(true);
  }, []);

  // 重置表单
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(
      Object.keys(initialValues).reduce((acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      }, {} as Record<keyof T, boolean>)
    );
    setIsDirty(false);
  }, [initialValues]);

  // 计算表单是否有效
  const isValid = Object.keys(errors).length === 0 && validateForm();

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    setValues: setFormValues,
    resetForm,
    validateForm,
    validateField,
    isValid,
    isDirty
  };
};