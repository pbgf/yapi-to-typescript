export default ({
  serverType: 'promise',
  typesOnly: false, // 只生成ts type
  target: 'typescript',
  splitBtCats: true, // 根据分类生成多个接口文件
  outputFilePath: 'src/api/', // 接口文件输出路径
  requestFunctionFilePath: 'src/api/request.ts', // 接口请求方法输出路径
  dataKey: 'data', // response 取值key
  // 参数校验能力
  // jsonSchema: {
  //   enabled: true,
  //   requestData: true,
  //   requestValidate: true,
  // },
  projects: [
    {
      promiseKey: 'GkhJUlRsR',
      categories: [
        {
          id: 0,
        },
      ],
    },
  ],
});
