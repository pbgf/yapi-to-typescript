#!/usr/bin/env node
'use strict';

var TSNode = require('ts-node');
var consola = require('consola');
var fs = require('fs');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var TSNode__namespace = /*#__PURE__*/_interopNamespace(TSNode);
var consola__default = /*#__PURE__*/_interopDefaultLegacy(consola);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

const promiseBaseUrl = 'http://10.88.128.16:8000/promise-mock';
const appname = 'tsmeta';
const appkey = '332ca3f3af6b0a634368e2b1e9085e05';

const fetch = require('node-fetch');
function httpGet(url, query, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const _url = new URL(url);
        if (query) {
            Object.keys(query).forEach(key => {
                _url.searchParams.set(key, query[key]);
            });
        }
        url = _url.toString();
        const res = yield fetch(url, Object.assign({ method: 'GET' }, (options || {})));
        return res.json();
    });
}
/**
 * 抛出错误。
 *
 * @param msg 错误信息
 */
function throwError(...msg) {
    /* istanbul ignore next */
    throw new Error(msg.join(''));
}

const md5 = require('md5');
class Generator {
    constructor(config) {
        this.config = config;
    }
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            const { serverType } = this.config;
            switch (serverType) {
                case 'mock':
                    this.fetchMockProject();
                    break;
                case 'promise':
                    this.fetchPromiseProject();
                    break;
            }
        });
    }
    fetchPromiseProject() {
        return __awaiter(this, void 0, void 0, function* () {
            const { projects } = this.config;
            yield Promise.all(projects.map(project => {
                const { promiseKey } = project;
                const timestamp = new Date().valueOf();
                return this.fetchApi(`${promiseBaseUrl}/api/public/interfaces`, {
                    platform_id: promiseKey,
                }, {
                    headers: {
                        appname,
                        appkey,
                        timestamp,
                        sign: md5(`appName=tsmeta&appKey=${appkey}&timestamp=${timestamp}`),
                    }
                });
            })).catch((err) => {
                console.log(err);
            });
        });
    }
    fetchMockProject() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    fetchApi(url, query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield httpGet(url, query, options);
            /* istanbul ignore next */
            if (res && res.errcode) {
                throwError(res.errmsg);
            }
            return res.data || res;
        });
    }
}

const { Command } = require('commander');
// 注册ts-node方便 require直接可以解析ts文件
TSNode__namespace.register({
    // 不加载本地的 tsconfig.json
    skipProject: true,
    // 仅转译，不做类型检查
    transpileOnly: true,
    // 自定义编译选项
    compilerOptions: {
        strict: false,
        target: 'es2017',
        module: 'commonjs',
        moduleResolution: 'node',
        declaration: false,
        removeComments: false,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        importHelpers: false,
        allowJs: true,
        lib: ['es2017'],
    },
});
const program = new Command();
program
    .version('0.0.1')
    .description('一个接口代码生成工具');
program
    .option('-c, --config <filePath>', '指定配置文件')
    .action((options, command) => {
    let cwd;
    let configTSFile;
    let configJSFile;
    if (options.config) {
        options.config;
        console.log(options.config);
    }
    else {
        cwd = process.cwd();
        configTSFile = path__default["default"].join(cwd, 'att.config.ts');
        configJSFile = path__default["default"].join(cwd, 'att.config.js');
        const configTSFileExist = fs__default["default"].existsSync(configTSFile);
        const configJSFileExist = fs__default["default"].existsSync(configJSFile);
        const configExist = configJSFileExist || configTSFileExist;
        if (configExist) {
            const configFile = configTSFileExist ? configTSFile : configJSFile;
            const config = require(configFile).default;
            const generator = new Generator(config);
            generator.generate();
        }
        else {
            consola__default["default"].error(`${configTSFile}配置文件不存在`);
        }
    }
});
if (require.main === module) {
    // this module was run directly from the command line as in node xxx.js
    program.parse(process.argv);
}
