export default {
  sumorApp: {
    name: '轻呈云应用文本',
    origin: {
      INTERNAL_ERROR: '程序内部错误，请稍后重试，或联系管理员',
      NETWORK_ERROR: '网络错误，请稍后重试，或联系管理员',
      PERMISSION_DENIED: '没有访问该功能权限，请联系管理员。缺少权限：${auth}',
      LOGIN_EXPIRED: '登陆授权失效，请重新登陆',
      PERMISSION_EDIT_FORBIDDEN_DIRECTLY: '禁止直接修改permission，请使用setPermission',
      LOGIN_STATUS_EDIT_FORBIDDEN_DIRECTLY: '禁止直接修改登录状态',
      USER_EDIT_FORBIDDEN_DIRECTLY: '禁止直接修改user，请使用setUser',
      TOKEN_ID_EDIT_FORBIDDEN_DIRECTLY: '禁止直接修改令牌ID，请使用setID',
      TOKEN_TIME_EDIT_FORBIDDEN_DIRECTLY: '禁止直接修改令牌时间',
      TOKEN_DATA_EDIT_FORBIDDEN_DIRECTLY: '禁止直接修改令牌数据',
      LACK_USER_ID: '缺少用户ID',
      AUTH_ERROR: '授权失败，请稍后重试',
      AUTH_ERROR_COOKIE_MISSING: 'cookie丢失',
      API_NOT_FOUND: '接口未找到',

      INVALID_PARAMETER: '无效数据:${msg}',
      RULE_LOGIC_NOT_FUNCTION: '规则逻辑不是有效函数方法',
      SUFFIX_REQUIRED: '转换为对象缺少必要的后缀名',
      PATH_ARROGATION: '路径越级',
      NOT_SUPPORT_ABSOLUTE_PATH: '不支持绝对路径',
      REQUIRED: '必填项',
      LENGTH_OUT_OF_LIMIT: '长度必须小于${length}',
      WECHAT_DISABLED: '微信未启用，请联系管理员'
    },
    target: {
      en: {
        INTERNAL_ERROR: 'Internal program error, please try again later, or contact administrator',
        NETWORK_ERROR: 'Network error. Please try again later or contact the administrator',
        PERMISSION_DENIED: 'You do not have permission ${auth}, please contact administrator',
        LOGIN_EXPIRED: 'Login expired, please login',

        INVALID_PARAMETER: 'Invalid data: ${msg}',
        RULE_LOGIC_NOT_FUNCTION: "Rule logic isn't valid function",
        SUFFIX_REQUIRED: 'Suffix required for object path',
        PATH_ARROGATION: 'Path arrogation',
        NOT_SUPPORT_ABSOLUTE_PATH: 'Not support absolute path',
        REQUIRED: 'Required',
        LENGTH_OUT_OF_LIMIT: 'The length must be less than ${length}'
      }
    }
  },
  sumorSMS: {
    origin: {
      MOBILE_FORMAT: '手机号格式错误',
      MOBILE_PREFIX_NOT_SUPPORT: '该国家地区暂未开通服务',
      SMS_SEND_FAILED: '消息发送失败:${msg}'
    }
  },
  sumorStorage: {
    name: '轻呈云存储文本',
    origin: {
      STORAGE_INSTANCE_ERROR: '存储系统交互异常:${msg}',
      STORAGE_FILE_SAVE_FAILED: '文件写入失败',
      STORAGE_NOT_CONNECTED: '未配置存储服务器连接',
      STORAGE_FILE_READ_FAILED: '文件读取失败',
      STORAGE_FILE_DELETE_FAILED: '文件删除失败',
      STORAGE_FILE_INFO_FAILED: '文件获取信息失败'
    }
  },
  sumorDemo: {
    origin: {
      DEMO_TEXT_ZH: '演示文本：中文，当前语言环境不匹配，已回归原始文本',
      DEMO_TEXT_ZHCN: '演示文本：中国大陆简体中文，当前语言环境不匹配，已回归原始文本',
      DEMO_TEXT_ZHHK: '演示文本：中国香港繁体中文，当前语言环境不匹配，已回归原始文本',
      DEMO_TEXT_EN: '演示文本：英文，当前语言环境不匹配，已回归原始文本'
    },
    target: {
      en: {
        DEMO_TEXT_EN: 'Demo text for english'
      },
      zh: {
        DEMO_TEXT_ZH: '演示文本：中文'
      },
      'zh-CN': {
        DEMO_TEXT_ZHCN: '演示文本：中国大陆简体中文'
      },
      'zh-HK': {
        DEMO_TEXT_ZHHK: '演示文本：中國香港繁體中文'
      }
    }
  }
}
