export default {
  serverType: 'promise',
  typesOnly: false, // 只生成ts type
  target: 'typescript',
  splitBtCats: true, // 根据分类生成多个接口文件
  outputFilePath: 'output/api/', // 接口文件输出路径
  requestFunctionFilePath: 'output/api/request.ts', // 接口请求方法输出路径
  dataKey: 'data', // response 取值key
  projects: [
    {
      promiseKey: 'arFgQ2LD9',
      categories: [{
        id: 0,
        // getRequestFunctionName(interfaceInfo, changeCase) {
          // 若生成的请求函数名存在语法关键词报错、或想通过某个关键词触发 IDE 自动引入提示，可考虑加前缀，如:
          // return changeCase.camelCase(`api_\${interfaceInfo.path}`)
          // 若生成的请求函数名有重复报错，可考虑将接口请求方式纳入生成条件，如:
          // return changeCase.camelCase(`\${interfaceInfo.method}_\${interfaceInfo.path}`)
        // },
      }],
    },
  ],
};
