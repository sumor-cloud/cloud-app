import defineError from '@sumor/error'

const CloudAppError = defineError({
  code: {
    SUMOR_API_FIELDS_VALIDATION_FAILED: 'API fields validation failed'
  },
  // languages: en, zh, es, fr, de, ja, ko, ru, pt, ar
  i18n: {
    en: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'API fields validation failed'
    },
    zh: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'API 字段验证失败'
    },
    es: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'Fallo de validación de campos de API'
    },
    fr: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: "Échec de la validation des champs d'API"
    },
    de: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'API-Feldvalidierung fehlgeschlagen'
    },
    ja: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'APIフィールドの検証に失敗しました'
    },
    ko: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'API 필드 유효성 검사 실패'
    },
    ru: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'Ошибка проверки полей API'
    },
    pt: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'Falha na validação de campos da API'
    },
    ar: {
      SUMOR_API_FIELDS_VALIDATION_FAILED: 'فشل التحقق من صحة حقول الواجهة البرمجية'
    }
  }
})

export default CloudAppError
