export default {
  serverType: 'mock',
  typesOnly: false, // 只生成ts type
  target: 'typescript',
  splitBtCats: true, // 根据分类生成多个接口文件
  outputFilePath: 'output/api/', // 接口文件输出路径
  requestFunctionFilePath: 'output/api/request.ts', // 接口请求方法输出路径
  dataKey: 'data', // response 取值key
  jsonSchema: {
    enabled: true,
    requestData: true,
    requestValidate: true,
  },
  projects: [
    {
      token: 'a27c11db41f343a508b1fd7be514176884474777f82d9b6a7157735bb5910cc6',
      categories: [{
        id: 0,
      }],
    },
  ],
};
