# [WIP] ts-pgql-on-rdbms
[PGQL on RDBMS](https://docs.oracle.com/en/database/oracle/property-graph/21.1/spgdg/property-graph-query-language-pgql.html#GUID-94F08780-EC3D-4F9B-985F-49984939E61C) を typescript で実行するためのライブラリです。

PGQL on RDBMS は PGQL を SQL に変換して実行してするためのモジュールで Java ライブラリとして提供されています。
Oracle から提供される この Java ライブラリを [node-java](https://github.com/joeferner/node-java) を利用して、
typescript から実行可能にしたものがこのライブラリです。

※ 2021年3月21日現在では構想段階であり、Experimental なライブラリです。

## ビルドのための事前準備
本ライブラリを実行するためには、以下のソフトウェアが必要です。

- Oracle Database 19c
- Oracle Graph Client 21.1
- NodeJS v14.15.5 以上
- JDK 11 

### 1. Oracle Database 19c のインストール
- ローカルに Oracle Database を構築する場合には、以下を利用する
  - https://container-registry.oracle.com/pls/apex/f?p=113:10:4723150240763:::RP,10::
  - https://github.com/oracle/docker-images

### 2. Oracle Graph Client PL/SQL 21.1 パッケージを適用
- [Oracle Graph Server and Client](https://www.oracle.com/database/technologies/spatialandgraph/property-graph-features/graph-server-and-client/graph-server-and-client-downloads.html) から `Oracle Graph Client for PL/SQL` をダウンロードし、
  zip ファイルを解凍して、格納されている README に従ってパッチを適用する

### 3. Oracle Graph Client 21.1 をダウンロード
- [Oracle Graph Server and Client](https://www.oracle.com/database/technologies/spatialandgraph/property-graph-features/graph-server-and-client/graph-server-and-client-downloads.html) から `Oracle Graph Client for PL/SQL` をダウンロードし、
  zip ファイルを解凍して、格納されている `lib` ディレクトリ以下の `jar` ファイルをすべて `libs` 以下に配置する

- jar ファイル配置後は以下のような構成となる
  - **ts-pgql-rdbms には実際にはすべての jar ファイルは必要ないため、今後必要な jar ファイルのみを配置するように修正する**

```sh
$ tree -N ./libs
./libs
├── accessors-smart-1.2.jar
├── antlr4-runtime-4.7.1.jar
├── aopalliance-1.0.jar
├── asm-5.0.4.jar
├── avro-1.7.7.jar
├── capsule-0.6.3.jar
├── commons-codec-1.14.jar
├── commons-collections-3.2.2.jar
├── commons-configuration-1.10.jar
├── commons-configuration2-2.7.jar
├── commons-configuration2-jackson-0.10.0.jar
├── commons-io-2.8.0.jar
├── commons-lang-2.6.jar
├── commons-lang3-3.11.jar
├── commons-logging-1.2.jar
├── commons-text-1.8.jar
├── commons-vfs2-2.6.0.jar
├── failureaccess-1.0.1.jar
├── fastutil-8.2.3.jar
├── fluent-hc-4.5.13.jar
├── graal-sdk-20.2.1.jar
├── graph-query-ir-1.3-1.4.0.jar
├── gremlin-core-3.4.5.jar
├── gremlin-shaded-3.4.5.jar
├── guava-28.2-jre.jar
├── guice-4.2.3.jar
├── guice-multibindings-4.2.3.jar
├── httpclient-4.5.13.jar
├── httpcore-4.4.11.jar
├── jackson-annotations-2.11.0.jar
├── jackson-core-2.11.0.jar
├── jackson-core-asl-1.9.13.jar
├── jackson-databind-2.11.0.jar
├── jackson-dataformat-yaml-2.11.0.jar
├── jackson-mapper-asl-1.9.13.jar
├── jansi-1.17.1.jar
├── javapoet-1.8.0.jar
├── javatuples-1.2.jar
├── javax.inject-1.jar
├── jcip-annotations-1.0-1.jar
├── jline-2.14.6.jar
├── json-sanitizer-1.2.1.jar
├── json-smart-2.3.jar
├── listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar
├── log4j-api-2.13.3.jar
├── log4j-core-2.13.3.jar
├── log4j-jcl-2.13.3.jar
├── log4j-slf4j-impl-2.13.3.jar
├── log4j2.xml
├── nimbus-jose-jwt-8.16.jar
├── ojdbc8-18.3.0.jar
├── ons-18.3.0.jar
├── opg-client-21.1.0.jar
├── opg-dal_common-21.1.0.jar
├── opg-dal_nosql-21.1.0.jar
├── opg-dal_rdbms-21.1.0.jar
├── opg-sombrero_jshell-21.1.0.jar
├── opg-sombrero_shell-21.1.0.jar
├── oracle-nosql-client-18.3.14.jar
├── oraclepki-18.3.0.jar
├── orai18n-18.3.0.jar
├── org.metaborg.spoofax.core.uber-2.5.11.jar
├── osdt_cert-18.3.0.jar
├── osdt_core-18.3.0.jar
├── pgql-lang-1.3-1.4.0.jar
├── pgql-on-rdbms-21.1.0.jar
├── pgx-api-21.1.2.jar
├── pgx-client-21.1.2.jar
├── pgx-common_core-21.1.2.jar
├── pgx-common_rest-21.1.2.jar
├── pgx-config-21.1.2.jar
├── pgx-jshell-21.1.2.jar
├── pgx-pypgx-21.1.2.jar
├── pgx-shell-21.1.2.jar
├── pgx-shell_common-21.1.2.jar
├── reactive-streams-1.0.3.jar
├── rxjava-3.0.2.jar
├── sdoutl-2019-01-05.jar
├── simplefan-18.3.0.jar
├── slf4j-api-1.7.26.jar
├── snakeyaml-1.26.jar
├── swagger-annotations-1.6.2.jar
├── threetenbp-1.3.8.jar
├── truffle-api-20.2.1.jar
└── ucp-18.3.0.jar

0 directories, 85 files
```

### 3. JDK 11 をインストール
- https://www.oracle.com/jp/java/technologies/javase-jdk11-downloads.html

### 4. NodeJS 14 以上をインストール
- node のバージョンマネージャを利用している等それぞれ管理方法があることが考えられるため、
  それぞれの方法に従ってインストールする
  - [公式URL](https://nodejs.org/ja/download/)

### 5. npm インストール

```sh
$ npm install
```

### 6. PGX_CLASSPATH 環境変数の設定
- `PGX_CLASSPATH` 環境変数に Oracle Graph Client の jar が格納されているディレクトリを指定する

```sh
$ export PGX_CLASSPATH=`pwd`/libs/
```

## テスト実行手順
1. テストを実行する Oracle Database への接続 JDBC URLを `TEST_JDBC_URL`環境変数に設定する

```sh
$ export TEST_JDBC_URL="jdbc:oracle:thins:@localhost:21521/pdb1"
```

2. テストを実行する Oracle Database のユーザ名を `TEST_DB_USER` 環境変数に設定する

```sh
$ export TEST_DB_USER="test_user"
```

3. テストを実行する Oracle Database のユーザのパスワードを `TEST_DB_PASSWORD` 環境変数に設定する

```sh
$ export TEST_DB_PASSWORD="welcome1"
```

4. npm test を実行

```sh
$ npm test

> ts-pgql-on-rdbms@0.0.1 test ~/ts-pgql-on-rdbms
> jest

 PASS  test/PgqlResultSet.test.ts (41.72 s)
 PASS  test/PgqlPreparedStatement.test.ts (58.477 s)
 PASS  test/PgqlStatement.test.ts (59.603 s)
 PASS  test/Resource.test.ts (7.299 s)
 PASS  test/Oracle.test.ts (6.926 s)
 PASS  test/PgqlConnection.test.ts (35.672 s)

Test Suites: 6 passed, 6 total
Tests:       14 passed, 14 total
Snapshots:   0 total
Time:        81.349 s, estimated 82 s
Ran all test suites.
```

## ts-pgql-on-rdbms 使用例

```typescript
import * as pgql from 'ts-pgql-on-rdbms'

const config: pgql.OracleConfig = new pgql.OracleConfigBuilder()
  .user('test_user')
  .password('welcome1')
  .url('jdbc:oracle:thin:@localhost:21521/pdb1')
  .build()

const connManager: pgql.OracleConnectionManager = pgql.OracleConnectionManager.getInstance(
  config,
)

async function executePgql() {
  try {
    const conn = await connManager.getConnection()

    await pgql.tryWith(conn, async (conn: pgql.OracleConnection) => {
      const pgqlConn: pgql.PgqlConnection = await pgql.PgqlConnection.getConnection(
        conn,
      )

      const pstmt: pgql.PareparedStatement = await pgqlConn.prepareStatement(`
        SELECT n.LONG_PROP, n.STR_PROP
        FROM MATCH (n:VL) ON test_graph
        WHERE id(n) = ?
      `)

      await pgql.tryWith(pstmt, async (pstmt: pgql.PgqlPreparedStatement) => {
        pstmt.setLong(1, 1)

        const rs: pgql.PgqlResultSet = await pgqlConn.executeQuery()
        await pgql.tryWith(rs, async (rs: pgql.PgqlResultSet) => {
          while (rs.next()) {
            rs.getString('STR_PROP')
            rs.getLong('LONG_PROP')
          }
        })
      })
    })
  } catch (err) {
    console.log(err)
  }
}

executePgql().then(() => {});
```
