const { Command } = require('commander');
import * as TSNode from 'ts-node'
import consola from 'consola'
import fs from 'fs-extra'
import path from 'path'
import prompt from 'prompts'
import Generator from './Generator';
import dedent from 'dedent';
import { Defined } from 'vtils/types';
import { ServerConfig } from './types';
import { run } from 'vtils';
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
  .action(async (options: any, command: any) => {
    let cwd!: string;
    // let useCustomConfigFile = false
    let configTSFile!: string;
    let configJSFile!: string;
    let configExist!: boolean;
    let configFile!: string;
    let configTSFileExist!: boolean;
    let configJSFileExist!: boolean;
    cwd = process.cwd();
    if (options.config) {
      configFile = path.join(cwd, options.config);
      configExist = await fs.existsSync(configFile);
      // useCustomConfigFile = true;
    } else {
      configTSFile = path.join(cwd, 'att.config.ts');
      configJSFile = path.join(cwd, 'att.config.js');
      configTSFileExist = fs.existsSync(configTSFile);
      configJSFileExist = fs.existsSync(configJSFile);
      configExist = configJSFileExist || configTSFileExist;
      configFile = configTSFileExist ? configTSFile : configJSFile;
    }
    if (configExist) {
      const config = require(configFile).default;
      consola.info(`读取配置文件${configFile}成功`);
      const generator = new Generator(config);
      await generator.prepare();
      consola.info('开始生成代码');
      const output = await generator.generate();
      consola.info('生成成功，开始写入');
      await generator.write(output);
      await generator.destroy();
      consola.success('成功，coding happy');
    } else {
      consola.error(`${configTSFile}配置文件不存在`);
    }
  })

program
  .command('init')
  .argument('[serverType]', '服务平台')
  .argument('[projectKey]', '项目key')
  .description('init config file')
  .action(async (serverType?: string, projectKey?: string) => {
    const cwd = process.cwd()
    const configTSFile = path.join(cwd, 'att.config.ts')
    const configJSFile = path.join(cwd, 'att.config.js')
    const configTSFileExist = await fs.pathExists(configTSFile)
    const configJSFileExist =
      !configTSFileExist && (await fs.pathExists(configJSFile))
    const configFileExist = configTSFileExist || configJSFileExist
    const configFile = configTSFileExist ? configTSFile : configJSFile
    if (configFileExist) {
      consola.info(`检测到配置文件: ${configFile}`)
      const answers = await prompt({
        message: '是否覆盖已有配置文件?',
        name: 'override',
        type: 'confirm',
      })
      if (!answers.override) return
    }
    let outputConfigFile!: string
    let outputConfigFileType!: 'ts' | 'js'
    if (serverType) {
      outputConfigFile = configTSFile;
      outputConfigFileType = 'ts';
    } else {
      const answers = await prompt({
        message: '选择配置文件类型?',
        name: 'configFileType',
        type: 'select',
        choices: [
          { title: 'TypeScript(att.config.ts)', value: 'ts' },
          { title: 'JavaScript(att.config.js)', value: 'js' },
        ],
      })
      outputConfigFile =
        answers.configFileType === 'js' ? configJSFile : configTSFile
      outputConfigFileType = answers.configFileType
    }
    const [,projectKetText] = await run(() => {
      if (serverType === 'promise') {
        return `promiseKey: '${projectKey}'`;
      }
      if (serverType === 'mock') {
        return `token: '${projectKey}'`;
      }
      return dedent`
        promiseKey: 'arFgQ2LD8', // promise平台key
        // token: '49b02f333e1af28f249ae2742de29f155bc05f3863800cdfcca7e3aa410ae913',
      `
    });
    await fs.outputFile(
      outputConfigFile,
      dedent`
        import { defineConfig } from '@didi/api-to-typescript'

        export default defineConfig({
          serverType: '${
            serverType || 'promise'
          }',
          typesOnly: false, // 只生成ts type
          target: '${
            (outputConfigFileType === 'js'
              ? 'javascript'
              : 'typescript') as Defined<ServerConfig['target']>
          }',
          splitBtCats: true, // 根据分类生成多个接口文件
          outputFilePath: 'output/api/', // 接口文件输出路径
          requestFunctionFilePath: 'output/api/request.ts', // 接口请求方法输出路径
          dataKey: 'data', // response 取值key
          // 参数校验能力
          // jsonSchema: {
          //   enabled: true,
          //   requestData: true,
          //   requestValidate: true,
          // },
          projects: [
            {
              ${projectKetText},
              categories: [
                {
                  id: 0,
                },
              ],
            },
          ],
        });

      `,
    )
    consola.success('写入配置文件完毕')
  })

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  program.parse(process.argv);
} else {
  // this module was not run directly from the command line and probably loaded by something else
}
