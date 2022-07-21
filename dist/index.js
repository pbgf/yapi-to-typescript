'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/** 请求方式 */
exports.Method = void 0;
(function (Method) {
    Method["GET"] = "GET";
    Method["POST"] = "POST";
    Method["PUT"] = "PUT";
    Method["DELETE"] = "DELETE";
    Method["HEAD"] = "HEAD";
    Method["OPTIONS"] = "OPTIONS";
    Method["PATCH"] = "PATCH";
})(exports.Method || (exports.Method = {}));
/** 是否必需 */
exports.Required = void 0;
(function (Required) {
    /** 不必需 */
    Required["false"] = "0";
    /** 必需 */
    Required["true"] = "1";
})(exports.Required || (exports.Required = {}));
/** 请求数据类型 */
exports.RequestBodyType = void 0;
(function (RequestBodyType) {
    /** 查询字符串 */
    RequestBodyType["query"] = "query";
    /** 表单 */
    RequestBodyType["form"] = "form";
    /** JSON */
    RequestBodyType["json"] = "json";
    /** 纯文本 */
    RequestBodyType["text"] = "text";
    /** 文件 */
    RequestBodyType["file"] = "file";
    /** 原始数据 */
    RequestBodyType["raw"] = "raw";
    /** 无请求数据 */
    RequestBodyType["none"] = "none";
})(exports.RequestBodyType || (exports.RequestBodyType = {}));
/** 请求路径参数类型 */
exports.RequestParamType = void 0;
(function (RequestParamType) {
    /** 字符串 */
    RequestParamType["string"] = "string";
    /** 数字 */
    RequestParamType["number"] = "number";
})(exports.RequestParamType || (exports.RequestParamType = {}));
/** 请求查询参数类型 */
exports.RequestQueryType = void 0;
(function (RequestQueryType) {
    /** 字符串 */
    RequestQueryType["string"] = "string";
    /** 数字 */
    RequestQueryType["number"] = "number";
})(exports.RequestQueryType || (exports.RequestQueryType = {}));
/** 请求表单条目类型 */
exports.RequestFormItemType = void 0;
(function (RequestFormItemType) {
    /** 纯文本 */
    RequestFormItemType["text"] = "text";
    /** 文件 */
    RequestFormItemType["file"] = "file";
})(exports.RequestFormItemType || (exports.RequestFormItemType = {}));
/** 返回数据类型 */
exports.ResponseBodyType = void 0;
(function (ResponseBodyType) {
    /** JSON */
    ResponseBodyType["json"] = "json";
    /** 纯文本 */
    ResponseBodyType["text"] = "text";
    /** XML */
    ResponseBodyType["xml"] = "xml";
    /** 原始数据 */
    ResponseBodyType["raw"] = "raw";
    // yapi 实际上返回的是 json，有另外的字段指示其是否是 json schema
    /** JSON Schema */
    // jsonSchema = 'json-schema',
})(exports.ResponseBodyType || (exports.ResponseBodyType = {}));
/** 查询字符串数组格式化方式 */
exports.QueryStringArrayFormat = void 0;
(function (QueryStringArrayFormat) {
    /** 示例: `a[]=b&a[]=c` */
    QueryStringArrayFormat["brackets"] = "brackets";
    /** 示例: `a[0]=b&a[1]=c` */
    QueryStringArrayFormat["indices"] = "indices";
    /** 示例: `a=b&a=c` */
    QueryStringArrayFormat["repeat"] = "repeat";
    /** 示例: `a=b,c` */
    QueryStringArrayFormat["comma"] = "comma";
    /** 示例: `a=["b","c"]` */
    QueryStringArrayFormat["json"] = "json";
})(exports.QueryStringArrayFormat || (exports.QueryStringArrayFormat = {}));

/**
 * 定义配置。
 *
 * @param config 配置
 */
function defineConfig(config, hooks) {
    if (hooks) {
        Object.defineProperty(config, 'hooks', {
            value: hooks,
            configurable: false,
            enumerable: false,
            writable: false,
        });
    }
    return config;
}
class FileData {
    /**
     * 文件数据辅助类，统一网页、小程序等平台的文件上传。
     *
     * @param originalFileData 原始文件数据
     * @param options 若使用内部的 getFormData，则选项会被其使用
     */
    constructor(originalFileData, options) {
        this.originalFileData = originalFileData;
        this.options = options;
    }
    /**
     * 获取原始文件数据。
     *
     * @returns 原始文件数据
     */
    getOriginalFileData() {
        return this.originalFileData;
    }
    /**
     * 获取选项。
     */
    getOptions() {
        return this.options;
    }
}
/**
 * 解析请求数据，从请求数据中分离出普通数据和文件数据。
 *
 * @param requestData 要解析的请求数据
 * @returns 包含普通数据(data)和文件数据(fileData)的对象，data、fileData 为空对象时，表示没有此类数据
 */
