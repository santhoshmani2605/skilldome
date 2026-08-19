// Lightweight Offline Code Execution Engine
// Dynamically loads web-assembly / javascript interpreters for 0-API execution

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="\${src}"]`)) {
      return resolve();
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load \${src}`));
    document.head.appendChild(script);
  });
};

export const runJavascript = async (code) => {
  return new Promise((resolve) => {
    let output = '';
    const originalLog = console.log;
    const originalInfo = console.info;
    const originalWarn = console.warn;
    const originalError = console.error;

    const capture = (...args) => {
      output += args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ') + '\n';
    };

    console.log = capture;
    console.info = capture;
    console.warn = capture;
    console.error = capture;

    try {
      const func = new Function(code);
      func();
      resolve({ success: true, output: output.trim() });
    } catch (err) {
      resolve({ success: false, error: err.toString(), output: output.trim() });
    } finally {
      console.log = originalLog;
      console.info = originalInfo;
      console.warn = originalWarn;
      console.error = originalError;
    }
  });
};

export const runPython = async (code, inputString = '') => {
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js');
    await loadScript('https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js');
  } catch (e) {
    return { success: false, error: 'Failed to load Python engine (Skulpt)', output: '' };
  }

  return new Promise((resolve) => {
    if (!window.Sk) return resolve({ success: false, error: 'Skulpt not initialized', output: '' });
    
    let output = '';
    window.Sk.configure({
      output: (text) => { output += text; },
      read: (x) => {
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined) {
          throw "File not found: '" + x + "'";
        }
        return window.Sk.builtinFiles["files"][x];
      },
      inputfun: () => {
        return new Promise((resolveInput) => {
           resolveInput(inputString); 
        });
      }
    });

    try {
      const myPromise = window.Sk.misceval.asyncToPromise(() => 
        window.Sk.importMainWithBody("<stdin>", false, code, true)
      );
      myPromise.then(() => {
        resolve({ success: true, output: output.trim() });
      }).catch((err) => {
        resolve({ success: false, error: err.toString(), output: output.trim() });
      });
    } catch (err) {
      resolve({ success: false, error: err.toString(), output: output.trim() });
    }
  });
};

export const runCpp = async (code, inputString = '') => {
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/JSCPP@2.0.7/lib/JSCPP.es5.min.js');
  } catch (e) {
    return { success: false, error: 'Failed to load C++ engine (JSCPP)', output: '' };
  }

  return new Promise((resolve) => {
    if (!window.JSCPP) return resolve({ success: false, error: 'JSCPP not initialized', output: '' });
    
    let output = '';
    const config = {
      stdio: {
        write: (s) => { output += s; },
        drain: () => {
           let temp = inputString;
           inputString = '';
           return temp;
        }
      }
    };
    
    try {
      window.JSCPP.run(code, inputString, config);
      resolve({ success: true, output: output.trim() });
    } catch (err) {
      resolve({ success: false, error: err.toString(), output: output.trim() });
    }
  });
};

export const runOfflineCode = async (language, sourceCode, sampleInput) => {
  const lang = language.toLowerCase();
  
  if (lang.includes('python')) {
    return await runPython(sourceCode, sampleInput);
  } 
  if (lang.includes('c++') || lang.includes('cpp') || lang === 'c' || lang.includes('c programming')) {
    return await runCpp(sourceCode, sampleInput);
  }
  if (lang.includes('js') || lang.includes('javascript')) {
    return await runJavascript(sourceCode);
  }
  
  // Unsupported offline language
  return null;
};
