export default {
  serverType: 'mock',
  typesOnly: false,
  splitBtCats: true,
  outputFilePath: 'output/api/',
  requestFunctionFilePath: 'output/api/request.ts',
  dataKey: 'data',
  projects: [
    {
      // promiseKey: 'arFgQ2LD8',
      token: '49b02f333e1af28f249ae2742de29f155bc05f3863800cdfcca7e3aa410ae913',
      categories: [{ 
        id: 0,
        // getRequestFunctionName(interfaceInfo, changeCase) {
        //   以接口全路径生成请求函数名
        //   return changeCase.camelCase(interfaceInfo.path);

        //   若生成的请求函数名存在语法关键词报错、或想通过某个关键词触发 IDE 自动引入提示，可考虑加前缀，如:
        //   return changeCase.camelCase(\`api_\${interfaceInfo.path}\`)

        //   若生成的请求函数名有重复报错，可考虑将接口请求方式纳入生成条件，如:
        //   return changeCase.camelCase(\`\${interfaceInfo.method}_\${interfaceInfo.path}\`)
        // },
      }],
    },
  ],
};
