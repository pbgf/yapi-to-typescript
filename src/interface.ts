export interface ServerConfig {

  /**
   * 服务类型
   *
   * @default 'promise'
   */
  serverType?: 'mock' | 'promise'

  /**
   * 项目列表
   */
  projects: ProjectConfig[]
}

export interface ProjectConfig {
  /**
   * promise平台的key
   */
  promiseKey?: string;

  /**
   * mock平台的token
   */
  token?: string;

  /**
   * 是否按照目录拆分接口文件
   * TODO 待支持
   */
  splitByCategory?: boolean;

  /**
   * 分类列表。
   */
  categories: CategoryConfig[];
}

/**
 * 分类的配置。
 */
 export interface CategoryConfig {
  /**
   * 分类 ID，可以设置多个。设为 `0` 时表示全部分类。
   *
   * 如果需要获取全部分类，同时排除指定分类，可以这样：`[0, -20, -21]`，分类 ID 前面的负号表示排除。
   *
   * 获取方式：mock平台 打开项目 --> 点开分类 --> 复制浏览器地址栏 `/api/cat_` 后面的数字。
   * promise平台 url参数的menuId
   *
   * @example 20
   */
  id: string | string[]
}