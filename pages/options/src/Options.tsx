import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { updateFrequencyStorage, poemLanguageStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import packageJson from '../../../package.json';

const ExternalLink = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 12 12"
    fill="currentColor"
    style={{ marginLeft: '4px', display: 'inline-block' }}>
    <path d="M2.5 2.5V1H11v8.5H9.5V3.5L2 11 1 10l7.5-7.5z" />
  </svg>
);

const Options = () => {
  const updateFrequency = useStorage(updateFrequencyStorage);
  const poemLanguage = useStorage(poemLanguageStorage);

  return (
    <div className="options-container">
      <div className="options-content">
        <h2 className="options-title">{t('changeArtWork')}</h2>
        <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_tab"
              checked={updateFrequency === 'every_tab'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('everyNewTab')}</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_10min"
              checked={updateFrequency === 'every_10min'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('every10Min')}</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_hour"
              checked={updateFrequency === 'every_hour'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('everyHour')}</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_day"
              checked={updateFrequency === 'every_day'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('daily')}</span>
          </label>
        </div>

        <h2 className="options-title" style={{ marginTop: '30px' }}>{'poemLanguageSettings'}</h2>
        <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <label className="radio-item">
            <input
              type="radio"
              name="poem_language"
              value="chinese"
              checked={poemLanguage === 'chinese'}
              onChange={e => poemLanguageStorage.set(e.target.value as any)}
            />
            <span>{'chinesePoems'}</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="poem_language"
              value="english"
              checked={poemLanguage === 'english'}
              onChange={e => poemLanguageStorage.set(e.target.value as any)}
            />
            <span>{'englishPoems'}</span>
          </label>
        </div>

        <div className="footer">
          <div className="feedback-section">
            <a
              href="https://github.com/get-artab/artab/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center' }}>
              {t('feedback')}
              <ExternalLink />
            </a>
            <a
              href="https://t.me/+KisLFTUscGVkNjNh"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: '10px', display: 'inline-flex', alignItems: 'center' }}>
              Telegram Group
              <ExternalLink />
            </a>
          </div>

          <div className="credits">
            <div className="made-by">
              Made by{' '}
              <a href="https://www.owenyoung.com" target="_blank" rel="noopener noreferrer">
                Owen
              </a>{' '}
              &{' '}
              <a href="https://mazzzystar.github.io/" target="_blank" rel="noopener noreferrer">
                Mazzystar
              </a>
              {', with '}
              <span>🐕 Tokki & Cookie (Chief Happiness Officers)</span>
            </div>
            <div className="inspired-by">
              Inspired by{' '}
              <a
                href="https://apps.apple.com/us/app/arts-word-famous-paintings/id6739025807"
                target="_blank"
                rel="noopener noreferrer">
                Arts
              </a>
              {' & '}
              <a
                href="https://chromewebstore.google.com/detail/google-arts-culture/akimgimeeoiognljlfchpbkpfbmeapkh"
                target="_blank"
                rel="noopener noreferrer">
                Google Arts & Culture
              </a>
            </div>
            <span className="version" style={{ display: 'block', marginTop: '10px' }}>
              {t('version', packageJson.version)}
              {' ('}
              <a
                href="https://github.com/get-artab/artab"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center' }}>
                Source Code
              </a>
              {')'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>{t('loading')}</div>), <div>{t('error')}</div>);
