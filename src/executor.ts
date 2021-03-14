import { PgqlConnection } from './core/PgqlConnection'
import { PgqlPreparedStatement } from './core/PgqlPreparedStatement'
import { PgqlResultSet } from './core/PgqlResultSet'
import {
  DEFAULT_MODIFY_OPTIONS,
  DEFAULT_OPTIONS,
  DEFAULT_SELECT_OPTIONS,
  genereateModifyOptionString,
  genereateSelectOptionString,
  IModifyOptions,
  IOptions,
  ISelectOptions,
} from './option'
import { IParameters } from './parameter'
import { IParameterHandler } from './parameter-handler'

/**
 * TODO: document comment
 */
export interface IExecutor {
  /**
   * TODO: document comment
   */
  query(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
    selectOptions?: ISelectOptions,
  ): Promise<PgqlResultSet>

  /**
   * TODO: document comment
   */
  modify(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
    selectOptions?: ISelectOptions,
    modifyOptions?: IModifyOptions,
  ): Promise<boolean>
}

/**
 * TODO: document comment
 */
export class Executor implements IExecutor {
  /**
   * TODO: document comment
   */
  async query(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
    selectOptions?: ISelectOptions,
  ): Promise<PgqlResultSet> {
    // TODO: implements PreparedStatement cache
    const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(pgql)
    parameterHandler.setParameters(pstmt, parameters)

    if (options !== undefined) {
      const _selectOptions: ISelectOptions =
        selectOptions === undefined ? DEFAULT_SELECT_OPTIONS : selectOptions

      return pstmt.executeQueryWithOptions(
        options.timeout,
        options.parallel,
        options.dynamicSampling,
        options.maxResults,
        genereateSelectOptionString(_selectOptions),
      )
    }

    return pstmt.executeQuery()
  }

  /**
   * TODO: document comment
   */
  async modify(
    pgqlConn: PgqlConnection,
    pgql: string,
    parameterHandler: IParameterHandler,
    parameters?: IParameters,
    options?: IOptions,
    selectOptions?: ISelectOptions,
    modifyOptions?: IModifyOptions,
  ): Promise<boolean> {
    // TODO: implements PreparedStatement cache
    const pstmt: PgqlPreparedStatement = await pgqlConn.prepareStatement(pgql)
    parameterHandler.setParameters(pstmt, parameters)

    const _options: IOptions =
      options !== undefined ? options! : DEFAULT_OPTIONS
    const _selectOptions: ISelectOptions =
      selectOptions !== undefined ? selectOptions! : DEFAULT_SELECT_OPTIONS
    const _modifyOptions: IModifyOptions =
      modifyOptions !== undefined ? modifyOptions! : DEFAULT_MODIFY_OPTIONS

    return pstmt.executeWithOptions(
      _options.parallel,
      _options.dynamicSampling,
      genereateSelectOptionString(_selectOptions),
      genereateModifyOptionString(_modifyOptions),
    )
  }
}
