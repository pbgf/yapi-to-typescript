import { defineConfig } from './lib/index';

export default defineConfig({
  serverType: 'mock',
  typesOnly: false, // 只生成ts type
  target: 'typescript',
  splitBtCats: true, // 根据分类生成多个接口文件
  outputFilePath: 'output/api/', // 接口文件输出路径
  requestFunctionFilePath: 'output/api/request.ts', // 接口请求方法输出路径
  dataKey: 'data', // response 取值key
  projects: [
    {
      // promiseKey: 'arFgQ2LD8', // promise平台key
      token: '49b02f333e1af28f249ae2742de29f155bc05f3863800cdfcca7e3aa410ae913',
      categories: [{
        id: 0,
      }],
    },
  ],
});
