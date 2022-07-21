const { Command } = require('commander');
import * as TSNode from 'ts-node'
import consola from 'consola'
import fs from 'fs'
import path from 'path'
import Generator from './Generator';
// 注册ts-node方便 require直接可以解析ts文件
TSNode.register({
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
})

const program = new Command();
program
  .version('0.0.1')
  .description('一个接口代码生成工具');

program
  .option('-c, --config <filePath>', '指定配置文件')
  .action((options: any, command: any) => {
    let cwd!: string;
    let configTSFile!: string;
    let configJSFile!: string;
    if (options.config) {
      const filePath = options.config;
      console.log(options.config);
    } else {
      cwd = process.cwd();
      configTSFile = path.join(cwd, 'att.config.ts');
      configJSFile = path.join(cwd, 'att.config.js');
      const configTSFileExist = fs.existsSync(configTSFile);
      const configJSFileExist = fs.existsSync(configJSFile);
      const configExist = configJSFileExist || configTSFileExist;
      if (configExist) {
        const configFile = configTSFileExist ? configTSFile : configJSFile;
        const config = require(configFile).default;
        const generator = new Generator(config);
        generator.generate();
      } else {
        consola.error(`${configTSFile}配置文件不存在`);
      }
    }
  })

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  program.parse(process.argv);
} else {
  // this module was not run directly from the command line and probably loaded by something else
}
