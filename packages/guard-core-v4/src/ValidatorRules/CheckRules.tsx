import { React } from 'shim-react'
import { IconFont } from '../IconFont'
import './styles.less'
import { useTranslation } from 'react-i18next'

export const CheckRules: React.FC<any> = props => {
  const { ruleResults } = props
  const { t } = useTranslation()
  return (
    <div className="g2-errror-check-rules">
      <div>{t('login.passwordRuleTips')}</div>
      {ruleResults.map(
        ({ rule, valid, type, typeNumber }: any, index: number) => (
          <>
            {type ? (
              <div>
                <div key={index} className="g2-error-check-rule-item">
                  <div
                    className={`g2-error-check-rule-icon ${
                      valid ? 'valid' : 'invalid'
                    }`}
                  >
                    <IconFont type={'authing-checkbox-circle-fill1'} />
                  </div>
                  <div className="g2-error-check-rule-message">
                    {t('login.characterTypes', { x: typeNumber })}
                  </div>
                </div>

                <div className="g2-error-check-sub-rule">
                  {type.map((item: any, index: number) => (
                    <div key={index} className="g2-error-check-rule-message">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div key={index} className="g2-error-check-rule-item">
                <div
                  className={`g2-error-check-rule-icon ${
                    valid ? 'valid' : 'invalid'
                  }`}
                >
                  <IconFont type={'authing-checkbox-circle-fill1'} />
                </div>
                <div className="g2-error-check-rule-message">{rule}</div>
              </div>
            )}
          </>
        )
      )}
    </div>
  )
}