function parseRequestData(requestData) {
    const result = {
        data: {},
        fileData: {},
    };
    /* istanbul ignore else */
    if (requestData != null) {
        if (typeof requestData === 'object' && !Array.isArray(requestData)) {
            Object.keys(requestData).forEach(key => {
                if (requestData[key] && requestData[key] instanceof FileData) {
                    result.fileData[key] = requestData[key].getOriginalFileData();
                }
                else {
                    result.data[key] = requestData[key];
                }
            });
        }
        else {
            result.data = requestData;
        }
    }
    return result;
}
const queryStringify = (key, value, arrayFormat) => {
    let str = '';
    if (value != null) {
        if (!Array.isArray(value)) {
            str = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        }
        else if (arrayFormat === exports.QueryStringArrayFormat.indices) {
            str = value
                .map((v, i) => `${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(v)}`)
                .join('&');
        }
        else if (arrayFormat === exports.QueryStringArrayFormat.repeat) {
            str = value
                .map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
                .join('&');
        }
        else if (arrayFormat === exports.QueryStringArrayFormat.comma) {
            str = `${encodeURIComponent(key)}=${encodeURIComponent(value.join(','))}`;
        }
        else if (arrayFormat === exports.QueryStringArrayFormat.json) {
            str = `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`;
        }
        else {
            str = value
                .map(v => `${encodeURIComponent(`${key}[]`)}=${encodeURIComponent(v)}`)
                .join('&');
        }
    }
    return str;
};
/**
 * 准备要传给请求函数的参数。
 */
function prepare(requestConfig, requestData) {
    let requestPath = requestConfig.path;
    const { data, fileData } = parseRequestData(requestData);
    const dataIsObject = data != null && typeof data === 'object' && !Array.isArray(data);
    if (dataIsObject) {
        // 替换路径参数
        if (Array.isArray(requestConfig.paramNames) &&
            requestConfig.paramNames.length > 0) {
            Object.keys(data).forEach(key => {
                if (requestConfig.paramNames.indexOf(key) >= 0) {
                    // ref: https://github.com/YMFE/yapi/blob/master/client/containers/Project/Interface/InterfaceList/InterfaceEditForm.js#L465
                    requestPath = requestPath
                        .replace(new RegExp(`\\{${key}\\}`, 'g'), data[key])
                        .replace(new RegExp(`/:${key}(?=/|$)`, 'g'), `/${data[key]}`);
                    delete data[key];
                }
            });
        }
        // 追加查询参数到路径上
        let queryString = '';
        if (Array.isArray(requestConfig.queryNames) &&
            requestConfig.queryNames.length > 0) {
            Object.keys(data).forEach(key => {
                if (requestConfig.queryNames.indexOf(key) >= 0) {
                    if (data[key] != null) {
                        queryString += `${queryString ? '&' : ''}${queryStringify(key, data[key], requestConfig.queryStringArrayFormat)}`;
                    }
                    delete data[key];
                }
            });
        }
        if (queryString) {
            requestPath += `${requestPath.indexOf('?') > -1 ? '&' : '?'}${queryString}`;
        }
    }
    // 全部数据
    const allData = Object.assign(Object.assign({}, (dataIsObject ? data : {})), fileData);
    // 获取表单数据
    const getFormData = () => {
        const useNativeFormData = typeof FormData !== 'undefined';
        const useNodeFormData = !useNativeFormData &&
            // https://github.com/fjc0k/vtils/blob/master/src/utils/inNodeJS.ts
            typeof global === 'object' &&
            typeof global['process'] === 'object' &&
            typeof global['process']['versions'] === 'object' &&
            global['process']['versions']['node'] != null;
        const UniFormData = useNativeFormData
            ? FormData
            : useNodeFormData
                ? eval(`require('form-data')`)
                : undefined;
        if (!UniFormData) {
            throw new Error('当前环境不支持 FormData');
        }
        const formData = new UniFormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        Object.keys(fileData).forEach(key => {
            const options = requestData[key].getOptions();
            formData.append(key, fileData[key], useNativeFormData ? options === null || options === void 0 ? void 0 : options.filename : options);
        });
        return formData;
    };
    return Object.assign(Object.assign({}, requestConfig), { path: requestPath, rawData: requestData, data: data, hasFileData: fileData && Object.keys(fileData).length > 0, fileData: fileData, allData: allData, getFormData: getFormData });
}

exports.FileData = FileData;
exports.defineConfig = defineConfig;
exports.parseRequestData = parseRequestData;
exports.prepare = prepare;
