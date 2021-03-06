import React, { useRef, useState, useEffect } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';

import codegen from 'postman-code-generators';

import { useSelector } from 'react-redux';

import { useTheme } from 'theme';

import styles from './styles.module.css';
import { buildPostmanRequest } from 'build-postman-request';

const globalOptions = {
  followRedirect: true,
  trimRequestBody: true,
};

const languageSet = {
  js: {
    highlight: 'javascript',
    language: 'javascript',
    variant: 'fetch',
    options: {
      ...globalOptions,
    },
  },
  curl: {
    highlight: 'bash',
    language: 'curl',
    variant: 'curl',
    options: {
      longFormat: false,
      ...globalOptions,
    },
  },
  go: {
    highlight: 'go',
    language: 'go',
    variant: 'native',
    options: {
      ...globalOptions,
    },
  },
  python: {
    highlight: 'python',
    language: 'python',
    variant: 'requests',
    options: {
      ...globalOptions,
    },
  },
  node: {
    highlight: 'javascript',
    language: 'nodejs',
    variant: 'axios',
    options: {
      ES6_enabled: true,
      ...globalOptions,
    },
  },
};

const languageTheme = {
  plain: {
    color: 'var(--ifm-code-color)',
  },
  styles: [
    // {
    //   types: ['changed'],
    //   style: {
    //     color: 'rgb(162, 191, 252)',
    //     fontStyle: 'italic',
    //   },
    // },
    // {
    //   types: ['deleted'],
    //   style: {
    //     color: 'rgba(239, 83, 80, 0.56)',
    //     fontStyle: 'italic',
    //   },
    // },
    {
      types: ['inserted', 'attr-name'],
      style: {
        color: 'var(--code-green)',
        // color: 'rgb(173, 219, 103)',
        // fontStyle: 'italic',
      },
    },
    // {
    //   types: ['comment'],
    //   style: {
    //     color: 'rgb(99, 119, 119)',
    //     fontStyle: 'italic',
    //   },
    // },
    {
      types: ['string', 'url'],
      style: {
        color: 'var(--code-green)',
        // color: 'rgb(173, 219, 103)',
      },
    },
    // {
    //   types: ['variable'],
    //   style: {
    //     color: 'rgb(214, 222, 235)',
    //   },
    // },
    // {
    //   types: ['number'],
    //   style: {
    //     color: 'rgb(247, 140, 108)',
    //   },
    // },
    {
      types: ['builtin', 'char', 'constant', 'function'],
      style: {
        // color: 'rgb(130, 170, 255)',
        color: 'var(--code-blue)',
      },
    },
    {
      // This was manually added after the auto-generation
      // so that punctuations are not italicised
      types: ['punctuation', 'operator'], // +operator
      style: {
        // color: 'rgb(199, 146, 234)',
        color: '#7f7f7f',
      },
    },
    // {
    //   types: ['selector', 'doctype'],
    //   style: {
    //     color: 'rgb(199, 146, 234)',
    //     fontStyle: 'italic',
    //   },
    // },
    {
      types: ['class-name'],
      style: {
        // color: 'rgb(255, 203, 139)',
        color: 'var(--code-orange)',
      },
    },
    {
      types: ['tag', 'arrow', 'keyword'], // -operator, +arrow
      style: {
        // arrow is actually handled globally
        // color: 'rgb(127, 219, 202)',
        color: '#d9a0f9',
      },
    },
    {
      types: ['boolean'],
      style: {
        // color: 'rgb(255, 88, 116)',
        color: 'var(--code-red)',
      },
    },
    // {
    //   types: ['property'],
    //   style: {
    //     color: 'rgb(128, 203, 196)',
    //   },
    // },
    // {
    //   types: ['namespace'],
    //   style: {
    //     color: 'rgb(178, 204, 214)',
    //   },
    // },
  ],
};

function Curl() {
  const { language, setLanguage } = useTheme();

  const [copyText, setCopyText] = useState('Copy');

  const pathParams = useSelector((state) => state.params.path);
  const queryParams = useSelector((state) => state.params.query);
  const cookieParams = useSelector((state) => state.params.cookie);
  const headerParams = useSelector((state) => state.params.header);
  const contentType = useSelector((state) => state.contentType);
  const body = useSelector((state) => state.body);
  const accept = useSelector((state) => state.accept);
  const postman = useSelector((state) => state.postman);

  const [codeText, setCodeText] = useState('');

  useEffect(() => {
    const postmanRequest = buildPostmanRequest(postman, {
      queryParams,
      pathParams,
      cookieParams,
      contentType,
      accept,
      headerParams,
      body,
    });

    codegen.convert(
      languageSet[language].language,
      languageSet[language].variant,
      postmanRequest,
      languageSet[language].options,
      (error, snippet) => {
        if (error) {
          return;
        }
        setCodeText(snippet);
      }
    );
  }, [
    accept,
    body,
    contentType,
    cookieParams,
    headerParams,
    language,
    pathParams,
    postman,
    queryParams,
  ]);

  const ref = useRef(null);

  const handleCurlCopy = () => {
    setCopyText('Copied');
    setTimeout(() => {
      setCopyText('Copy');
    }, 2000);
    navigator.clipboard.writeText(ref.current.innerText);
  };

  return (
    <>
      <div className={styles.buttonGroup}>
        <button
          className={language === 'curl' ? styles.selected : undefined}
          onClick={() => setLanguage('curl')}
        >
          cURL
        </button>
        <button
          className={language === 'node' ? styles.selected : undefined}
          onClick={() => setLanguage('node')}
        >
          Node
        </button>
        <button
          className={language === 'go' ? styles.selected : undefined}
          onClick={() => setLanguage('go')}
        >
          Go
        </button>
        <button
          className={language === 'python' ? styles.selected : undefined}
          onClick={() => setLanguage('python')}
        >
          Python
        </button>
      </div>

      <Highlight
        {...defaultProps}
        theme={languageTheme}
        code={codeText}
        language={languageSet[language].highlight}
      >
        {({ className, tokens, getLineProps, getTokenProps }) => (
          <div className="nick-floating-button">
            <button onClick={handleCurlCopy}>{copyText}</button>
            <pre
              className={className}
              style={{
                background: 'var(--ifm-codeblock-background-color)',
                paddingRight: '60px',
                borderRadius:
                  'calc(var(--ifm-pre-border-radius) / 3) calc(var(--ifm-pre-border-radius) / 3) var(--ifm-pre-border-radius) var(--ifm-pre-border-radius)',
              }}
            >
              <code ref={ref}>
                {tokens.map((line, i) => (
                  <span {...getLineProps({ line, key: i })}>
                    {line.map((token, key) => {
                      if (token.types.includes('arrow')) {
                        token.types = ['arrow'];
                      }
                      return <span {...getTokenProps({ token, key })} />;
                    })}
                    {'\n'}
                  </span>
                ))}
              </code>
            </pre>
          </div>
        )}
      </Highlight>
    </>
  );
}

export default Curl;
